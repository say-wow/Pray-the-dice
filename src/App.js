import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { FirebaseAuthProvider } from "@react-firebase/auth";
import { uid } from 'uid';

import Home from './containers/Home'; 

const {
  REACT_APP_API_KEY,
  REACT_APP_AUTHDOMAIN,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGEBUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APP_ID,
  REACT_APP_MEASUREMENT_ID
} = process.env;

const firebaseConfig = {
    apiKey: REACT_APP_API_KEY,
    authDomain: REACT_APP_AUTHDOMAIN,
    projectId: REACT_APP_PROJECT_ID,
    storageBucket: REACT_APP_STORAGEBUCKET,
    messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
    appId: REACT_APP_APP_ID,
    measurementId: REACT_APP_MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


const App = () => {

  const [campaigns, setCompaigns] = useState([])
  const [userId, setUserId] = useState(null)
  
    useEffect( () => {
      getUserId();
    }, []);

    const getUserId = () => {
        firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setUserId(user.uid);
          getGames(user.uid);
        } else {
          setUserId(null);
        }
      });
    }

    const getGames = (currentUserId) => {
      const listGames = [];
      db.collection('games').where('idUserDm', '==', currentUserId).get()
        .then(querySnapshot => {
          querySnapshot.forEach( doc => {          
            listGames.push(doc.data())
        });
        setCompaigns(listGames)
      })
      .catch(err => {
        console.log(err.message)
      })
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
  console.log(campaigns);
  return (
    <Router>
      <div>
      {getLoginLogoutButton()}
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/topics">
            <Topics />
          </Route>
          <Route path="/">
            <Home 
              userId={userId}
              campaignsList={campaigns}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}

function Topics() {
  let match = useRouteMatch();

  return (
    <div>
      <h2>Topics</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            Props v. State
          </Link>
        </li>
      </ul>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  );
}

function Topic() {
  let { topicId } = useParams();
  return <h3>Requested topic ID: {topicId}</h3>;
}

export default App