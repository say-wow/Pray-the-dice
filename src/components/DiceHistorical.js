import React, {useEffect, useState, useContext} from 'react';
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
  const [diceHistorical, setDiceHistorical] = useState([]);
  const db = firebase.firestore();
  const query = db.collection('dice').where("campaignId", "==", campaign.uid).orderBy('createdAt', 'desc').limit(10);

  useEffect(() => {
    const unsubscribe = query.onSnapshot(querySnapshot => {
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

  return (
    <ul className="listHisto">
      {diceHistorical.map(histo => {
        if (!histo.isDmRoll || (histo.isDmRoll && campaign.idUserDm === user.uid)) {
          return (
            <li
              className={`${isMyRoll(histo) ? "myhistoRow" : "histoRow"} bubbleHisto`}
              key={histo.uid}
            >
              <span>
                {histo.userName}
              </span>
              <span>
                {histo.value}
              </span>
            </li>
          )
        }
        return null;
      })}
    </ul>
  );
}
export default DiceHistorical