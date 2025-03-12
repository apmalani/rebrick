import pandas as pd
import ast
from tqdm import tqdm

def clean_sim_scores(csv_path):
    df = pd.read_csv(csv_path)
    
    def filter_top_scores(score_str):
        scores = ast.literal_eval(score_str)
        sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
        top_scores = sorted_scores[:10]
        return str(top_scores)
    
    tqdm.pandas()
    df['sim_scores'] = df['sim_scores'].progress_apply(filter_top_scores)

    df.to_csv(csv_path, index=False)

csv_path = "backend\data\sets_filtered_full.csv"
clean_sim_scores(csv_path)