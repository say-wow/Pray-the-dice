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
import Login from './containers/Login';
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
  });

  const [userId, setUserId] = useState(null)
  const [userPicture, setUserPicture] = useState(null)
  
    useEffect( () => {
      getUserId();
    },[]);

    const getUserId = () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setUserId(user.uid);
          setUserPicture(user.photoURL);
        } else {
          setUserId(null);
        }
      });
    }


  const getLoginLogoutButton = () => {
    if(userId === null) {
      return (
        <div>
          <button
            onClick={() => {
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(googleAuthProvider)
              .then(data => {
              
                console.log(data.user);
                setUserPicture(data.user.photoURL)
                setUserId(data.user.uid);
              })
              .catch(error => {
                  console.log(error);
              });
            }}
          >
            Sign In with Google
          </button>
        </div>
      )
    } else {
      return (
        <div>
          <img src={userPicture} style={{width: 100, height:100}} alt="Logo" />
          <button
            onClick={() => {
              setUserId(null);
              firebase.auth().signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      )
    }
  }

  return (
    <Router>
      <div>
      {getLoginLogoutButton()}
        <ul>
          {userId && (
            <li>
              <Link to="/campaigns">Home</Link>
            </li>
          )}
        </ul>

        <Switch>

          <Route path="/campaigns">
            <Campaigns 
              userId={userId}
            />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          {!userId && (
            <Route>
              <Redirect to="/login" />
            </Route> 
          )}
          {/* <Route exact path="/">
              <Redirect to="/campaigns" />
          </Route> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App