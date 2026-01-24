from datetime import datetime
import streamlit as st
from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = st.secrets["mongodb"]["uri"]
db_name = st.secrets["mongodb"].get("db", "portfolio")
col_name = st.secrets["mongodb"].get("collection", "leads")

client = MongoClient(uri, server_api=ServerApi("1"))
db = client[db_name]
col = db[col_name]

doc = {
    "name": "Test Lead",
    "email": "test@example.com",
    "source": "local_seed",
    "createdAt": datetime.utcnow(),
}

res = col.insert_one(doc)
print("Inserted:", res.inserted_id)
print("DB:", db_name, "| Collection:", col_name, "| Count:", col.count_documents({}))
