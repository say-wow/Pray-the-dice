import firebase from "firebase/app";
const {
  REACT_APP_API_KEY,
  REACT_APP_AUTHDOMAIN,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGEBUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APP_ID,
  REACT_APP_MEASUREMENT_ID,
  REACT_APP_API_KEY_DEV,
  REACT_APP_AUTHDOMAIN_DEV,
  REACT_APP_PROJECT_ID_DEV,
  REACT_APP_STORAGEBUCKET_DEV,
  REACT_APP_MESSAGING_SENDER_ID_DEV,
  REACT_APP_APP_ID_DEV,
  REACT_APP_MEASUREMENT_ID_DEV,
} = process.env;

const firebaseConfig = {
  prod:{
    apiKey: REACT_APP_API_KEY,
    authDomain: REACT_APP_AUTHDOMAIN,
    projectId: REACT_APP_PROJECT_ID,
    storageBucket: REACT_APP_STORAGEBUCKET,
    messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
    appId: REACT_APP_APP_ID,
    measurementId: REACT_APP_MEASUREMENT_ID
  },
  dev: {
    apiKey: REACT_APP_API_KEY_DEV,
    authDomain: REACT_APP_AUTHDOMAIN_DEV,
    projectId: REACT_APP_PROJECT_ID_DEV,
    storageBucket: REACT_APP_STORAGEBUCKET_DEV,
    messagingSenderId: REACT_APP_MESSAGING_SENDER_ID_DEV,
    appId: REACT_APP_APP_ID_DEV,
    measurementId: REACT_APP_MEASUREMENT_ID_DEV,
  }
};

export const init = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig.dev);
    console.log(process.env)
    console.log(firebaseConfig.dev, firebaseConfig.prod)
  }else {
    firebase.app();
  }
}