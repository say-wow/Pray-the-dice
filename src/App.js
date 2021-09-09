import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import i18next from 'i18next';
import Campaigns from './containers/Campaigns';
import HeaderBar from './components/HeaderBar';
import Login from './containers/Login';
import enTranslation from './assets/translation/en.json';
import frTranslation from './assets/translation/fr.json';
import {init} from './utils/initFirebase';
import UserContext from "./context/UserContext";
import './index.css';
import './styles/login.css';

init();
const db = firebase.firestore();

const App = () => {

  const [user, setUser] = useState({
    uid: null,
    displayName: null,
  })

  i18next.init({
    lng: 'fr',
    debug: false,
    resources: {
      en: {
        translation: enTranslation
      },
      fr: {
        translation: frTranslation
      }
    }
  }, function(err, t) {
  });
  
    useEffect( () => {
      getUserId();
    },[]);

  const contextValue = {
    user: user,
    updateUser: setUser
  }

    const getUserId = () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setUser(user);
          getUserDataFirestore(user)
        } else {
          setUser({
            uid: null,
            displayName: null,
          });
        }
      });
    }

  const getUserDataFirestore = async (loguser) => {
    await db.collection('users').doc(loguser.uid).get()
    .then(doc => {
      const mergeUser = {
        ...doc.data(),
        ...loguser
      };
      setUser(mergeUser);
    })
    .catch(err => {
      console.log(err.messsage)
    })
  }

    return (
    <Router>
      <UserContext.Provider value={contextValue}>
        <div style={{width: '100%', height: '100%'}}>
        {user && user.uid && (
          <HeaderBar />
        )}
          <Switch>
            <Route path="/campaigns" >
              {!user.uid && (
                <Login />
              )}
              {user && user.uid && (
                <Campaigns />
              )}
            </Route>
            <Route exact path="/">
              <Redirect to="/campaigns" />
            </Route>
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App