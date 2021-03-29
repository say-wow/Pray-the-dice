import React, {useEffect, useState} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { FirebaseAuthProvider } from "@react-firebase/auth";
import { uid } from 'uid';

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
  const [games, setGames] = useState([])
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
        setGames(listGames)
      })
      .catch(err => {
        console.log(err.message)
      })
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
    await db.collection('games').doc(gameUid).set(data).then(res => {
      console.log('game created', invitationCode);
      getGames(userId);
    }).catch(e => {
      console.log(e)
    });
  }

  const createNewUser = async (currentUser) => {
    let document = await db.collection("users").doc(currentUser.uid).get();
    if (document && document.exists) {
      console.log(document.data());
    } else {
      const data = {
        displayName: currentUser.displayName,
        email: currentUser.email,
        uid: currentUser.uid
      };
      await db.collection('users').doc(currentUser.uid).set(data).then(() => {

      }).catch(e => {
        console.log(e)
      });
    }
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
                createNewUser(data.user);
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
    <div>
      <div>
      <FirebaseAuthProvider  firebase={firebase}>
      <div>
        {getLoginLogoutButton()}
      </div>
    </FirebaseAuthProvider>
    </div>
    <button
      onClick={() => {
        sendGame(userId)
      }}>
      Create a new game
    </button>
    {games.length === 0 ? null : games.map(game => <h1 key={game.uid}>{game.name}</h1>) }
    </div>
  );
};
export default App;
