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
import styles from './styles/index.css'
import enTranslation from './assets/translation/en.json';
import frTranslation from './assets/translation/fr.json';
import {init} from './utils/initFirebase'
init();

const App = () => {

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
    // console.log(i18next.t('characteristics.strength'));
  });

  const [userId, setUserId] = useState(null)
  
    useEffect( () => {
      getUserId();
    },[]);

    const getUserId = () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
        }
      });
    }


  const getLoginLogoutButton = () => {
    if(userId === null) {
      return (
        <button
            onClick={() => {
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(googleAuthProvider)
              .then(data => {
                setUserId(data.user.uid);
              })
              .catch(error => {
                  console.log(error);
              });
            }}
          >
            Sign In with Google
          </button>
      )
    } else {
      return (
        <button
          onClick={() => {
            setUserId(null);
            firebase.auth().signOut();
          }}
        >
          Sign Out
        </button>
      )
    }
  }

  return (
    <Router>
      <div>
      {getLoginLogoutButton()}
        <ul>
          <li>
            <Link to="/campaigns">Home</Link>
          </li>
        </ul>

        <Switch>

          <Route path="/campaigns">
            <Campaigns 
              userId={userId}
            />
          </Route>
          <Route exact path="/">
              <Redirect to="/campaigns" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App