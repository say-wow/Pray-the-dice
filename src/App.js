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
import { uid } from 'uid';
import Campaigns from './containers/Campaigns';

const {
  REACT_APP_API_KEY,
  REACT_APP_AUTHDOMAIN,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGEBUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APP_ID,
  REACT_APP_MEASUREMENT_ID
} = process.env;

const App = () => {
const firebaseConfig = {
    apiKey: REACT_APP_API_KEY,
    authDomain: REACT_APP_AUTHDOMAIN,
    projectId: REACT_APP_PROJECT_ID,
    storageBucket: REACT_APP_STORAGEBUCKET,
    messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
    appId: REACT_APP_APP_ID,
    measurementId: REACT_APP_MEASUREMENT_ID
};
if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
} else {
   firebase.app();
}

const db = firebase.firestore();
  const [campaigns, setCompaigns] = useState([])
  const [userId, setUserId] = useState(null)
  
    useEffect( () => {
      getUserId();
    },[]);

    const getUserId = () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setUserId(user.uid);
          // getCampaigns(user.uid);
        } else {
          setUserId(null);
        }
      });
    }

    // const getCampaigns = () => {
    //   const listCampaigns = [];
    //   db.collection('campaigns').where('idUserDm', '==', userId).get()
    //     .then(querySnapshot => {
    //       querySnapshot.forEach( doc => { 
    //         // console.log(doc.data());         
    //         listCampaigns.push(doc.data())
    //     });
    //     setCompaigns(listCampaigns)
    //   })
    //   .catch(err => {
    //     console.log(err.message)
    //   })
    // }

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

    const getInvitationCodeGame = () => {
    var result = '';
    var characters = 'ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 4; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const sendGame = async (userId, name = 'test') => {
    const invitationCode = getInvitationCodeGame();
    const gameUid = uid();
    const data = {
      idUserDm: userId,
      invitationCode: invitationCode,
      name: name,
      uid: gameUid
    };
    await db.collection('campaigns').doc(gameUid).set(data).then(res => {
      console.log('game created', invitationCode);
      // getCampaigns(userId);
    }).catch(e => {
      console.log(e)
    });
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
              campaignsList={campaigns}
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