import React, { useEffect } from 'react';
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {init} from '../utils/initFirebase'
import DiceHistorical from '../components/DiceHistorical';
import DiceRoll from '../components/DiceRoll';
import '../styles/diceHisto.css';
// import { css } from 'emotion';
// import ScrollToBottom from 'react-scroll-to-bottom';
init();


const DiceChat = (props) => {
  const heightContainer = window.innerHeight - 110;
  const {list, setNewDice} = props;
  return (
    <div className='diceChatContainer' style={{height: heightContainer}}>
      <DiceHistorical 
        chat
        list={list}
      />
      <DiceRoll
        chat
        setNewDice={(newRoll) => {
          setNewDice(newRoll);
        }}
      />
    </div>
  );
  
}

export default DiceChat