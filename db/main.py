import pinecone
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('PINECONE_KEY')

pc = pinecone.Pinecone(api_key=api_key)

if 'legosets' not in pc.list_indexes().names():    
    pc.create_index(
        name = 'legosets',
        dimension = 256,
        metric = 'cosine',
        spec = pinecone.ServerlessSpec(
            cloud = 'aws',
            region = 'us-east-1'
        )
    )

index = pinecone.index('legosets')

# create vector embeddings on set names

# upsert to db

# query


