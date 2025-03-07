from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from db import dummy_query_database_by_embed, dummy_query_database_by_id


app = FastAPI()

class SearchQuery(BaseModel):
    query: str

@app.post("/search")
async def search_endpoint(search_req: SearchQuery):
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

    
