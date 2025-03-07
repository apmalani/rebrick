from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from db import dummy_query_database_by_embed, dummy_query_database_by_id
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchQuery(BaseModel):
    query: str

@app.post("/search_embed")
async def search_embed_endpoint(search_req: SearchQuery):
    try:
        results = dummy_query_database_by_embed(search_req.query)
        
        serialized_results = {
            "matches": [
                {
                    "id": match["id"],
                    "score": match["score"],
                    "metadata": match["metadata"],
                }
                for match in results.get("matches", [])
            ]
        }

        return serialized_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search_id")
async def search_id_endpoint(search_req: SearchQuery):
    try:
        results = dummy_query_database_by_id(search_req.query)
        
        serialized_results = {
            "matches": [
                {
                    "id": match["id"],
                    "score": match["score"],
                    "metadata": match["metadata"],
                }
                for match in results.get("matches", [])
            ]
        }

        return serialized_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
