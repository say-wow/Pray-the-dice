import React, {useContext, useState, useEffect, useRef} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { uid } from 'uid';
import {init} from '../utils/initFirebase'
import CharacterContext from '../context/CharacterContext';
import UserContext from '../context/UserContext';
import CampaignContext from '../context/CampaignContext';
import '../styles/diceRoll.css'
init();
const db = firebase.firestore();

const DiceRoll = (props) => {
  const {character} = useContext(CharacterContext);
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const [isOpen, setIsOpen] = useState(false)
  const [classListToListen] = useState(['openChat', 'mainRoll', 'subRoll'])
  const diceRef = useRef(null)

  const roll = async (max, isDm) => {
    const randomValue = Math.floor(Math.random() * max) + 1;
    const rollUid = uid();
    const dataRoll = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userName: !isDm ? character.name : "DM",
      characterId: character.uid,
      value: randomValue,
      campaignId: character.idCampaign,
      uid: rollUid,
      isDmRoll: isDm,
      diceType: max,
      pictureUserSendRoll: user.photoURL,
    }
    await db.collection('dice').doc(rollUid).set(dataRoll).then(res => {
    
    }).catch(e => {
      console.log(e)
    });
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (diceRef.current && !diceRef.current.contains(event.target) && !classListToListen.includes(event.srcElement.className)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [diceRef]);

  return (
    <div
      ref={diceRef}
      className={`${props.chat}` ? 'containerRollButtonPhone' : 'containerRollButton'}  
    >
      <div className={`${isOpen ? 'open': 'close'}`}>
        <div className='subChoice'>
          <button
            className='subRoll'
            onClick={() => {
              roll(100, user.uid === campaign.idUserDm)
            }}
          >
            d100
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(20, user.uid === campaign.idUserDm)
            }}
          >
            d20
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(12, user.uid === campaign.idUserDm)
            }}
          >
            d12
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(10, user.uid === campaign.idUserDm)
            }}
          >
            d10
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(8, user.uid === campaign.idUserDm)
            }}
          >
            d8
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(6, user.uid === campaign.idUserDm)
            }}
          >
            d6
          </button>
          <button
            className='subRoll'
            onClick={() => {
              roll(4, user.uid === campaign.idUserDm)
            }}
          >
            d4
          </button>
        </div>
      </div>
      <button
        className='mainRoll'
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        Roll
      </button>
    </div>
  );
}
export default DiceRoll