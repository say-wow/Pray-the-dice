import React, {useEffect, useState, useContext, useRef} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {init} from '../utils/initFirebase'
import { uid } from 'uid';
import {dynamicSortWithTraduction} from '../utils/sort';
import CharacterContext from '../context/CharacterContext';
import '../styles/inventory.css'
import { PencilIcon, TrashIcon, RefreshIcon } from '@heroicons/react/solid'
import i18next from 'i18next';

init();
const db = firebase.firestore();

const Inventory = () => {
  const {character, updateCharacter} = useContext(CharacterContext);
  const [itemName, setItemName] = useState()
  const [numberOfnewItem, setNumberOfnewItem] = useState()
  const [lineToUpdateInv, setLineToUpdateInv] = useState(null)
  const [updateItem, setUpdateItem] = useState(null)

  const createItem = () => {
    const itemUid = uid();
    const newItem = {
      uid: itemUid,
      name: itemName,
      number: numberOfnewItem,
      characterId: character.uid,
    };
    console.log('Inventory');
    db.collection('items').doc(itemUid).set(newItem).then(res => {
      // getInventory(character.uid)
    }).catch(e => {
      console.log(e)
    });
  }
  
  const updateItemNumber = async (item) => {
    const updatedItem = {
      ...item,
      number: updateItem
    }
    console.log('updateItemNumber')
    await db.collection('items').doc(item.uid).set(updatedItem).then(res => {
      // getInventory(character.uid)
    }).catch(e => {
      console.log(e)
    });
    
  } 

  const removeItem = (itemUid) => {
    console.log('removeItem');
    db.collection('items').doc(itemUid).delete().then(res => {
      // getInventory(character.uid)
    }).catch(e => {
      console.log(e)
    });
  }

  // const getInventory = async (idCharacter) => {
  //   const listItems = [];
  //   console.log('getInventory');
  //   db.collection('items').where('characterId', '==', idCharacter).get()
  //     .then(doc => {
  //       doc.forEach( doc => {
  //         listItems.push(doc.data())
  //       });
  //       setLineToUpdateInv(null);
  //       listItems.sort(dynamicSortWithTraduction("name"));
  //       updateCharacter({
  //         ...character,
  //         inventory: listItems,
  //       });
  //   })
  //   .catch(err => {
  //     console.log(err.messsage)
  //   })
  // }

  if(character.uid) {
    return (
      <div>
        <p className='titleSection'><b>{i18next.t('inventory')}</b></p>
          <div>
            <div className={'tableInvHeader tableInvRow'}>
              <div>
                <span>{i18next.t('name')}</span>
              </div>
              <div>
                <span>{i18next.t('number')}</span>
              </div>
              <div>
                <span>{i18next.t('option')}</span>
              </div>
            </div>
          {
            character.inventory.map((item, i) => (
              <div key={item.uid} className='tableInvRow'>
                <div>
                  <span>{item.name}</span>
                </div>
                <div>
                  {lineToUpdateInv === i && (
                    <input
                      name="update number item"
                      type="number"
                      placeholder={item.number}
                      value={numberOfnewItem}
                      onChange={(e) => {
                        // setUpdateItem(e.target.value ? JSON.parse(e.target.value) : '');
                      }}
                    />
                  )}
                  {lineToUpdateInv !== i && (
                    <span>{`x ${item.number}`}</span>
                  )}
                </div>
                <div>
                  {lineToUpdateInv === i && (
                    <button
                      className='optionBtnInv'
                      onClick={() => {
                        // updateItemNumber(item)
                      }}
                    >
                      <RefreshIcon className="iconInv"/>
                    </button>
                  )}
                  {lineToUpdateInv !== i && (
                    <button
                      className='optionBtnInv'
                      onClick={() => {
                        // setLineToUpdateInv(i);
                      }}
                    >
                      <PencilIcon className="iconInv"/> 
                    </button>
                  )}
                  <button
                    className='optionBtnInv'
                    onClick={() => {
                      // removeItem(item.uid);
                    }}
                  >
                    <TrashIcon className="iconInv" />
                  </button>
                </div>
              </div>
            ))
          }
          </div>
          {/* <form className='formNewInv' onSubmit={(e) => {
            // createItem();
            setItemName('');
            setNumberOfnewItem('');
            e.preventDefault();
          }}>
            <input
              name="newItemInventory"
              type="text"
              placeholder={i18next.t('item name')}
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <input
              name="numberOfNewItem"
              type="number"
              placeholder={i18next.t('number of item')}
              value={numberOfnewItem}
              onChange={(e) => {
                setNumberOfnewItem(e.target.value ? JSON.parse(e.target.value) : '');
              }}
            />
            <input type="submit" value={i18next.t('create')} />
          </form> */}
      </div>
    )
  }
}

export default Inventory