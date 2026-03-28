# Deploy guide (draft)

## Backend (Render)
- Root: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health: `/health`

## Frontend (Vercel)
- Root: `frontend`
- Framework: Next.js

## Env Vars (both)
- MONGO_URI
- SMTP_HOST
- SMTP_PORT
- SMTP_USERNAME
- SMTP_PASSWORD
- SMTP_FROM
- SMTP_TO
- COHERE_API_KEY
- COHERE_MODEL

## Notes
- Current Streamlit app remains untouched.
- This branch is isolated for deployment prep.
