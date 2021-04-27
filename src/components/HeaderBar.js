import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import UserContext from "../context/UserContext";


const HeaderBar = (props) => {
  const {user, updateUser} = useContext(UserContext)

  return (
    <div>
      {user && user.uid && (
        <div>
          <button
            onClick={() => {
              updateUser({
                uid: null,
                displayName: null,
              });
              firebase.auth().signOut();
            }}
          >
            {user.displayName}
          </button>
        </div>
      )}
      {!user.uid && (
        <button
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