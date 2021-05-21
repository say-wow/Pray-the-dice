import React, {useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import UserContext from "../context/UserContext";
import '../styles/headerbar.css';
import {Link} from "react-router-dom";
import { ChatIcon } from '@heroicons/react/solid'


const HeaderBar = (props) => {
  const {user, updateUser} = useContext(UserContext)

  return (
    <header>
      <div className='logo'>
        <Link className='link' to="/campaigns">LOGO</Link>
      </div>
      <div className='name'>
        {user.displayName}
      </div>
      <div className='log'>
        <button
          onClick={() => {
            updateUser({
              uid: null,
              displayName: null,
            });
            firebase.auth().signOut();
          }}
        >
          <ChatIcon className="" style={{height : 30}}/>
        </button>
      </div>
    </header>
  );
}
export default HeaderBar