from datetime import datetime, timezone
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

app = FastAPI(title="Portfolio API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_collection():
    mongo_uri = os.environ.get("MONGO_URI")
    mongo_db = os.environ.get("MONGO_DB", "portfolio")
    mongo_collection = os.environ.get("MONGO_COLLECTION", "leads")

    if not mongo_uri:
        raise RuntimeError("MONGO_URI is not set")

    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=8000)
    return client[mongo_db][mongo_collection]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/leads")
def create_lead(payload: dict):
    try:
        collection = _get_collection()
        doc = {
            "mode": payload.get("mode"),
            "data": payload.get("data", payload),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "new",
        }
        res = collection.insert_one(doc)
        return {"status": "ok", "id": str(res.inserted_id)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"insert_failed: {exc}")
