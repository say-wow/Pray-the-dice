import React, {useContext} from 'react';
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {init} from '../utils/initFirebase'
import DiceHistorical from '../components/DiceHistorical';
import DiceRoll from '../components/DiceRoll';
import '../styles/diceHisto.css';
import Breadcrumb from '../components/Breadcrumb';
import CharacterContext from '../context/CharacterContext';
import i18next from 'i18next';
// import { css } from 'emotion';
// import ScrollToBottom from 'react-scroll-to-bottom';
init();


const DiceChat = (props) => {
  const {character} = useContext(CharacterContext);
  const heightContainer = window.innerHeight - 130;
  const {list, setNewDice} = props;

  return (
    <div className='diceChatContainer' style={{height: heightContainer, marginHorizontal: -15}}>
      <Breadcrumb sentence={character && character.uid ? character.name : i18next.t('dm')}/>
      <DiceHistorical 
        chat
        list={list}
        hideRollSwitch={props.hideRollSwitch}
        setHideRoll={(val) => {
          props.setHideRoll(val)
        }}
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