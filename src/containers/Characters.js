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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18next from 'i18next';
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
      currentHp: undefined,
      maxHp: undefined,
      description: '',
      skills: [],
      characteristics: [],
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
    // getDiceForThisCampaign();
    // getCharacterForUser();
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

  const getDiceForThisCampaign = async () => {
    db.collection('dice').where('campaignId', '==', campaign.uid).get()
    .then(querySnapshot => {
      const rollForCampaign = {
        ...campaign,
        roll: querySnapshot.size
      }
      updateCampaign(rollForCampaign);
    })
    .catch(err => {
      console.log(err.messsage)
    })
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
      currentHp: characterData.hp,
      maxHp: characterData.hp,
      description: characterData.description,
    };
    await db.collection('characters').doc(characterUid).set(data).then(res => {
      createCharacteristics(characterData.characteristics, characterUid)
      createSkills(characterData.skills, characterUid)
      getCharactersVisibleForUser(campaignIdUsed);

      toast.success(`${characterData.name} ${i18next.t('was created with success')}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(e => {
      console.log(e)
    });
  }

  const getCharacterForUser = async () => {
    const listUser = [];
    db.collection('characters').where('idCampaign', '==', campaign.uid).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if(listUser.indexOf(doc.data().idUser) === -1) {
            listUser.push(doc.data().idUser);
          }
      });
      const userForCampaign = {
        ...campaign,
        userForCampaign: listUser.length
      }
      updateCampaign(userForCampaign);
    })
    .catch(err => {
      console.log(err.message)
    })
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
      }).catch(e => {
        console.log(e)
      });
    }
  }

  const createSkills = async (skills, characterUid) => {
    for(let i=0; i < skills.length; i+=1) {
      const uidSkill = uid();
      const dataSkill = {
        uid: uidSkill,
        name: skills[i].label,
        value: skills[i].value,
        characterId: characterUid,
        isCustom: false,
      }
      await db.collection('skills').doc(uidSkill).set(dataSkill).then(res => {
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
            <div className="compactPage">
              <div className='listCharacters'>
                <h3>{i18next.t('campaign information')}</h3>
                <div>
                  <p>
                    {`${i18next.t('name')} : ${campaign.name}`}
                  </p>
                  <p>
                    {`${i18next.t('invitation code')} : ${campaign.invitationCode}`}
                  </p>
                  {campaign.createdAt && (
                    <p>
                      {`${i18next.t('created at')} : ${campaign.createdAt.toDate().toLocaleDateString()}`}
                    </p>
                  )}
                  <p>
                    {`${i18next.t('number of dice roll')} : ${campaign.roll || 0}`}
                  </p>
                  <p>
                    {`${i18next.t('number of user')} : ${campaign.userForCampaign || 0}`}
                  </p>
                </div>
                <h3>{i18next.t('my characters')}</h3>
                <ul className='list'>
                  {characters.map((character, i) => (
                    <li key={i}>
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
            </div>
          </Route>
        </Switch>
      </CharacterContext.Provider>
    </div>
  );
}

export default Characters