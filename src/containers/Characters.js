import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
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
import {setValueOnLocalStorage, getValueOnLocalStorage} from "../utils/localStorage";

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
  const [playersOnThisCampaign, setPlayersOnThisCampaign] = useState();
  const [campaignRolls, setCampaignRolls] = useState();
  const [noPicture] = useState('https://firebasestorage.googleapis.com/v0/b/beyond-dev-4a10b.appspot.com/o/charactersPictures%2FnoPicture.png?alt=media&token=63a24d98-aaa2-4480-b01d-761e58ad721e');
  
  const contextValue = {
    character,
    updateCharacter: setCharacter
  }

  useEffect( () => {
    if(user.uid){
      getCampaign();

      // if(!campaign.uid) {
      //   getCampaign();
      // }
      // else if(campaignIdUrl && user) {
      //   // getCharactersVisibleForUser(campaign);
      // }
      // getCharacterForUser();
      // getDiceForThisCampaign();
    }
  }, []);


  const getCharactersVisibleForUser = async (currentCampaign) => {
    const savedCaractersList = getValueOnLocalStorage('characters');
    if(!savedCaractersList || savedCaractersList.length === 0 || campaignIdUrl !== currentCampaign.uid || (savedCaractersList.length > 0 && savedCaractersList[0].idCampaign !== campaignIdUrl)) {
      try {
        const listCharacters = [];
        if (currentCampaign.idUserDm !== user.uid) {
          console.log('getCharactersVisibleForUser, 1');
          await db.collection('characters').where('idUser', '==', user.uid).where('idCampaign', '==', campaignIdUsed).get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                listCharacters.push(doc.data())
              });
              setCharacters(listCharacters);
              setValueOnLocalStorage('characters',listCharacters);
            })
            .catch(err => {
              console.log(err.messsage)
            })
        } else {
          console.log('getCharactersVisibleForUser, 2');
          await db.collection('characters').where('idCampaign', '==', campaignIdUsed).get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                listCharacters.push(doc.data())
              });
              setCharacters(listCharacters);
              setValueOnLocalStorage('characters',listCharacters);

            })
            .catch(err => {
              console.log(err.messsage)
            })
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setCharacters(savedCaractersList);
    }
  }

  const getCampaign = async () => {
    const savedCampaign = await getValueOnLocalStorage('currentCampaign');
    if(!savedCampaign || campaignIdUrl !== savedCampaign.uid) {
      console.log('getCampaign');
      await db.collection('campaigns').doc(campaignIdUsed).get()
        .then(doc => {
          updateCampaign(doc.data());
          console.log(doc.data());
          setValueOnLocalStorage('currentCampaign',{...doc.data()});
          getCharactersVisibleForUser(doc.data());
      })
      .catch(err => {
        console.log(err.messsage)
      })
    } else {
      updateCampaign({...savedCampaign});
      getCharactersVisibleForUser({...savedCampaign});
    }
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
      skills: [...characterData.skills],
      characteristics: [...characterData.characteristics],
      inventory: [],
      picture: '',
    };
    await db.collection('characters').doc(characterUid).set(data).then(res => {
      const charactersList = getValueOnLocalStorage('characters');
      charactersList.push(data);
      setValueOnLocalStorage('characters',charactersList);
      getCharactersVisibleForUser(campaignIdUsed);

      firebase.analytics().logEvent('characterCreation',{
        name: data.name,
        idUser: data.idUser,
        idCampaign: data.idCampaign,
        uid: data.uid
      });
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
                <div className='campaignInformation'>
                  <div>
                    <p>
                      <span>
                        {`${i18next.t('name')} : `}
                      </span>
                      <span>
                        {`${campaign.name}`}
                      </span>
                    </p>
                    <p>
                      <span>
                        {`${i18next.t('invitation code')} : `}
                      </span>
                      <span>
                        {`${campaign.invitationCode}`}
                      </span>
                    </p>
                  </div>
                  <div>
                    {campaign.createdBy && (
                      <p>
                        <span>
                          {`${i18next.t('dm')} : `}
                        </span>
                        <span>
                          {`${campaign.createdBy}`}
                        </span>
                      </p>
                    )}
                    {campaign.createdAt && (
                      <p>
                        <span>
                          {`${i18next.t('created at')} : `}
                        </span>
                        <span>
                          {`${new Date(campaign.createdAt.seconds*1000).toLocaleDateString() }`}
                        </span>
                      </p>
                    )}
                  </div>
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
                        <div
                          className='characterPicture'
                          style={{
                            backgroundImage: `url(${character.picture || noPicture})`,
                          }}
                        />
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