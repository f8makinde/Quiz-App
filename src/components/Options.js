import React from 'react'

export default function Options({questions, dispatch, answer}) {
    console.log(questions)
    const hasAnswered = answer !== null
  return (
    <div className='options'>
    {questions.options.map((option, index) => {
       return <button key={index} className={`btn btn-option ${index === answer ? "answer" : ""} ${hasAnswered ? index === questions.correctOption ? "correct" : "wrong" : ""}`} disabled={answer !== null} onClick={() => dispatch({type: "newAnswer", payload: index})} answer={answer}>{option}
       </button>
    })}
 </div>
  )
}
