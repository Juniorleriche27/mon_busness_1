# -*- coding: utf-8 -*-
import streamlit as st
import cohere

api_key = st.secrets["cohere"]["api_key"]
model = st.secrets["cohere"].get("model", "command-r-plus")

co = cohere.ClientV2(api_key)

resp = co.chat(
    model=model,
    messages=[{"role": "user", "content": "Réponds exactement: OK"}],
)

print(resp.message.content[0].text)
