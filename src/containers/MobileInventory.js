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

const MobileInventory = (props) => {

  return (
    <div className=''>
      <Inventory
        updateInventory={(characterWithNewInventory) => {
          props.updateInventory(characterWithNewInventory)
        }}
      />
    </div>
  );
  
}

export default MobileInventory