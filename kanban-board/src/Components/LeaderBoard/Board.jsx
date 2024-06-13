import React from 'react'
import '../style.css'
import Images from './Images';
import logo from '../../Images/css.png'

const Board = ({scores,onIncrement,onDecrement, lb}) => {
  const lbarray = Object.entries(lb)
    return (
        <div>
             {lbarray.map((value) => {
              console.log(value);
            return (
              <>
                <div
                  className="grid row"
                  key={value[0]}
                  style={{ margin: "50px 0px" }}
                >
                  <div className="details-wrap">
                    <div className="intern-name">{value[0]}</div>
                    <div className="badge-wrap">
                      <div className="badge .badge-6377">
                          {
                              Images.map((value,index)=>{
                                  
                                    return (
                                        <img src={logo} alt="" key={index} />
                                        
                                          )
                                  
                                
                              })
                          }
                      </div>
                    </div>
                    <div className="university">{'Software Developers'}</div>
                  </div>
                  <div className="score">{value[1]}</div>
                </div>
              </>
            );
          })}
        </div>
    )
}

export default Board
