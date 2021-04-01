import React, {useEffect, useState} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {useParams} from "react-router-dom";
const {
  REACT_APP_API_KEY,
  REACT_APP_AUTHDOMAIN,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGEBUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APP_ID,
  REACT_APP_MEASUREMENT_ID
} = process.env;
const firebaseConfig = {
    apiKey: REACT_APP_API_KEY,
    authDomain: REACT_APP_AUTHDOMAIN,
    projectId: REACT_APP_PROJECT_ID,
    storageBucket: REACT_APP_STORAGEBUCKET,
    messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
    appId: REACT_APP_APP_ID,
    measurementId: REACT_APP_MEASUREMENT_ID
};
if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}else {
  firebase.app();
}
const db = firebase.firestore();


const Characters = (props) => {
  const {userId, campaignId} = props;
  let { campaignIdUrl } = useParams();
  const [characters, setCharacters] = useState([])
  const [campaign, setCampaign] = useState(userId)
  const campaignIdUsed = campaignId || campaignIdUrl;

  useEffect( () => {
    if(campaignIdUrl && userId) {
      getCampaign();
    }
  }, [campaignIdUrl, userId]);


  const getCharactersVisibleForUser = async (currentCampaign) => {
    try {
      const listCharacters = [];
      if (currentCampaign.idUserDm !== userId) {
        db.collection('characters').where('idUser', '==', userId).where('idCampaign', '==', campaignIdUsed).get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              listCharacters.push(doc.data())
            });
            setCharacters(listCharacters);
          })
          .catch(err => {
            console.log(err.messsage)
          })
      } else {
        db.collection('characters').where('idCampaign', '==', campaignIdUsed).get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              listCharacters.push(doc.data())
            });
            setCharacters(listCharacters);
          })
          .catch(err => {
            console.log(err.messsage)
          })
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getCampaign = async () => {
    db.collection('campaigns').doc(campaignIdUsed).get()
      .then(doc => {
        setCampaign(doc.data());
        getCharactersVisibleForUser(doc.data());
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  return (
    <div>
      <h3>Character</h3>
      <p>Render my characters for this campagne {campaign && campaign.idUserDm === userId ? 'DM version' : 'Player version'}</p>
      {characters.map(character => (
          <li key={character.uid}>{character.name}</li>
      ))}
    </div>
  );
}

export default Characters