import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import i18next from 'i18next';
import { uid } from 'uid';
import {init} from '../utils/initFirebase';
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  useHistory
} from "react-router-dom";
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Inventory from '../components/Inventory';

init();
const db = firebase.firestore();

const MobileInventory = () => {
  let match = useRouteMatch();

  const {character, updateCharacter} = useContext(CharacterContext);
  const {campaign} = useContext(CampaignContext);


  // useEffect( () => {
  
  // }, [character]);



  return (
    <div className=''>
      <Inventory />
    </div>
  );
  
}

export default MobileInventory