import React, {useEffect, useState} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";
import Characters from './Characters';

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
if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}else {
  firebase.app();
}
const db = firebase.firestore();


const Campaigns = (props) => {
  const {userId} = props;
  const [campaigns, setCompaigns] = useState([]);
  const [campaign, setCampaign] = useState(null);
  let match = useRouteMatch();

  useEffect( () => {
    getCampaigns();
  }, [props]);


  const getCampaigns = () => {
    const listCampaigns = [];
    db.collection('campaigns').where('idUserDm', '==', userId).get()
      .then(querySnapshot => {
        querySnapshot.forEach( doc => {       
          listCampaigns.push(doc.data())
      });
      db.collection('characters').where('idUser', '==', userId).get()
        .then(querySnapshot => {
          querySnapshot.forEach( doc => { 
          if(!listCampaigns.some(camp => camp.uid === doc.data().idCampaign)) {
            db.collection('campaigns').doc(doc.data().idCampaign).get()
              .then(queryCampaign => {
                listCampaigns.push(queryCampaign.data());
                setCompaigns(listCampaigns)
            })
            .catch(err => {
              console.log(err.message)
            })
          } else {
            setCompaigns(listCampaigns)
          }
        });
      })
      .catch(err => {
        console.log(err.message)
      })
    })
    .catch(err => {
      console.log(err.message)
    })

  }

  return (
    <div>
      <Switch>
        <Route path={`${match.url}/:campaignIdUrl`}>
          <Characters userId={userId} campaignId={campaign}/>
        </Route>
        <Route path={match.path}>
          <h3>My campagnes list</h3>
          {campaigns.map(campaign => (
            <li key={campaign.uid}>
              <Link onClick={() => setCampaign(campaign.uid)} to={`${match.url}/${campaign.uid}`}>
                {campaign.name}
              </Link>
            </li>
          ))}
        </Route>
      </Switch>
    </div>
  );
}

export default Campaigns