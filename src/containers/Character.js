import React, {useEffect, useState, useContext, useRef} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import 'firebase/analytics';
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import i18next from 'i18next';
import {init} from '../utils/initFirebase'
import DiceHistorical from '../components/DiceHistorical';
import DiceRoll from '../components/DiceRoll';
import Inventory from '../components/Inventory';
import UserContext from '../context/UserContext';
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';
import '../styles/character.css';
import '../styles/modal.css';
import DiceChat from './DiceChat';
import EditCharacter from './EditCharacter';
import MobileInventory from './MobileInventory';
import { ChatIcon, PencilAltIcon, ChevronDownIcon, ChevronUpIcon, ArchiveIcon } from '@heroicons/react/outline'
import {dynamicSortWithTraduction} from '../utils/sort';
import {getRoll} from '../utils/dice';
import {
  BrowserView,
  MobileView,
  isMobile
} from "react-device-detect";
import { toast } from 'react-toastify';

init();
const db = firebase.firestore();

const Character = (props) => {
  let match = useRouteMatch();
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const {character, updateCharacter} = useContext(CharacterContext);
  let { characterIdUrl } = useParams();
  const [descriptionIsDisplay, setDescriptionIsDisplay] = useState(false)
  const [rollList, setRollList] = useState([]);
  const [characteristics,setCharacteristics] = useState([]);
  const [skills,setSkills] = useState([]);
  const [hideRollSwitch,setHideRollSwitch] = useState(false);

  useEffect(() => {
    if(user.uid) {
      getCharacter();
    }
  }, []);

  useEffect(() => {
    if(character.uid) {
      const dbRefObject = firebase.database().ref().child(`${character.idCampaign}`);
      dbRefObject.on('value', snap => {
        setRollList(Object.values(snap.val() || {}));
      });
      setCharacteristics(character.characteristics.sort(dynamicSortWithTraduction("label", 'characteristics')));
      setSkills(character.skills.sort(dynamicSortWithTraduction("label", 'skills')));
    }
  },[character])

  const getCharacter = async () => {
    console.log('getCharacter');
    await db.collection('characters').doc(character.uid || characterIdUrl).get()
      .then(doc => {
        updateCharacter({
          ...doc.data(),
        });
        setCharacteristics(doc.data().characteristics.sort(dynamicSortWithTraduction("label", 'characteristics')));
        setSkills(doc.data().skills.sort(dynamicSortWithTraduction("label", 'skills')));
    })
    .catch(err => {
      console.log(err)
    })
  }

  const sendNewRoll = (newRoll) => {
    const newList = [
      ...rollList
    ];
    newList.push(newRoll);
    console.log(newRoll)
    firebase.database().ref().child(`${character.idCampaign}`).set(newList);
    if(isMobile) {
      const infoStat = newRoll.stat ? `${newRoll.stat.isCustom ? newRoll.stat.label : i18next.t(`skills.${newRoll.stat.label}`)} (${newRoll.stat.value})` : `Custom d${newRoll.diceType}`
      toast.success(`${infoStat} : ${newRoll.value}`, {});
    }
    firebase.analytics().setUserId(user.uid);
    firebase.analytics().setUserProperties({
      name: user.displayName,
      uid: user.uid,
      campaign: campaign.uid,
    });
    firebase.analytics().logEvent('Roll', {
      campaign: campaign.uid,
      stat: newRoll.stat ? newRoll.stat.label : 'Custom',
      result: newRoll.value 
    });
  }

  const updateFirestoreCharacter = async (newData) => {
    await db.collection('characters').doc(newData.uid).set(newData).then(res => {
      // toast.success(i18next.t('update succed'), {});
    }).catch(e => {
      console.log(e)
    });
  }

  if(character) {
    return (
      <Switch>
        <Route path={`${match.url}/chat`}>
          <DiceChat
            list={rollList}
            setNewDice={(valMaxRoll) => {
              sendNewRoll(getRoll(valMaxRoll,campaign.idUserDm, character, user, null, hideRollSwitch));
            }}
            hideRollSwitch={hideRollSwitch}
            setHideRoll={(val) => {
              setHideRollSwitch(val)
             }}
          />
        </Route>
        <Route path={`${match.url}/edit`}>
          <EditCharacter
            updateDataCharacter={(characterUpdated) => {
              updateCharacter({
                ...characterUpdated,
              });
              updateFirestoreCharacter(characterUpdated);
            }}
          />
        </Route>
        <Route path={`${match.url}/inventory`}>
          <MobileInventory
            updateInventory={(characterWithNewInventory) => {
              updateCharacter({
                ...characterWithNewInventory,
              });
              updateFirestoreCharacter(characterWithNewInventory);
            }}
          />
        </Route>
        <Route path={match.path}>
          <div className='containerCharacterView'>
            {(character.idUser === user.uid || campaign.idUserDm === user.uid) && (
              <div className='characterContainer'>
                <div className='characterDetails'>
                  <div className='headDetails'>
                    <div className='DMContainer'>
                      {campaign.idUserDm === user.uid && (
                          <h1 className='infoDmView'>{i18next.t('dm')}</h1>
                        )}
                    </div>
                    <div className='nameContainer'>
                      <h2>
                        <span>{character.name}</span>
                      </h2>
                      <Link
                        className={'link editLink'}
                        to={`${match.url}/edit`}
                      >
                        <PencilAltIcon className="iconEdit"/>
                      </Link>
                    </div>
                    <MobileView className='linkChatContainer'>
                      <Link
                        className='link'
                        to={`${match.url}/chat`}
                      >
                        <ChatIcon className="iconChat"/>
                      </Link>
                    </MobileView>
                  </div>
                  <div className='healthDetails'>
                    <span>{`${i18next.t('hp')} : ${character.currentHp} / ${character.maxHp}`}</span>
                  </div>
                  {character.description && (
                    <div className='descriptionDetails'>
                      <p
                        className="click"
                        onClick={() => {
                          setDescriptionIsDisplay(!descriptionIsDisplay)
                        }}
                      >
                        {`${i18next.t('description')}`}
                        {descriptionIsDisplay && (
                          <ChevronUpIcon className='iconDescriptionOpen' />
                        )}
                        {!descriptionIsDisplay && (
                          <ChevronDownIcon className='iconDescriptionOpen' />
                        )}
                      </p>
                      {descriptionIsDisplay && (
                        <p>{character.description}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className='characteristicsDetail'>
                  <p className='titleSection'><b>{i18next.t('characteristic')}</b></p>
                  <ul>
                    {
                      characteristics.map((charac, i) => (
                        <li key={i}>
                          <span className='title'>
                            {i18next.t(`characteristics.${charac.label}`)}
                          </span>
                          <span className='subtitle'>
                            ({charac.value})
                          </span>
                          <span className='value'>
                            {charac.value * 5}
                          </span>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <div className='skillsDetail'>
                  <p className='titleSection'><b>{i18next.t('skill')}</b></p>
                  <ul>
                    {
                    skills.sort(dynamicSortWithTraduction("label", 'skills')).map((skill,i) => (
                      <li key={i} onClick={() => {
                        sendNewRoll(getRoll(100,campaign.idUserDm, character, user, skill, hideRollSwitch))
                      }}>
                        <span>
                          {skill.isCustom ? skill.label : i18next.t(`skills.${skill.label}`)}
                        </span>
                        <span>
                          {skill.value}
                        </span>
                      </li>
                    ))
                  }
                  </ul>
                </div>
                <MobileView className='mobileInv'>
                  <Link
                    className='fullButton'
                    to={`${match.url}/inventory`}
                  >
                    <ArchiveIcon className="iconInvLarge"/>
                    <span>{i18next.t('inventory')}</span>
                  </Link>
                </MobileView>
                <BrowserView className='containerHisto'>
                  <DiceHistorical
                    list={rollList}
                    hideRollSwitch={hideRollSwitch}
                    setHideRoll={(val) => {
                      setHideRollSwitch(val)
                    }}
                  />
                </BrowserView>
                <BrowserView>
                  <div className='inventory'>
                    <Inventory
                      updateInventory={(characterWithNewInventory) => {
                        updateCharacter({
                          ...characterWithNewInventory,
                        });
                        updateFirestoreCharacter(characterWithNewInventory);
                      }}
                    />
                  </div>
                </BrowserView>
                <BrowserView>
                  <DiceRoll
                    chat={false}
                    setNewDice={(valMaxRoll) => {
                      sendNewRoll(getRoll(valMaxRoll,campaign.idUserDm, character, user, null, hideRollSwitch))
                    }}
                  />
                </BrowserView>
              </div>
            )}
          </div>
        </Route>
      </Switch>

    );
  } else {
    return null;
  }
  
}

export default Character