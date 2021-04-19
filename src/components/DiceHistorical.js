import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {init} from '../utils/initFirebase';
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';
import UserContext from '../context/UserContext';
init();

const DiceHistorical = (props) => {
  // const {character} = props;
  const {character} = useContext(CharacterContext);
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const [diceHistorical, setDiceHistorical] = useState([]);
  const db = firebase.firestore();
  const query = db.collection('dice').orderBy('createdAt', 'desc').limit(10);
  // const query = db.collection('dice').where("campaignId", "==", "8911053f0d4").orderBy('createdAt', 'desc').limit(10);

  useEffect(() => {
    const unsubscribe = query.onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      setDiceHistorical(data.reverse());
    });
    return unsubscribe;
  }, []);

  
  return (
    <ul>
      {diceHistorical.map(histo => {
        // if(histo.characterId) {
        //   return (
        //     <li key={histo.uid}>{histo.value}</li>
        //   )
        // }
        if (!histo.isDmRoll || (histo.isDmRoll && campaign.idUserDm === user.uid))
        return (
            <li key={histo.uid}>{`${histo.userName} : ${histo.value}`}</li>
          )
      })}
    </ul>
  );
}
export default DiceHistorical