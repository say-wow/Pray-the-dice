import React, {useEffect, useState, useContext} from 'react';
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
import UserContext from '../context/UserContext';
import CampaignContext from '../context/CampaignContext';
import CharacterContext from '../context/CharacterContext';
import {init} from '../utils/initFirebase'
import '../styles/characters.css';
init();
const db = firebase.firestore();

const Characters = (props) => {
  let match = useRouteMatch();
  let { campaignIdUrl } = useParams();
  const [characters, setCharacters] = useState([])
  const [character, setCharacter] = useState({
      name: '',
      uid: undefined,
      idCampaign: undefined,
      idUser: undefined,
      age: '',
      currentHp: undefined,
      maxHp: undefined,
      description: ''
  })
  const {user} = useContext(UserContext)
  const {campaign, updateCampaign} = useContext(CampaignContext)
  const campaignIdUsed = campaign.uid || campaignIdUrl;
  
  const contextValue = {
    character,
    updateCharacter: setCharacter
  }

  // console.log(user)
  useEffect( () => {
    if(!campaign.uid) {
      getCampaign();
    }
    else if(campaignIdUrl && user) {
      getCharactersVisibleForUser(campaign);
    }
  }, [user]);


  const getCharactersVisibleForUser = async (currentCampaign) => {
    try {
      const listCharacters = [];
      if (currentCampaign.idUserDm !== user.uid) {
        db.collection('characters').where('idUser', '==', user.uid).where('idCampaign', '==', campaignIdUsed).get()
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
        updateCampaign(doc.data());
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
      idUser: user.uid,
      age: characterData.age,
      currentHp: characterData.hp,
      maxHp: characterData.hp,
      description: characterData.description,
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
    <div className='containerCharacters'>
      <CharacterContext.Provider value={contextValue}>
        <Switch>
          <Route path={`${match.url}/:characterIdUrl`}>
            <Character character={character}/>
          </Route>
          <Route path={match.path}>
            <div className='listCharacters'>
              <h3>Character</h3>
              <ul className='list'>
                {characters.map(character => (
                  <li>
                    <Link
                      className='link'
                      key={character.uid}
                      onClick={() => {
                        setCharacter(character)
                      }}
                      to={`${match.url}/${character.uid}`}
                    >
                      {character.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <NewCharacterForm
              className='newCharacterForm'
              createCharacter={(character) => {createCharacter(character)}}
            />
          </Route>
        </Switch>
      </CharacterContext.Provider>
    </div>
  );
}

export default Characters