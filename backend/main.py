from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('C:\\Users\\winstang\\amdhack-58ad0-firebase-adminsdk-dpnss-89da1a3d8c.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get('/get_commits')
async def get_commit_hashes():
    try: 
        commit_ref = db.collection('commits')
        commit_doc = commit_ref.stream()

        commit_dic = []
        for doc in commit_doc:
            commit_dic.append({**doc.to_dict(), 'id':doc.id})
        print(commit_dic)
        return {"commits": commit_dic}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/commits/{commit_hash}")
async def get_issue_data(commit_hash: str):
    try: 
        commit_ref = db.collection('commits').document(commit_hash)
        commit_doc = commit_ref.get()

        if not commit_doc.exists:
            raise HTTPException(status_code=404, detail="Commit not found")

        issues_ref = commit_ref.collection('issues')
        issues_docs = issues_ref.stream()
    
        issues_data = {}
        for issue in issues_docs:
            deps_docs = issues_ref.document(issue.id).collections()
            deps_data = []
            for dep in deps_docs:
                for dep_doc in dep.stream():

                    dep_data = dep_doc.to_dict()
                    deps_data.append(dep_data)

            issues_data[issue.id] = deps_data
    
        return {"commit_hash": commit_hash, "issues": issues_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/points")
async def get_points():
    #get users current points, calculate points after fix, mark issue as fixed if determined as fixed
    #points ideas: extra points for fixing issues faster, first fix, daily streak 
    try:
        users_ref = db.collection('users')
        users_docs = users_ref.stream()

        users_points = []
        for doc in users_docs:
            user_data = doc.to_dict()
            user_points.append({
                'id': doc.id,
                'points': user_data.get('points')
            })

        return {"users": users_points}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/boards/{commit_hash}/{board_id}")
async def remove_board(commit_hash: str,board_id: str):
    try:

        commit_ref = db.collection('commits').document(commit_hash)
        commit_doc = commit_ref.get()

        if not commit_doc.exists:
            raise HTTPException(status_code=404, detail="Commit not found")
        
        issues_ref = commit_ref.collection('issues')
        issues_docs = issues_ref.stream()
    
        for issue in issues_docs:
            deps_docs = issues_ref.document(issue.id).collections()
            for dep in deps_docs:
                for dep_doc in dep.stream():
                    dep_data = dep_doc.to_dict()
                    if dep_data.get('bid') == board_id:
                        # Delete the matching issue document
                        dep_doc.reference.delete()
                        return {"message": "Issue board removed successfully"}

        raise HTTPException(status_code=404, detail="Board ID not found within the specified commit hash")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/leaderboard")
async def show_leadeboard():
    # update leaderboard
    return {"message": "Hel"}