import React, { useEffect, useReducer } from 'react'
import Header from './Header'
import Main from './Main'
import Loader from './Loader'
import Error from './Error'
import StartScreen from './StartScreen'
import Question from './Question'
import NextButton from './NextButton'
import Progress from './Progress'
import FinishScreen from './FinishScreen'
import Footer from './Footer'
import Timer from './Timer'
const initialState = {
  questions: [],
  //loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null
}
const SECS_PER_QUESTION = 30
function reducer(state, action){
  switch (action.type) {
  case 'dataReceived': {
    return {
      ...state,
      questions: action.payload,
      status: 'ready',
    };
  }
  case 'dataFailed': {
    console.log('log data load error');
    return {
      ...state,
      questions: [],
      status: 'error',
    };
  }
  case 'start': {
    return {
      ...state,
      status: 'active',
      secondsRemaining: state.questions.length * SECS_PER_QUESTION,
    };
  }
  case 'newAnswer': {
    const question = state.questions[state.index]; // Use array indexing instead of at()
    return {
      ...state,
      answer: action.payload,
      points: action.payload === question.correctOption ? state.points + question.points : state.points,
    };
  }
  case 'nextQuestion': {
    return {
      ...state,
      index: state.index + 1,
      answer: null,
    };
  }
  case 'finish': {
    return {
      ...state,
      status: 'finished',
      highScore: state.points > state.highScore ? state.points : state.highScore,
    };
  }
  case 'restart': {
    return { ...initialState, questions: state.questions, status: 'ready' };
    // Alternatively, you can reset only specific properties as shown below:
    // return {
    //   ...state,
    //   index: 0,
    //   points: 0,
    //   highScore: 0,
    //   answer: null,
    //   status: 'ready',
    // };
  }
  case 'tick': {
    return {
      ...state,
      secondsRemaining: state.secondsRemaining - 1,
      status: state.secondsRemaining === 0 ? 'finished' : state.status,
    };
  }
  default:
    throw new Error('Action unknown');
}

}
const App = () => {
  const [{questions, status, index, answer, points, highScore, secondsRemaining}, dispatch] = useReducer(reducer, initialState)
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)
  
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className='app'>
        <Header />
        <Main>
          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
          {status === "active" && <>
          <Progress numQuestions={numQuestions} index={index} answer={answer} points={points} maxPossiblePoints={maxPossiblePoints}/>
          <Question questions={questions[index]} dispatch={dispatch} answer={answer}/> 
          <Footer>
            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
          <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions}/>
          </Footer>
          </>
          }
          {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} dispatch={dispatch} highScore={highScore}/>}
            
          </Main>
    </div>
  )
}

export default App
