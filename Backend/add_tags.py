#!/usr/bin/env python3
import json
import os

input_file = "openapi/tmdb-api-formatted.json"
output_file = "openapi/tmdb-api.json"

TAG_MAPPING = {
    "movie": "Movies",
    "tv": "TV",
    "person": "People",
    "search": "Search",
    "genre": "Genres",
    "collection": "Collections",
    "company": "Companies",
    "credit": "Credits",
    "discover": "Discover",
    "network": "Networks",
    "trending": "Trending",
    "account": "Account",
    "authentication": "Authentication",
    "certifications": "Certifications",
    "configuration": "Configuration",
    "keyword": "Keywords",
    "list": "Lists",
    "watch": "WatchProviders",
    "find": "Find",
    "guest_session": "GuestSession",
    "review": "Reviews"
}

HTTP_METHODS = {"get", "post", "put", "delete", "patch", "options", "head"}

print(f"Lese Spezifikation aus '{input_file}'...")
with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

tagged_count = 0
paths = data.get("paths", {})

for path, path_item in paths.items():
    # Pfad zerlegen (z. B. "/3/movie/{movie_id}" -> ["3", "movie", "{movie_id}"])
    segments = [s for s in path.strip("/").split("/") if s]
    
    # Versionspräfix "/3/" ignorieren
    if segments and segments[0] == "3":
        segments = segments[1:]

    # Hauptsegment als Tag-Basis wählen
    if not segments:
        tag_name = "Default"
    else:
        first_segment = segments[0].lower()
        tag_name = TAG_MAPPING.get(first_segment, first_segment.capitalize())

    # Tag bei allen HTTP-Methoden des Pfads eintragen
    if isinstance(path_item, dict):
        for method, operation in path_item.items():
            if method.lower() in HTTP_METHODS and isinstance(operation, dict):
                operation["tags"] = [tag_name]
                tagged_count += 1

print(f"Erfolg: {tagged_count} Endpunkte wurden mit Tags strukturiert.")

print(f"Speichere angepasste Datei unter '{output_file}'...")
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Fertig!")