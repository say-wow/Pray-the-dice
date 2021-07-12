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

const Inventory = (props) => {
  const {character, updateCharacter} = useContext(CharacterContext);
  const [itemName, setItemName] = useState()
  const [numberOfnewItem, setNumberOfnewItem] = useState()
  const [lineToUpdateInv, setLineToUpdateInv] = useState(null)
  const [updateItem, setUpdateItem] = useState(null)


  const createItem = () => {
    const newItem = {
      name: itemName,
      number: numberOfnewItem,
    };
    console.log('Inventory');
    character.inventory.push(newItem);
    props.updateInventory(character);
  }
  
  const updateItemNumber = async (item, index) => {
    const updatedItem = {
      ...item,
      number: updateItem
    }
    setLineToUpdateInv(null)
    console.log('updateItemNumber')
    character.inventory[index] = updatedItem;
    props.updateInventory(character);
  } 

  const removeItem = (itemIndex) => {
    console.log('removeItem');
    character.inventory.splice(itemIndex, 1);
    props.updateInventory(character);
  }

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
                        setUpdateItem(e.target.value ? JSON.parse(e.target.value) : '');
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
                        updateItemNumber(item, i)
                      }}
                    >
                      <RefreshIcon className="iconInv"/>
                    </button>
                  )}
                  {lineToUpdateInv !== i && (
                    <button
                      className='optionBtnInv'
                      onClick={() => {
                        setLineToUpdateInv(i);
                      }}
                    >
                      <PencilIcon className="iconInv"/> 
                    </button>
                  )}
                  <button
                    className='optionBtnInv'
                    onClick={() => {
                      removeItem(i);
                    }}
                  >
                    <TrashIcon className="iconInv" />
                  </button>
                </div>
              </div>
            ))
          }
          </div>
          <form className='formNewInv' onSubmit={(e) => {
            createItem();
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
          </form>
      </div>
    )
  }
  return null;
}

export default Inventory