import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import styles from "../styles/index.css"
import UserContext from "../context/UserContext";


const HeaderBar = (props) => {
  const {user, updateUser} = useContext(UserContext)

  return (
    <div style={styles.headerBar}>
      {user && (
        <div>
          <button
            style={styles.button}
            onClick={() => {
              updateUser(null);
              firebase.auth().signOut();
            }}
          >
            {user.displayName}
          </button>
        </div>
      )}
      {!user && (
        <button
          style={styles.button}
          onClick={() => {
            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(googleAuthProvider)
            .then(data => {
              updateUser(data.user);
            })
            .catch(error => {
                console.log(error);
            });
          }}
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
}
export default HeaderBar