import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import json
import os

# Use a service account.
cred = credentials.Certificate('C:\\Users\\winstang\\amdhack-58ad0-firebase-adminsdk-dpnss-89da1a3d8c.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

def test(): 
    try: 

        team = ["winstang","alissguo","brianli2","bowzheng"]
        for name in team:
            doc_ref = db.collection("users").document(name)
            doc_ref.set({"Points": 0, "Fixes": 0, "AverageFixSeverity": 0 , "FalsePositivesFixed": 0})

        users_ref = db.collection("users")
        docs = users_ref.stream()

        for doc in docs:
            print(f"{doc.id} => {doc.to_dict()}")

    except Exception as e:
        print(f"fhkjsdhfjsd")

def read_sarif(path):
    with open(path) as file:
        data = json.load(file)
        return data

def store_sarif(data):
    for rule in data.get('rules', []):
        name = rule.get('name')
        full_descr = rule.get('fullDescription', {}).get('text')
        severity = rule.get('properties', {}).get('security-severity')
        print(severity)
        doc_ref = db.collection('rules').document(name)
        vulnerability_data = {
            'name': name,
            'description': full_descr,
            'severity': severity
        }
        doc_ref.set(vulnerability_data) 

def process_files(folder_path):
    files = os.listdir(folder_path)

    sarif_files = [f for f in files if f.endswith('.sarif')]

    for file in sarif_files:
        file_path = os.path.join(folder_path, file)
        data = read_sarif(file_path)
        store_sarif(data)

if __name__ == "__main__":
    folder_path = 'C:\\Users\\winstang\\Downloads\\amdhack_sarifs'
    process_files(folder_path)
    test()