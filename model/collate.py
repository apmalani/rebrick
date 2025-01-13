from math import sqrt
import csv
import json
import ast
import pandas as pd
import numpy as np

def l2(v):
    return round(sqrt(sum([a * a for a in v])), 3)

def cosine_sim(x1, x2):
    vector2 = []
    vector1 = []

    if len(x1) > len(x2):
        input1 = x1
        input2 = x2
    else:
        input1 = x1
        input2 = x2

    vector1 = list(input1.values())

    for k in input1.keys():    
        if k in input2.keys():
            if input1[k] >= input2[k]:
                vector2.append(float(input2[k]))
            else:
                vector2.append(float(0))
        else :
            vector2.append(float(0))

    numerator = sum(a * b for a, b in zip(vector2,vector1))
    denominator = l2(vector1) * l2(vector2)
    if denominator == 0:
        return 0.0
    return round(numerator / float(denominator), 3)

