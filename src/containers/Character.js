import React, {useEffect, useState, useContext, useRef} from 'react';
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
import { ChatIcon, PencilAltIcon, ChevronDownIcon, ChevronUpIcon, CollectionIcon, ArchiveIcon } from '@heroicons/react/outline'
import {dynamicSortWithTraduction} from '../utils/sort';
import {
  BrowserView,
  MobileView,
} from "react-device-detect";

init();
const db = firebase.firestore();

const Character = (props) => {
  let match = useRouteMatch();
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const {character, updateCharacter} = useContext(CharacterContext);
  let { characterIdUrl } = useParams();
  const [characteristics, setCharacteristics] = useState([])
  const [skills, setSkills] = useState([])
  const [inventory, setInventory] = useState([])
  const [itemName, setItemName] = useState()
  const [numberOfnewItem, setNumberOfnewItem] = useState()
  const [descriptionIsDisplay, setDescriptionIsDisplay] = useState(false)

  useEffect( () => {
    getCharacter();
  }, [user]);

  useEffect( () => {
    updateCharacter({
      ...character,
      skills: skills,
      characteristics: characteristics,
      inventory: inventory,
    });
  }, [characteristics, skills, inventory]);

  const getCharacter = async () => {
    console.log('getCharacter');
    db.collection('characters').doc(character.uid || characterIdUrl).get()
      .then(doc => {
        updateCharacter({
          ...character,
          ...doc.data()
        });
        getCharacteristics(doc.data().uid)
        getSkills(doc.data().uid)
        getInventory(doc.data().uid)
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  const getCharacteristics = async (idCharacter) => {
    const listCharacteristics = [];
    console.log('getCharacteristics');
    db.collection('characteristics').where('characterId', '==', idCharacter).get()
      .then(doc => {
        doc.forEach( doc => {      
          listCharacteristics.push(doc.data())
        });
        listCharacteristics.sort(dynamicSortWithTraduction("name", 'characteristics'));
        setCharacteristics(listCharacteristics)
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  const getSkills = async (idCharacter) => {
    const listSkills = [];
    console.log('getSkills');
    db.collection('skills').where('characterId', '==', idCharacter).get()
      .then(doc => {
        doc.forEach( doc => {      
          listSkills.push(doc.data())
        });
        listSkills.sort(dynamicSortWithTraduction("name", 'skills'));
        setSkills(listSkills)
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  const getInventory = async (idCharacter) => {
    const listItems = [];
    console.log('getInventory');
    db.collection('items').where('characterId', '==', idCharacter).get()
      .then(doc => {
        doc.forEach( doc => {
          listItems.push(doc.data())
        });
        listItems.sort(dynamicSortWithTraduction("name"));
        setInventory(listItems)
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  if(character && characteristics.length > 0 && skills.length > 0) {
    return (
      <Switch>
        <Route path={`${match.url}/chat`}>
          <DiceChat/>
        </Route>
        <Route path={`${match.url}/edit`}>
          <EditCharacter/>
        </Route>
        <Route path={`${match.url}/inventory`}>
          <MobileInventory/>
        </Route>
        <Route path={match.path}>
          <div className='containerCharacterView'>
            {(character.idUser === user.uid || campaign.idUserDm === user.uid) && (
              <div className='characterContainer'>
                <div className='characterDetails'>
                  <div className='headDetails'>
                    <div className='nameContainer'>
                      <h2>
                        <span>{character.name}</span>
                        {campaign.idUserDm === user.uid && (
                          <span className='infoDmView'>({i18next.t('dm')})</span>
                        )}
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
                  <div className='descriptionDetails'>
                    <p
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
                </div>
                <div className='characteristicsDetail'>
                  <p className='titleSection'><b>{i18next.t('characteristic')}</b></p>
                  <ul>
                    {
                      characteristics.map((charac) => (
                        <li key={charac.uid}>
                          <span className='title'>
                            {i18next.t(`characteristics.${charac.name}`)}
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
                    skills.map((skill) => (
                      <li key={skill.uid}>
                        <span>
                          {skill.isCustom ? skill.name : i18next.t(`skills.${skill.name}`)}
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
                    <ArchiveIcon className="iconEdit"/>
                    <span>{i18next.t('inventory')}</span>
                  </Link>
                </MobileView>
                {/* <BrowserView className='containerHisto'>
                  <DiceHistorical/>
                </BrowserView> */}
                <div className='inventory'>
                  <Inventory/>
                </div>
                <BrowserView>
                  <DiceRoll chat={false}/>
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