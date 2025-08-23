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

# activate CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # oder ["*"] für Entwicklung
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# define environment variables
load_dotenv(find_dotenv())

# Wird beim Startup geladen
knn_df = None
knn_content_df = None
tmdb_lookup = {}



class RecommendationRequest(BaseModel):
    tmdbid: int
    title: str
    posterPath: str
    token: str
    backendIP: str


class HighestRecommendationRequest(BaseModel):
    token: str
    backendIP: str


def checkUserAuth(requestURL, token):
    # authenticate user via backend
    print("verify user authentication ...")
    try:
        base = os.path.dirname(__file__)
        verification_route = os.path.join(base, 'rootCA.pem')
        response = requests.get(
            "http://host.docker.internal:8000/api/auth/check",
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



def update_db(tmdb_id: int, media_type: str, title: str, poster: str):
    # MongoDB aktualisieren
    filter_results = collection.find({"tmdbId": tmdb_id})
    results_list = list(filter_results)
    update_answer = {"success": False, "content": ""}

    try:
        if len(results_list) < 1:
            # keine Einträge für diese TMDB-ID vorhanden
            collection.insert_one(
                {"tmdbId": tmdb_id, "title": title, "mediaType": media_type, "posterPath": poster, "count": 1, "lastUpdated": {"$date": datetime.utcnow()}})
            update_answer = {"success": True, "content": "new document created successfully"}
        else:
            # es gibt einen Eintrag -> erhöhe "count" um 1 und setze "lastUpdated" auf das aktuelle Datum
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
        raise HTTPException(status_code=500, detail="error when trying to update db")

    return update_answer


@app.on_event("startup")
def startup():
    global knn_df, knn_content_df, tmdb_lookup, CONN_STR, DB_NAME, COLL_NAME, api_key, client, database, collection, API_AUTH_ROUTE
    base = os.path.dirname(__file__)

    try:
        environment_variables = pd.read_json(os.path.join(base, "env.json"))
        CONN_STR = environment_variables.get("mongodb")[0]
        DB_NAME = environment_variables.get("db")[0]
        COLL_NAME = environment_variables.get("collection")[0]
        api_key = environment_variables.get("api")[0]
    except:
        raise HTTPException(status_code=500, detail="no credentials found")

    try:
        client = MongoClient(
            CONN_STR)  # pymongo verbindet sich automatisch per SSL/TLS :contentReference[oaicite:0]{index=0}
        database = client[DB_NAME]
        collection = database[COLL_NAME]
    except:
        raise HTTPException(status_code=500, detail="could not connect to db")

    # 1) KNN-Tabellen einlesen
    knn_df = pd.read_csv(os.path.join(base, 'knn_recs.csv'))
    knn_content_df = pd.read_csv(os.path.join(base, 'knn_content_recs.csv'))

    # 2) Lokale Titel-Zuordnung aus links.csv + movies.csv
    links_df = pd.read_csv(os.path.join(base, 'links.csv'))
    movies_df = pd.read_csv(os.path.join(base, 'movies.csv'))
    merged = pd.merge(links_df, movies_df, on='movieId', how='inner')
    merged = merged.dropna(subset=['tmdbId', 'title'])
    merged['tmdbId'] = merged['tmdbId'].astype(int)
    tmdb_lookup = dict(zip(merged['tmdbId'], merged['title']))


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/movie-recommendation")
def recommendation(req: RecommendationRequest):
    if type(req.tmdbid) is not int:
        raise HTTPException(status_code=400, detail="tmdbid must be an integer")

    base = os.path.dirname(__file__)
    tmdb_id = int(req.tmdbid)
    movie_title = req.title

    headers = {
        'accept': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    # authenticate user
    print("verify user authentication ...")

    checkUserAuth(req.backendIP, req.token)

    # --- Modell 1: KNN CF ---
    recs_1 = []
    row1 = knn_df[knn_df.tmdbId == tmdb_id]
    if not row1.empty:
        for col in [c for c in row1.columns if c.startswith('knn_rec')]:
            val = row1.iloc[0][col]

            try:
                if pd.notna(val):
                    response = requests.get(f"https://api.themoviedb.org/3/movie/{val}?language=de-DE", headers=headers)

                    if response.status_code == 200:
                        posterPath = response.json().get("poster_path")
                        recs_1.append(
                            {"tmdb_id": int(val), "title": tmdb_lookup.get(int(val), "Unknown"), "media_type": "movie",
                             "poster_path": posterPath})
            except:
                pass

            if len(recs_1) == 4:
                break

    # --- Modell 2: KNN Content ---
    recs_2 = []
    row2 = knn_content_df[knn_content_df.tmdbId == tmdb_id]
    if not row2.empty:
        for col in [c for c in row2.columns if c.startswith('rec_')]:
            val = row2.iloc[0][col]

            if pd.notna(val):
                response = requests.get(f"https://api.themoviedb.org/3/movie/{val}?language=de-DE", headers=headers)

                if response.status_code == 200:
                    posterPath = response.json().get("poster_path")
                    recs_1.append(
                        {"tmdb_id": int(val), "title": tmdb_lookup.get(int(val), "Unknown"), "media_type": "movie",
                         "poster_path": posterPath})

            if len(recs_2) == 4:
                break

    # --- Modell 3: TMDB-API ---
    recs_3 = []
    try:
        resp = requests.get(f"https://api.themoviedb.org/3/movie/{tmdb_id}/recommendations", headers=headers)

        if resp.status_code == 200:
            arr = resp.json().get("results", [])
            for r in arr:
                tid = r.get("id")
                media_type = r.get("media_type")
                title = r.get("title") or r.get("name")
                posterPath = r.get("poster_path")
                if tid is not None and media_type is not None and posterPath is not None:
                    recs_3.append(
                        {"tmdb_id": int(tid), "title": title, "media_type": media_type, "poster_path": posterPath})
    except:
        pass


    answer = update_db(tmdb_id, "movie", movie_title, req.posterPath)

    return {
        "recommendation1": recs_1,
        "recommendation2": recs_2,
        "recommendation3": recs_3,
        "updatedStatus": answer
    }


@app.post("/tv-recommendation")
def get_tv_recommendation(req: RecommendationRequest):
    if type(req.tmdbid) is not int:
        raise HTTPException(status_code=400, detail="tmdbid must be an integer")

    base = os.path.dirname(__file__)
    tmdb_id = int(req.tmdbid)
    tv_title = req.title

    headers = {
        'accept': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    # authenticate user
    print("verify user authentication ...")
    checkUserAuth(req.backendIP, req.token)

    recs = []
    try:
        resp = requests.get(f"https://api.themoviedb.org/3/tv/{tmdb_id}/recommendations?language=deDE&page=1", headers=headers)

        if resp.status_code == 200:
            arr = resp.json().get("results", [])
            for r in arr:
                tid = r.get("id")
                media_type = r.get("media_type")
                title = r.get("title") or r.get("name")
                posterPath = r.get("poster_path")
                if tid is not None and media_type is not None and posterPath is not None:
                    recs.append(
                        {"tmdb_id": int(tid), "title": title, "media_type": media_type, "poster_path": posterPath})
    except:
        pass

    answer = update_db(tmdb_id, "tv", tv_title, req.posterPath)

    return {
        "recommendation1": [],
        "recommendation2": [],
        "recommendation3": recs,
        "updatedStatus": answer
    }


# [GET] häufigste Id finden (von MongoDB)
@app.post("/highest-media")
def getHighestMoviesFromDB(req: HighestRecommendationRequest):
    checkUserAuth(req.backendIP, req.token)

    data = collection.find({})
    highest_media_list = list(data.sort("count", -1).limit(4))
    highest_media_mapped = [{"tmdb_id": m["tmdbId"], "title": m["title"], "poster_path": m["posterPath"], "media_type": m["mediaType"]} for m in highest_media_list]

    return {"recommendations": highest_media_mapped}