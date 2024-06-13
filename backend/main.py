from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/database")
async def root():
    return {"message": "Hel"}

@app.post("/update_user_stats_and_issue/{user_id}")
async def update_user_stats(...):
    #get users current points, calculate points after fix, mark issue as fixed if determined as fixed
    #points ideas: extra points for fixing issues faster, first fix, daily streak 

@app.get("/leaderboard")
async def show_leadeboard():
    # update leaderboard