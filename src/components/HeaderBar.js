import React, {useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import UserContext from "../context/UserContext";
import '../styles/headerbar.css';
import {Link, useParams} from "react-router-dom";
import { LogoutIcon, HomeIcon } from '@heroicons/react/outline'
import i18next from 'i18next';

const HeaderBar = (props) => {
  const {user, updateUser} = useContext(UserContext)
  console.log(useParams());
  return (
    <header>
      <div className='header'>
        <div className='logo'>
          <Link className={'link homeLink'} to="/campaigns">
            <HomeIcon className='homeLinkIcon' />
          </Link>
        </div>
        <div className='log'>
          <div className="dropdown">
            <button className={'dropbtn main'}>
              {user.displayName}
            </button>
            <div className="dropdown-content">
              <button className="btnDrop" onClick={() => {
                updateUser({
                  uid: null,
                  displayName: null,
                });
                firebase.auth().signOut();
              }}>
                {i18next.t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default HeaderBar