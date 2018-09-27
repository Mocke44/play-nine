import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoDash from 'lodash';

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props)=>{
  //const numberOfStars = 1+Math.floor(Math.random()*9);
  // let stars =[];
  // for(let i=0;i<numberOfStars;i++)
  // {
  //   stars.push(<i key= {i} className="fa fa-star"></i>)
  // }
  return(
    <div className="col-sm-5 col-xs-12">
      {LoDash.range(props.numberOfStars).map(i=>
        <i key= {i} className="fa fa-star"></i>
        )}
    </div>
  );
}


const Button = (props)=>{
  let button;
  switch(props.answerIsCorrect){
    case true:
    button = 
      <button className="btn btn-success" onClick={props.acceptAnswer}>
        <i className="fa fa-check"></i>
      </button>
    break;
    case false:
    button = 
      <button className="btn btn-danger">
        <i className="fa fa-times"></i>
      </button>
    break;
    default:
    button = 
      <button className="btn btn-default" 
      disabled={props.selectedNumbers.length===0}
      onClick={props.checkAnswer}>=</button>
    break;
  }
  return(
    <div className="col-sm-2 col-xs-12 text-center">
      {button}
      <br/>
      <br/>
      <button className="btn btn-warning btn-sm" onClick={props.redraw}
      disabled={props.redraws===0}>
        <i className="fa fa-refresh">refresh {props.redraws}</i>
      </button>
    </div>
  )
}

const Answer = (props)=>{
  return(
    <div className="col-sm-5 col-xs-12">
      {props.selectedNumbers.map((number,i)=>
      <span key={i} onClick={()=>props.unselectNumber(number)}>{number}</span>
      )}
    </div>
  )
}

const Numbers = (props)=>{
  const numberClassName = (number)=>{
     if (props.usedNumbers.indexOf(number)>=0){
      return "used";
    }
    if (props.selectedNumbers.indexOf(number)>=0){
      return "selected";
    }
  }
  return(
    <div className="card text-center">
      <div>
        {Numbers.list.map((number,i)=>
          <span key={i} className={numberClassName(number)}
          onClick={()=>props.selectNumber(number)}>{number}</span>)}
      </div>
    </div>
  )
}

const DoneFrame = (props)=>{
  return(
    <div className="text-center">
      <br/>
      <h1>{props.gameStatus}</h1>
      <button className="btn btn-info" onClick={props.resetgame}>Play again?</button>
    </div>
  );
}

Numbers.list = LoDash.range(1,10);

const Timer = (props)=>{
  setInterval(props.tick,1000)
  return(
    <div className="text-center">
      <br/>     
      <h3>
        Time remaining : {props.remainingTime}
      </h3>
    </div>
  )
};

class Game extends React.Component{
  static randomNumber =()=> 1+Math.floor(Math.random()*9);
  static initialState =()=>({
    selectedNumbers:[],
    usedNumbers:[],
    randomNumberOfStars : Game.randomNumber(),
    answerIsCorrect:null,
    redraws:5,
    gameStatus:null,
    timeLeft:60,
  });
  state= Game.initialState();

  resetgame=()=>{this.setState(Game.initialState)};
  selectNumber = (clickedNumber)=>{
    if (this.state.selectedNumbers.indexOf(clickedNumber)>=0) {return;}
    this.setState(prevState=>({
      answerIsCorrect:null,
      selectedNumbers:prevState.selectedNumbers.concat(clickedNumber)
    }));
  };
  unselectNumber = (clickedNumber) =>{
    this.setState(prevState=>({
      answerIsCorrect:null,
      selectedNumbers:prevState.selectedNumbers.filter(number=>number!==clickedNumber)
    }));
  };
  checkAnswer =()=>{
    this.setState(prevState=>({answerIsCorrect :prevState.randomNumberOfStars===
    prevState.selectedNumbers.reduce((acc,n)=>acc+n,0)
  }));
  };
  acceptAnswer=()=>{
    this.setState(prevState=>({
      usedNumbers:prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers:[],
      answerIsCorrect:null,
      randomNumberOfStars: Game.randomNumber()
    }), this.updateGameStatus);
  };
  redraw=()=>{
    if (this.state.redraws===0){return;}
    this.setState(prevState=>({
      randomNumberOfStars:Game.randomNumber(),
      answerIsCorrect:null,
      selectedNumbers:[],
      redraws:prevState.redraws-1,
    }), this.updateGameStatus);
  };
  possibleSolutions=({randomNumberOfStars,usedNumbers})=>{
    const possibleNumbers = LoDash.range(1,10).filter(number=>
      usedNumbers.indexOf(number)===-1
      );
      return possibleCombinationSum(possibleNumbers,randomNumberOfStars);
  };
  updateGameStatus=()=>{
    this.setState(prevState=>{
      if (prevState.usedNumbers.length === 9){
        return {gameStatus:'Game over, you win!'}
      }
      if (prevState.redraws===0 && !this.possibleSolutions(prevState))
      {
        return {gameStatus:'Game over, you lost!'}
      }
    })
  };
  tick=() => {
    this.setState(prevState=>{
      if (prevState.timeLeft>=0 && this.gameStatus === null)
      {
        this.setState(prevState.timeLeft-1000)
      }
      if (prevState.timeLeft ===0 && this.gameStatus === null)
      {
         return {gameStatus:'Game over, you lost!'}
      }
    })
  };
  render(){
    const {selectedNumbers,
          usedNumbers,
          randomNumberOfStars,
          answerIsCorrect,
          redraws,
          gameStatus,
          timeLeft}= this.state;
    return(
      <div className="container">
        <h3>
          Welcome to Play 9, built with React
        </h3>
        <hr/>
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars}/>
          <Button selectedNumbers={selectedNumbers}
                  checkAnswer={this.checkAnswer}
                  answerIsCorrect={answerIsCorrect}
                  acceptAnswer={this.acceptAnswer}
                  redraw={this.redraw}
                  redraws={redraws}/>
          <Answer selectedNumbers={selectedNumbers}
                  unselectNumber={this.unselectNumber}/>
        </div>
        <br/>
        {gameStatus?
          <DoneFrame resetgame = {this.resetgame} 
                    gameStatus={gameStatus}/>:
          <Numbers selectedNumbers={selectedNumbers}
                  selectNumber={this.selectNumber}
                  usedNumbers={usedNumbers}/>
        }
        <Timer remainingTime={this.timeLeft}
              tick={this.tick}/>        
      </div>
    );
  }
}



class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Game/>


      </div>
    );
  }
}

export default App;
