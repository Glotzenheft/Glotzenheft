import os
import pandas as pd
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv, find_dotenv
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# define environment variables
load_dotenv(find_dotenv())


knn_df = None
knn_content_df = None
tmdb_lookup = {}


def checkUserAuth(requestURL, token):
    # authenticate user via backend
    print("verify user authentication ...")
    try:
        base = os.path.dirname(__file__)
        verification_route = os.path.join(base, 'rootCA.pem')
        response = requests.get(
            requestURL,
            verify=verification_route,
            headers={
                "Authorization": f"Bearer {token}"}
        )

        if response.status_code == 200:
            isCheckValid = response.json().get("status")
            print("got answer from server successfully ...")

            if (isCheckValid != "Token is valid"):
                raise HTTPException(status_code=400, detail="token is invalid")
                print("token validation successfull")
        else:
            raise HTTPException(status_doe=500, detail="error when try to validate token")
    except:
        raise HTTPException(status_code=400, detail="could not verify token")

class RecommendationRequest(BaseModel):
    tmdbid: int
    movieTitle: str
    token: str
    backendIP: str

class HighestRecommendationRequest(BaseModel):
    token: str
    backendIP: str


@app.on_event("startup")
def startup():
    global knn_df, knn_content_df, tmdb_lookup, CONN_STR, DB_NAME, COLL_NAME, api_key, client, database, collection, API_AUTH_ROUTE
    base = os.path.dirname(__file__)

    try:
        # get all environment variables
        environment_variables = pd.read_json(os.path.join(base, "env.json"))
        CONN_STR = environment_variables.get("mongodb")[0]
        DB_NAME = environment_variables.get("db")[0]
        COLL_NAME = environment_variables.get("collection")[0]
        api_key = environment_variables.get("api")[0]
    except:
        raise HTTPException(status_code=500, detail="no credentials found")

    try:
        # connect to DB
        client = MongoClient(
            CONN_STR)  # pymongo verbindet sich automatisch per SSL/TLS :contentReference[oaicite:0]{index=0}
        database = client[DB_NAME]
        collection = database[COLL_NAME]
    except:
        raise HTTPException(status_code=500, detail="could not connect to db")

    # 1) read tables from KNN 
    knn_df = pd.read_csv(os.path.join(base, 'knn_recs.csv'))
    knn_content_df = pd.read_csv(os.path.join(base, 'knn_content_recs.csv'))

    # 2) join links with titles (.csv files)
    links_df = pd.read_csv(os.path.join(base, 'links.csv'))
    movies_df = pd.read_csv(os.path.join(base, 'movies.csv'))
    merged = pd.merge(links_df, movies_df, on='movieId', how='inner')
    merged = merged.dropna(subset=['tmdbId', 'title'])
    merged['tmdbId'] = merged['tmdbId'].astype(int)
    tmdb_lookup = dict(zip(merged['tmdbId'], merged['title']))


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/recommendation")
def recommendation(req: RecommendationRequest):
    # get recommendation for given movie
    if type(req.tmdbid) is not int:
        raise HTTPException(status_code=400, detail="tmdbid must be an integer")

    base = os.path.dirname(__file__)
    tmdb_id = int(req.tmdbid)
    movie_title = req.movieTitle

    headers = {
        'accept': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    # authenticate user
    print("verify user authentication ...")

    checkUserAuth(req.backendIP, req.token)



    # --- model 1: KNN CF ---
    recs_1 = []
    row1 = knn_df[knn_df.tmdbId == tmdb_id]
    if not row1.empty:
        for col in [c for c in row1.columns if c.startswith('knn_rec')]:
            val = row1.iloc[0][col]
            if pd.notna(val):
                recs_1.append({
                    "tmdb_id": int(val),
                    "title": tmdb_lookup.get(int(val), "Unknown"),
                    "media_type": "movie"
                })
                if len(recs_1) == 4:
                    break

    # --- model 2: KNN Content ---
    recs_2 = []
    row2 = knn_content_df[knn_content_df.tmdbId == tmdb_id]
    if not row2.empty:
        for col in [c for c in row2.columns if c.startswith('rec_')]:
            val = row2.iloc[0][col]
            if pd.notna(val):
                recs_2.append({
                    "tmdb_id": int(val),
                    "title": tmdb_lookup.get(int(val), "Unknown"),
                    "media_type": "movie"
                })
                if len(recs_2) == 4:
                    break

    # --- model 3: TMDB-API ---
    recs_3 = []
    try:
        resp = requests.get(
            f"https://api.themoviedb.org/3/movie/{tmdb_id}/recommendations",
            headers=headers
        )
        if resp.status_code == 200:
            arr = resp.json().get("results", [])[:4]
            for r in arr:
                tid = r.get("id")
                media_type = r.get("media_type")
                title = r.get("title") or r.get("name") or "Unknown"
                if tid is not None and media_type is not None:
                    recs_3.append({"tmdb_id": int(tid), "title": title, "media_type": media_type})
    except:
        pass

    # update MongoDB
    filter_results = collection.find({"tmdbId": tmdb_id})
    results_list = list(filter_results)
    update_answer = {"success": False, "content": ""}

    try:
        if len(results_list) < 1:
            # no entries for given movie in DB
            collection.insert_one(
                {"tmdbId": tmdb_id, "title": movie_title, "count": 1, "lastUpdated": {"$date": datetime.utcnow()}})
            update_answer = {"success": True, "content": "new document created successfully"}
        else:
            # update existing entry for given movie (increment count by 1)
            updatedData = collection.update_one(
                {"tmdbId": tmdb_id},
                {
                    "$inc": {"count": 1},
                    "$set": {"lastUpdated": datetime.utcnow()}
                },
                upsert=False  # kein neues Dokument anlegen, wenn tmdbId nicht gefunden
            )

            if updatedData.matched_count:
                update_answer = {"success": True, "content": "updated existing document successfully"}

    except:
        pass

    return {
        "recommendation1": recs_1,
        "recommendation2": recs_2,
        "recommendation3": recs_3,
        "updatedStatus": update_answer
    }


# get 4 movies with highest count from MongoDB
@app.post("/highest-movies")
def getHighestMoviesFromDB(req: HighestRecommendationRequest):
    checkUserAuth(req.backendIP, req.token)
    
    movie_data = collection.find({})
    highest_movies_list = list(movie_data.sort("count", -1).limit(4))
    highest_movies_mapped = [{"tmdbId": m["tmdbId"], "title": m["title"]} for m in highest_movies_list]

    return {"movies": highest_movies_mapped}

