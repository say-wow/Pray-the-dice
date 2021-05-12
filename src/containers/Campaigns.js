import React, {useEffect, useState, useContext} from 'react';
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
import { uid } from 'uid';
// import { FirebaseDatabaseProvider } from "@react-firebase/database";
import i18next from 'i18next';
import UserContext from '../context/UserContext';
import CampaignContext from '../context/CampaignContext';
import Characters from './Characters';
import NewCampaignForm from '../components/NewCampaignForm';
import {init} from '../utils/initFirebase'
import '../styles/campaigns.css';
init();
const db = firebase.firestore();


const Campaigns = (props) => {
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState({
    uid: null,
    idUserDm: null,
    name: null,
    invitationCode: null,
  });
  const [invitationJoinCode, setInvitationJoinCode] = useState(undefined);
  const [campaignToJoin, setCampaignToJoin] = useState(undefined);
  const [campaignListToSearch, setCampaignListToSearch] = useState([]);
  let match = useRouteMatch();

  const {user} = useContext(UserContext)
  const contextValue = {
    campaign,
    updateCampaign: setCampaign
  }

  useEffect( () => {
    setCampaign([]);
    getCampaigns();
  }, [user]);

  useEffect( () => {
    let listCleanUidToSearch = campaignListToSearch.filter((data,index)=>{
      return campaignListToSearch.indexOf(data) === index;
    })
    getCampaignForCharacter(listCleanUidToSearch)
  }, [campaignListToSearch]);


  const getInvitationCodeGame = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const sendGame = async (name = 'test') => {
    const invitationCode = getInvitationCodeGame();
    const gameUid = uid();
    const data = {
      idUserDm: user.uid,
      invitationCode: invitationCode,
      name: name,
      uid: gameUid
    };
    await db.collection('campaigns').doc(gameUid).set(data).then(res => {
      console.log('game created', invitationCode);
      getCampaigns();
    }).catch(e => {
      console.log(e)
    });
  }


  const joinCampaignByInvitationCode = () => {
    db.collection('campaigns').where('invitationCode', '==', invitationJoinCode).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          setCampaignToJoin(doc.data());
        });
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  const getCampaigns = () => {
    setCampaigns([])
    const listCampaigns = [];
    setCampaigns(listCampaigns);
    db.collection('campaigns').where('idUserDm', '==', user.uid).get()
      .then(querySnapshot => {
        querySnapshot.forEach( doc => {
          listCampaigns.push(doc.data())
        });
        setCampaigns(listCampaigns);
        getCharacterForUser()
      })
    .catch(err => {
      console.log(err.message)
    })
  }

  const getCharacterForUser = () => {
    const listUidToSearch = [];
    db.collection('characters').where('idUser', '==', user.uid).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          listUidToSearch.push(doc.data().idCampaign)
      });
      const cleanListUid = listUidToSearch.filter((currentUid) => {
        for(let i = 0; i < campaigns.length; i+=1) {
          console.log(currentUid, campaigns[i].uid)
          if(currentUid === campaigns[i].uid) {
            return false;
          }
        }
        return true;
      });
      setCampaignListToSearch(cleanListUid)
    })
    .catch(err => {
      console.log(err.message)
    })
  }

  const getCampaignForCharacter = (uidList) => {
    const campaignByCharacter = [...campaigns];
    uidList.map((uid) => {
      db.collection('campaigns').doc(uid).get()
        .then(queryCampaign => {
          campaignByCharacter.push(queryCampaign.data())
          setCampaigns(campaignByCharacter);
        })
      .catch(err => {
        console.log(err.message)
      })
    });
  }

  return (
    <div className='mainContainer'>
      <CampaignContext.Provider value={contextValue}>
        <Switch>
          <Route path={`${match.url}/:campaignIdUrl`}>
            <Characters/>
          </Route>
          <Route path={match.path}>
            <div className='containerCampaigns'>
              <div className='campaignList'>
                <ul>
                  {campaigns.map(campaign => (
                  <li key={campaign.uid}>
                    <Link className='link' onClick={() => setCampaign(campaign)} to={`${match.url}/${campaign.uid}`}>
                      {campaign.name}
                    </Link>
                  </li>
                ))}
                </ul>
              </div>
              
              <NewCampaignForm className='formNewCampaign' createCampaign={(campaignName) => {
                sendGame(campaignName);
              }}/>


              <div className='formJoin'>
                <form onSubmit={(e) => {
                  joinCampaignByInvitationCode();
                  e.preventDefault();
                }}>
                  <input
                    name="campaignName"
                    type="text"
                    value={invitationJoinCode}
                    onChange={(e) => setInvitationJoinCode(e.target.value)}
                  />
                  <input type="submit" value="Rejoindre" />
                </form>

              </div>

              {campaignToJoin && (
                <Link className='link' onClick={() => setCampaign(campaignToJoin)} to={`${match.url}/${campaignToJoin.uid}`}>
                  {`JOIN ${campaignToJoin.name}`}
                </Link>
              )}
            </div>
          </Route>
        </Switch>
      </CampaignContext.Provider>
    </div>
  );
}

export default Campaigns