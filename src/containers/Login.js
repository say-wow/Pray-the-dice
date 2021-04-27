/* eslint-disable no-use-before-define */
import React, {useContext} from "react";
import loginCharacter from '../assets/Images/loginCharacter.png'
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import UserContext from "../context/UserContext";

export default function Login() {
  const {user, updateUser} = useContext(UserContext)


  return (
    <div class="wrapperLogin">
      <div class='loginBtn'>
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
      </div>
      <div class='characterPanel'>
        <img src={loginCharacter} alt='' />
      </div>
    </div>
    );
}
