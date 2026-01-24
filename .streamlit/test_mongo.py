from pymongo import MongoClient
from pymongo.server_api import ServerApi
import streamlit as st

uri = st.secrets["mongodb"]["uri"]

client = MongoClient(uri, server_api=ServerApi("1"))

try:
    client.admin.command("ping")
    print("Mongo OK: ping réussi")
except Exception as e:
    print("Mongo ERROR:", type(e).__name__, str(e))
