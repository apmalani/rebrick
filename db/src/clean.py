import pandas as pd
import ast
from tqdm import tqdm

def clean_sim_scores(csv_path):
    df = pd.read_csv(csv_path)
    
    def filter_scores(score_str):
        scores = ast.literal_eval(score_str)
        filtered_scores = [score for score in scores if score[1] >= 0.6]
        return str(filtered_scores)
    
    tqdm.pandas()
    df['sim_scores'] = df['sim_scores'].progress_apply(filter_scores)

    df.to_csv(csv_path, index=False)

csv_path = "db\data\sets_filtered_full.csv"
clean_sim_scores(csv_path)