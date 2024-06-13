from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('path/to/your/serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/commits/{commit_hash}")
async def get_issue_data(commit_hash: str):
    try: 
        commit_ref = db.collection('commits').document(commit_hash)
        commit_doc = commit_ref.get()

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

@app.post("/update_user_stats_and_issue/{user_id}/")
async def update_user_stats():
    #get users current points, calculate points after fix, mark issue as fixed if determined as fixed
    #points ideas: extra points for fixing issues faster, first fix, daily streak 
    return {"message": "Hel"}

@app.delete("/boards/{commit_hash}/{board_id}")
async def remove_board(commit_hash: str,board_id: str):
    try:
        commit_ref = db.collection('commits').document(commit_hash)
        commit_doc = commit_ref.get()
        if not commit_doc.exists:
            raise HTTPException(status_code=404, detail="Commit not found")

        deps_ref = commit_ref.collections()
        for dep in deps_ref:
            dep_docs = dep.stream()
            for dep_doc in dep_docs:
                dep_data = dep_doc.to_dict()
                if dep_data.get('biD') == board_id:
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