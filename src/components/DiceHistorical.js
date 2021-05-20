import React, {useEffect, useState, useContext, useRef} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {init} from '../utils/initFirebase';
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';
import UserContext from '../context/UserContext';
import '../styles/diceHisto.css'
init();

const DiceHistorical = (props) => {
  const {character} = useContext(CharacterContext);
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const [limitHisto, setLimitHisto] = useState(15)
  const [diceHistorical, setDiceHistorical] = useState([]);
  const db = firebase.firestore();
  const histoView = useRef(null)

  useEffect(() => {
    const query = db.collection('dice').where("campaignId", "==", campaign.uid).orderBy('createdAt', 'desc').limit(limitHisto);
    const unsubscribe = query.onSnapshot(querySnapshot => {
      if(document.getElementById("last")) {
        document.getElementById("last").scrollIntoView({ behavior: 'smooth'});    
      }
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      setDiceHistorical(data.reverse());
    });
    return unsubscribe;
  }, []);

  const isMyRoll = (roll) => {
    if(character.uid === roll.characterId) {
      return true;
    } else if (campaign.idUserDm === user.uid && roll.isDmRoll) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if(document.getElementById("last") && limitHisto === 15) {
      document.getElementById("last").scrollIntoView({ behavior: 'smooth'});    
    }
  });
  return (
    <div ref={histoView} className='histoView'>
      { diceHistorical.length >= limitHisto && (
        <button
          className='empty'
          onClick={() => {
            const limit = limitHisto + 10;
            setLimitHisto(limit)
            const query = db.collection('dice').where("campaignId", "==", campaign.uid).orderBy('createdAt', 'desc').limit(limit);
            const unsubscribe = query.onSnapshot(querySnapshot => {
              const data = querySnapshot.docs.map(doc => ({
                ...doc.data(),
              }));
              setDiceHistorical(data.reverse());
            });
            return unsubscribe;
          }}
        >
          Load more ...
        </button>
      )}
      <ul className="listHisto">
        {diceHistorical.map((histo, i) => {
          if (!histo.isDmRoll || (histo.isDmRoll && campaign.idUserDm === user.uid)) {
            return (
              <li
                id={i+1 === diceHistorical.length ? 'last' : `dice${i+1}`}
                className={`${isMyRoll(histo) ? "myhistoRow" : "histoRow"} bubbleHisto`}
                key={histo.uid}
              >
                <div className='histoLeftSide'>
                  <span>
                    {histo.userName}
                  </span>
                  <span>
                    d{histo.diceType}
                  </span>
                </div>
                <span className='histoRightSide'>
                  {histo.value}
                </span>
              </li>
            )
          }
          return null;
        })}
      </ul>
    </div>
  );
}
export default DiceHistorical