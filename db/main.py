from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('PINECONE_KEY')
pc = Pinecone(api_key=api_key)

