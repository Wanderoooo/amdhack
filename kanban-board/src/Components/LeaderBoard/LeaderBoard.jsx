import React,{useState} from 'react'
import '../style.css'
import Board from './Board'
import Data from './Data'
const LeaderBoard = ({ leaderboard: lb }) => {
    const [scores, setScores] = useState(Data);
    const onIncrement=(studentId)=>{
     const updatedScore=scores.map((score)=>{
         if(score.id===studentId){
            score.studentScore++;
            return score;
         }
         return score
     });
     setScores(updatedScore)
    }

    const onDecrement=(studentId)=>{
        const updatedScore=scores.map((score)=>{
            if(score.id===studentId){
               score.studentScore--;
               return score;
            }
            return score
        });
        setScores(updatedScore)
       }
    return (
        <div>
             <div className="header">
        <div class="heading-with-subtitle">
          <div class="wrap">
            <h2 class="title">Leaderboard</h2>
            <p class="sub-title">
            Progression System uses performance tiers to track vulnerability solutions. Along the way, you’ll earn badges for your achievements
            and compete on the live leaderboard.
            </p>
          </div>
        </div>
      </div>
      <div className="leaderboard">
        <div className="wrap">
          <div>
            <div className="grid heading">
              <div className="th">Name</div>
              <div className="th">Score</div>
            </div>
          </div>
            <Board scores={scores} onIncrement={onIncrement} onDecrement={onDecrement} lb={lb} />
         
        </div>
      </div>
        </div>
        
    )
}

export default LeaderBoard
