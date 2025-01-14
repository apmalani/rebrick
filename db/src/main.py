import pinecone
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('PINECONE_KEY')

pc = pinecone.Pinecone(api_key=api_key)

def dummy_create_database():
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
        
        # TODO: data = pd.read_csv()
        
        # create vector embeddings on set names
        embeds = pc.inference.embed(
            model = 'multilingual-e5-large',
            inputs = [d['name'] for d in data],
            parameters = {'input_type': 'passage', 'truncate': 'END'}
        )
        
        # upsert to db
        records = []
        for d, e, in zip(data, embeds):
            records.append({
                'id': d['id'],
                'values': e['values'],
                'metadata': {} # TODO: insert specific values (year, class, parts)
            })
        
        index.upsert(
            vector = records,
            namespace = 'rebrick_base'
        )

# query
def dummy_query_database(query, dummy_namespace = 'rebrick_base'):
    query_embeds = pc.inference.embed(
        model = 'multilingual-e5-large',
        inputs = [query],
        parameters = {'input_type': 'query'}
    )

    results = index.query(
        namespace = dummy_namespace,
        vector = query_embeddings[0].values,
        top_k = 12,
        include_values = False,
        include_metadata = True
    )

    return results # TODO : format results for api

