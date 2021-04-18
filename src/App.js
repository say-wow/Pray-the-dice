import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import i18next from 'i18next';
import Campaigns from './containers/Campaigns';
import HeaderBar from './components/HeaderBar';
import enTranslation from './assets/translation/en.json';
import frTranslation from './assets/translation/fr.json';
import {init} from './utils/initFirebase';
import UserContext from "./context/UserContext";

init();

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
        } else {
          setUser({
            uid: null,
            displayName: null,
          });
        }
      });
    }

// todo Bug user si déconnecté
  console.log(user)
  return (
    <Router>
      <UserContext.Provider value={contextValue}>
        <div>
        <HeaderBar />
          <ul>
            {user && (
              <li>
                <Link to="/campaigns">Home</Link>
              </li>
            )}
          </ul>

          <Switch>
            <Route path="/campaigns">
              <Campaigns />

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