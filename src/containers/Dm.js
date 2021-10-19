import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import 'firebase/analytics';
import {
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import {init} from '../utils/initFirebase'
import DiceHistorical from '../components/DiceHistorical';
import DiceRoll from '../components/DiceRoll';
import UserContext from '../context/UserContext';
import CampaignContext from '../context/CampaignContext';
import '../styles/character.css';
import '../styles/modal.css';
import DiceChat from './DiceChat';
import {getRoll} from '../utils/dice';
import {
  BrowserView,
  MobileView,
  isMobile
} from "react-device-detect";
import { toast } from 'react-toastify';
import chat from '../assets/Images/chat.png'
import Company from '../components/Company';
import {getLabelDice} from '../utils/dice'
import {useHistory} from "react-router-dom";


init();
const db = firebase.firestore();

const Dm = (props) => {
  let match = useRouteMatch();
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const [rollList, setRollList] = useState([]);
  const [hideRollSwitch,setHideRollSwitch] = useState(false);
  const [company, setCompany] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if(campaign.uid){
      getCharactersCompany(campaign);
      console.log(campaign.uid);
      const dbRefObject = firebase.database().ref().child(`${campaign.uid}`);
      dbRefObject.on('value', snap => {
        setRollList(Object.values(snap.val() || {}));
      });
    }
  }, [campaign]);
  
  const sendNewRoll = async (newRoll) => {
    const newList = [
      ...rollList
    ];
    newList.push(newRoll);
    firebase.database().ref().child(`${campaign.uid}`).set(newList);
    if(isMobile) {
      toast.success(`${getLabelDice(newRoll, campaign, user)} : ${newRoll.value}`, {});
    }
    firebase.analytics().setUserId(user.uid);
    firebase.analytics().setUserProperties({
      name: user.displayName,
      uid: user.uid,
      campaign: campaign.uid,
    });

    const labelStat = newRoll.stat ? newRoll.stat.label : 'Custom'
    firebase.analytics().logEvent('Roll', {
      campaign: campaign.uid,
      stat: labelStat,
      result: newRoll.value 
    });
  }


  const getCharactersCompany = async (currentCampaign) => {
    try {
      const listCharactersGroup = [];
      await db.collection('characters').where('idCampaign', '==', currentCampaign.uid).where('active', '==', true).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if(doc.data().idUser !== currentCampaign.idUserDm) {
              listCharactersGroup.push(doc.data())
            }
          });
          setCompany(listCharactersGroup);

        })
        .catch(err => {
          console.log(err.messsage)
        })
    } catch (error) {
      console.log(error);
    }
  }

  if(campaign.idUserDm === user.uid) {
    return (
      <Switch>
        <Route path={`${match.url}/chat`}>
          <DiceChat
            list={rollList}
            setNewDice={(valMaxRoll) => {
              sendNewRoll(getRoll(valMaxRoll,campaign.idUserDm, null, user, null, hideRollSwitch));
            }}
            hideRollSwitch={hideRollSwitch}
            setHideRoll={(val) => {
              setHideRollSwitch(val)
             }}
          />
        </Route>

        <Route path={match.path}>
          <div className='containerCharacterView'>
              <div className='characterContainer'>
                <MobileView className='linkChatContainerDmView'>
                    <Link
                      className='link'
                      to={`${match.url}/chat`}
                    >
                      <img className="iconChat" src={chat} alt="chat" />
                    </Link>
                  </MobileView>
                <div className='containerInfo'>
                  {company && (
                    <Company
                      list
                      withLife
                      company={company}
                    />  
                  )}
                </div>
                <BrowserView className='containerHisto'>
                  <DiceHistorical
                    list={rollList}
                    hideRollSwitch={hideRollSwitch}
                    setHideRoll={(val) => {
                      setHideRollSwitch(val)
                    }}
                  />
                </BrowserView>
                <BrowserView>
                  <DiceRoll
                    chat={false}
                    setNewDice={(valMaxRoll) => {
                      sendNewRoll(getRoll(valMaxRoll,campaign.idUserDm, null, user, null, hideRollSwitch, null))
                    }}
                  />
                </BrowserView>
              </div>
          </div>
        </Route>
      </Switch>

    );
  } else {
    history.goBack();
    return null;
  }
  
}

export default Dm