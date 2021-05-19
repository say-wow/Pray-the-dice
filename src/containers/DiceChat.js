import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {init} from '../utils/initFirebase'
import DiceHistorical from '../components/DiceHistorical';
import DiceRoll from '../components/DiceRoll';
import '../styles/diceHisto.css';

init();

const DiceChat = (props) => {
  console.log(window.innerHeight)
  const heightContainer = window.innerHeight - 70;
  return (
    <div className='diceChatContainer' style={{height: heightContainer}}>
      <DiceHistorical />
    </div>
  );
  
}

export default DiceChat