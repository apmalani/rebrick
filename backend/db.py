from pinecone import ServerlessSpec
from pinecone.grpc import PineconeGRPC as Pinecone
import pandas as pd
from pinecone_datasets import list_datasets, load_dataset
from dotenv import load_dotenv
import os
from tqdm import tqdm

load_dotenv()
api_key = os.getenv('PINECONE_KEY')

pc = Pinecone(api_key=api_key)

def dummy_create_database():
    if 'legosets' not in pc.list_indexes().names():    
        pc.create_index(
            name='legosets',
            dimension=1024,
            metric='cosine',
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'
            )
        )
    
    index = pc.Index('legosets')
    data = pd.read_csv('db/data/sets_filtered_full.csv')
    
    batch_size = 50
    total_batches = len(data) // batch_size + (1 if len(data) % batch_size != 0 else 0)
    
    for i in tqdm(range(total_batches)):
        start_idx = i * batch_size
        end_idx = min((i + 1) * batch_size, len(data))
        batch = data.iloc[start_idx:end_idx]
        
        embeds = pc.inference.embed(
            model='multilingual-e5-large',
            inputs=[row['name'] for _, row in batch.iterrows()],
            parameters ={'input_type':'passage','truncate':'END'}
        )

        records = []
        for (_, d), e in zip(batch.iterrows(), embeds):
            records.append({
                'id': str(d['set_id']),
                'values': e['values'],
                'metadata': {
                    'name': str(d['name']),
                    'year': int(d['year']),
                    'theme': str(d['theme']),
                    'img_url': str(d['img_url']),
                    'parts': str(d['parts']),
                    'sim_score': str(d['sim_scores'])
                }
            })
        
        index.upsert(vectors=records, namespace='rebrick_base')

def dummy_query_database_by_embed(query, dummy_namespace='rebrick_base'):
    index = pc.Index('legosets')
    query_embeds = pc.inference.embed(
        model='multilingual-e5-large',
        inputs=[query],
        parameters={'input_type':'query','truncate':'END'}
    )

    results = index.query(
        namespace=dummy_namespace,
        vector=query_embeds.data[0]['values'],
        top_k=192,
        include_values=False,
        include_metadata=True
    )

    return results

def dummy_query_database_by_id(id, dummy_namespace='rebrick_base'):
    index = pc.Index('legosets')
    results = index.query(
        namespace=dummy_namespace,
        id=id,
        top_k=1,
        include_values=False,
        include_metadata=True
    )

    return results

def delete_index():
    pc.delete_index('legosets')
