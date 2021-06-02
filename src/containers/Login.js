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
    <div className="wrapperLogin">
      <div className='loginBtn'>
        <button
          onClick={() => {
            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
            console.log(googleAuthProvider)
            firebase.auth().signInWithPopup(googleAuthProvider)
            .then(data => {
              console.log(data)
              updateUser(data.user);
              // firebase.analytics().setUserId(data.user.uid);
              // firebase.analytics().setUserProperties({
              //   store_code: null,
              //   store_country: null,
              //   optician_id: null,
              //   optician_name: null,
              //   optician_code: null,
              // });
            })
            .catch(error => {
                console.log(error);
            });
          }}
        >
          Sign In with Google
        </button>
      </div>
      <div className='characterPanel'>
        {/* <img src={loginCharacter} alt='' /> */}
      </div>
    </div>
    );
}
