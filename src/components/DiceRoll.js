import React, {useEffect, useState} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { uid } from 'uid';
import {init} from '../utils/initFirebase'
init();
const db = firebase.firestore();

const DiceRoll = (props) => {

  const roll = async (max) => {
    const {character, userId} = props;
    const randomValue = Math.floor(Math.random() * max);
    const rollUid = uid();
    const dataRoll = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userName: userId === character.idUser ? character.name : "GM",
      characterId: userId === character.idUser ? character.uid : null,
      value: randomValue,
      campaignId: character.idCampaign,
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
        roll(100)
      }}
    >
      Roll
    </button>
  );
}
export default DiceRoll