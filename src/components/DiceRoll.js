import React, {useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { uid } from 'uid';
import {init} from '../utils/initFirebase'
import CharacterContext from '../context/CharacterContext';
import UserContext from '../context/UserContext';
import CampaignContext from '../context/CampaignContext';

init();
const db = firebase.firestore();

const DiceRoll = () => {
const {character} = useContext(CharacterContext);
const {user} = useContext(UserContext);
const {campaign} = useContext(CampaignContext);

  const roll = async (max, isDm) => {
    const randomValue = Math.floor(Math.random() * max);
    const rollUid = uid();
    const dataRoll = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userName: !isDm ? character.name : "DM",
      characterId: !isDm ? character.uid : null,
      value: randomValue,
      campaignId: character.idCampaign,
      uid: rollUid,
      isDmRoll: isDm
    }
    await db.collection('dice').doc(rollUid).set(dataRoll).then(res => {
      // getCampaigns();
    }).catch(e => {
      console.log(e)
    });
  }

  return (
    <button
      onClick={() => {
        roll(100, user.uid === campaign.idUserDm)
      }}
    >
      Roll
    </button>
  );
}
export default DiceRoll