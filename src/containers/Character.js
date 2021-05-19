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
import i18next from 'i18next';
import {init} from '../utils/initFirebase'
import DiceHistorical from '../components/DiceHistorical';
import DiceRoll from '../components/DiceRoll';
import UserContext from '../context/UserContext';
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';
import '../styles/character.css';
import '../styles/modal.css';
import DiceChat from './DiceChat';

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
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
  const [updateHp, setUpdateHp] = useState()
  const [itemName, setItemName] = useState()
  const [numberOfnewItem, setNumberOfnewItem] = useState()

  useEffect( () => {
    getCharacter();
  }, [user, campaign]);

  const getCharacter = async () => {
    db.collection('characters').doc(character.uid || characterIdUrl).get()
      .then(doc => {
        updateCharacter(doc.data());
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
    db.collection('characteristics').where('characterId', '==', idCharacter).get()
      .then(doc => {
        doc.forEach( doc => {      
          listCharacteristics.push(doc.data())
        });
        listCharacteristics.sort(dynamicSortWithTraduction("name"));
        setCharacteristics(listCharacteristics)
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  const getSkills = async (idCharacter) => {
    const listSkills = [];
    db.collection('skills').where('characterId', '==', idCharacter).get()
      .then(doc => {
        doc.forEach( doc => {      
          listSkills.push(doc.data())
        });
        listSkills.sort(dynamicSortWithTraduction("name"));
        setSkills(listSkills)
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  const getInventory = async (idCharacter) => {
    const listItems = [];
    db.collection('items').where('characterId', '==', idCharacter).get()
      .then(doc => {
        doc.forEach( doc => {
          listItems.push(doc.data())
        });
        // listItems.sort(dynamicSortWithTraduction("name"));
        setInventory(listItems)
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

  const dynamicSortWithTraduction = (property) => {
      var sortOrder = 1;
      return function (a,b) {
          if(sortOrder === -1){
              return i18next.t(`skills.${b[property]}`).localeCompare(i18next.t(`skills.${a[property]}`));
          }else{
              return i18next.t(`skills.${a[property]}`).localeCompare(i18next.t(`skills.${b[property]}`));
          }        
      }
  }

  const setCharacter = (table, dataToUpdate, key, newVal) => {
    const newData = {...dataToUpdate};
    newData[key] = newVal;
    db.collection(table).doc(dataToUpdate.uid).set(newData).then(res => {
      getCharacter();
    }).catch(e => {
      console.log(e)
    });
  };

  const createItem = () => {
    const itemUid = uid();
    const newItem = {
      uid: itemUid,
      name: itemName,
      number: numberOfnewItem,
      characterId: character.uid,
    };
    db.collection('Items').doc(itemUid).set(newItem).then(res => {
      getInventory(character.uid)
    }).catch(e => {
      console.log(e)
    });
  }

  const removeItem = (itemUid) => {
    db.collection('Items').doc(itemUid).delete().then(res => {
      getInventory(character.uid)
    }).catch(e => {
      console.log(e)
    });
  }

  if(character && characteristics.length > 0 && skills.length > 0) {
    return (
      <Switch>
        <Route path={`${match.url}/Chat`}>
          <DiceChat/>
        </Route>
        <Route path={match.path}>
          <div className='containerCharacterView'>
            {(character.idUser === user.uid || campaign.idUserDm === user.uid) && (
              <div className='characterContainer'>
                <div className='characterDetails'>
                  <p>{`${i18next.t('name')} : ${character.name}`}</p>
                  <p>{`${i18next.t('age')} : ${character.age}`}</p>
                  <p>{`${i18next.t('hp')} : ${character.currentHp} / ${character.maxHp}`}</p>
                  <p>{`${i18next.t('description')} :`}</p>
                  <p>{character.description}</p>
                </div>
                {/* <p style={{display: "inline-block"}}>
                  <input
                    name="problemWithSociety"
                    type="text"
                    value={updateHp}
                    onChange={(e) => {
                      setUpdateHp(e.target.value ? JSON.parse(e.target.value) : '');
                    }}
                  />
                  <button
                  onClick={() => {
                    setCharacter('characters',character ,'currentHp',character.currentHp - updateHp)
                    setUpdateHp('');
                  }}
                >
                  Remove
                </button>
                <button
                  onClick={() => {
                    setCharacter('characters',character ,'currentHp',character.currentHp + updateHp)
                    setUpdateHp('');
                  }}
                >
                  Add
                </button>
                </p> */}
              
                <div className='characteristicsDetail'>
                  <p className='titleSection'><b>Characteristics</b></p>
                  <ul>
                    {
                      characteristics.map((charac) => (
                        <li key={charac.uid}>
                          <span className='title'>
                            {i18next.t(`characteristics.${charac.name}`)}
                          </span>
                          <span className='value'>
                            {charac.value}
                          </span>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                
                <div className='skillsDetail'>
                  <p className='titleSection'><b>Skills</b></p>
                  <ul>
                    {
                    skills.map((skill) => (
                      <li key={skill.uid}>
                        <span>
                          {i18next.t(`skills.${skill.name}`)}
                        </span>
                        <span>
                          {skill.value}
                        </span>
                      </li>
                    ))
                  }
                  </ul>
                </div>
                <BrowserView>
                  <div className='diceHistorical'>
                    <DiceHistorical/>
                    <DiceRoll/>
                  </div>
                </BrowserView>
                <MobileView>
                  <div>
                    <Link
                      className='link'
                      to={`${match.url}/chat`}
                    >
                      Open Chat
                    </Link>
                  </div>
                </MobileView>
              </div>
              
            )}
            
            <div className='inventory'>
              <p>Inventaire</p>
              <ul>
                {
                  inventory.map((item) => (
                    <li>
                      {`${item.name} x${item.number}`}
                      <button
                        onClick={() => {
                          removeItem(item.uid);
                        }}
                      >
                        X
                      </button>
                    </li>
                  ))
                }
              </ul>
              <form  style={{display: "inline-block"}} onSubmit={(e) => {
                createItem();
                setItemName('');
                setNumberOfnewItem('');
                e.preventDefault();
              }}>
                <input
                  name="newItemInventory"
                  type="text"
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                />
                <input
                  name="numberOfNewItem"
                  type="number"
                  value={numberOfnewItem}
                  onChange={(e) => {
                    setNumberOfnewItem(e.target.value ? JSON.parse(e.target.value) : '');
                  }}
                />
                <input type="submit" value="Ajouter" />
              </form>
            </div>
          </div>
        </Route>
      </Switch>

    );
  } else {
    return null;
  }
  
}

export default Character