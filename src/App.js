import React, { Component, useState, useEffect, useMemo, useCallback } from 'react';
import './style.css';
import {AiFillPlayCircle} from 'react-icons/ai';
import {BiSkipNext} from 'react-icons/bi';
import {BsCircle} from 'react-icons/bs';
import {BsCircleFill} from 'react-icons/bs';
import {AiFillQuestionCircle} from 'react-icons/ai';

function App() {
  const [number, setNumber] = useState(1500);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [counter, setCounter] = useState(0);

  //1 = Focus Time /  2 = Short Break / 3 = Long Break
  const [status, setStatus] = useState(1);

  useEffect(() => {
    let interval;
    if(running){
      interval = setInterval(() => {
        if(number == 0){
          setRunning(false);
          statusChange();
        }
        else{
          setNumber(prevnumber => prevnumber - 1);
        }
      }, 1000);
    }else{
      clearInterval(interval)
    }
    return () => clearInterval(interval);
  }, [running, number]);

  useEffect(()=> {
    setMinutes(Math.floor(number / 60).toString().padStart(2,'0'));
    setSeconds((number % 60).toString().padStart(2,'0'));
  }, [number]);
  
  const start = useCallback(() => {
    setRunning(!running);
  });

  const next = useCallback(() => {
    setRunning(false);
    statusChange();
  });

  const showInformation = useCallback(() => {
    document.querySelector('.information').classList.toggle('information-hidden');
  });

  const statusChange = useCallback(() => {
    let holderCounter = counter;
    let holderStatus = status;
    
    if(holderCounter == 4){
      holderCounter = 0;
    }
    
    if(holderStatus == 1){
      holderCounter = counter + 1;
      holderStatus = (holderCounter == 4 ? 3 : 2);
    }
    else{
      holderStatus = 1;
    }

    switch(holderStatus){
      case 1:
        document.querySelector('#card').classList.remove('short-break');
        document.querySelector('#card').classList.remove('long-break');
        document.querySelector('#card').classList.add('focus-time');
        setNumber(1500);
        break;
      case 2:
        document.querySelector('#card').classList.remove('focus-time');
        document.querySelector('#card').classList.add('short-break');
        setNumber(300);
        break;
      case 3:
        document.querySelector('#card').classList.remove('focus-time');
        document.querySelector('#card').classList.add('long-break');
        setNumber(1800);
        break;
    }
    setCounter(holderCounter);
    setStatus(holderStatus);
  });

  return(
    <section id='pomodoro-section'>
      <div id='card' className='wrapper focus-time'>
        <img src={require('./assets/elipse.png')} className='img '></img>        
        <Timer minutes={minutes} seconds={seconds}/>

        <div className='controller'>
          <BiSkipNext className='icon-next exclude'/>
          <AiFillPlayCircle className='icon-play' onClick={start}/>
          <BiSkipNext className='icon-next' onClick={next}/>
        </div>

        <Counter counter={counter}/>
        <TextStatus status={status}/>
        <AiFillQuestionCircle className='icon-question' onMouseEnter={showInformation} onMouseLeave={showInformation}/>
        <div className='information information-hidden'>
          <li>Focus Time: 25 Minutes</li>
          <li>Short Break: 5 Minutes</li>
          <li>Long Break: 25 Minutes</li>
          <li>Every 3 Short Breaks </li>
          <p>equals 1 Long Break</p>
        </div>
      </div>
    </section>
  );
  };

class TextStatus extends Component{
  render(){
    return(
    <div>
      <h2 className='status'>{
        this.props.status == 1 ? 'Focus Time' :
        this.props.status == 2 ? 'Short Break' : 
        'Long Break'}
      </h2>
    </div>
    );
  }
}

class Timer extends Component {
  render(){
    return(
      <div className='timer'>
        {this.props.minutes + ':' + this.props.seconds}
      </div>
    );
  };
}

class Counter extends Component {
  render(){
    return(
      <div className='icon-circle'>
            {Array.from({length: this.props.counter}, () => (
              <BsCircleFill/>
            ))}

            {Array.from({length: 4-this.props.counter}, () => (
              <BsCircle/>
            ))}
          </div>
    );
  }
}

export default App;
