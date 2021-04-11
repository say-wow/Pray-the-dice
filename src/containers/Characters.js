import React, {useEffect, useState} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { uid } from 'uid';
import Character from './Character';
import NewCharacterForm from '../components/NewCharacterForm';
import {init} from '../utils/initFirebase'
init();
const db = firebase.firestore();


const Characters = (props) => {
  let match = useRouteMatch();
  const {userId, campaignId} = props;
  let { campaignIdUrl } = useParams();
  const [characters, setCharacters] = useState([])
  const [character, setCharacter] = useState([])
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
        db.collection('characters').where('idUser', '==', userId).where('alive', '==', true).where('idCampaign', '==', campaignIdUsed).get()
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

  const createCharacter = async (characterData) => {
    const characterUid = uid();
    const data = {
      name: characterData.name,
      uid: characterUid,
      idCampaign: campaignIdUsed,
      idUser: userId,
      age: characterData.age,
      currentHp: characterData.hp,
      maxHp: characterData.hp,
      iAmAwesome: characterData.iAmAwesome,
      problemWithSociety: characterData.problemWithSociety,
      // characteristics: characterData.characteristics,
      // skills: characterData.skills

    };
    await db.collection('characters').doc(characterUid).set(data).then(res => {
      createCharacteristics(characterData.characteristics, characterUid)
      createSkills(characterData.skills, characterUid)

      getCharactersVisibleForUser(campaignIdUsed);
    }).catch(e => {
      console.log(e)
    });
  }

  const createCharacteristics = async (characteristics, characterUid) => {
    for(let i=0; i < characteristics.length; i+=1) {
      const uidChara = uid();
      const dataChara = {
        uid: uidChara,
        name: characteristics[i].label,
        value: characteristics[i].value,
        characterId: characterUid
      }
      await db.collection('characteristics').doc(uidChara).set(dataChara).then(res => {
        console.log('OK')
      }).catch(e => {
        console.log(e)
      });
    }
  }

  const createSkills = async (skills, characterUid) => {
    for(let i=0; i < skills.length; i+=1) {
      const uidChara = uid();
      const dataChara = {
        uid: uidChara,
        name: skills[i].label,
        value: skills[i].value,
        characterId: characterUid
      }
      await db.collection('skills').doc(uidChara).set(dataChara).then(res => {
        console.log('OK')
      }).catch(e => {
        console.log(e)
      });
    }
  }


  return (
    <div>
      <Switch>
        <Route path={`${match.url}/:characterIdUrl`}>
          <Character userId={userId} campaign={campaign} character={character}/>
        </Route>
        <Route path={match.path}>
          <h3>Character</h3>
          <p>Render my characters for this campagne {campaign && campaign.idUserDm === userId ? 'DM version' : 'Player version'}</p>
          {characters.map(character => (
            <Link key={character.uid} onClick={() => setCharacter(character)} to={`${match.url}/${character.uid}`}>
              <li>{character.name}</li>
            </Link>
          ))}
          <NewCharacterForm createCharacter={(character) => {createCharacter(character)}}/>
        </Route>
      </Switch>
    </div>
  );
}

export default Characters