import React from 'react'

export default function FinishScreen({points, maxPossiblePoints, highScore, dispatch}) {
    let emoji;
    const percentage = (points/maxPossiblePoints) * 100
    if(percentage === 100) emoji = "🥇"
    if(percentage >= 70 && percentage < 100) emoji = "🎉";
    if(percentage >= 50 && percentage < 70) emoji = "🙃";
    if(percentage >= 0 && percentage < 50) emoji = "😶";
    if(percentage === 0)emoji="🤦‍♀️"
 
  return (
   <>
      <p className='result'>You scored <strong>{points}</strong> out of {maxPossiblePoints} ({Math.ceil(percentage)}%){emoji}</p>
      <p className='highscore'>(Highscore: {highScore}points)</p>
      <button className='btn btn-ui' onClick={() => dispatch({type: "restart"})}>Restart quiz</button>
      </>
  )
}
