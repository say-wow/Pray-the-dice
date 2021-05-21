import React, {useEffect, useState, useContext, useRef} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {init} from '../utils/initFirebase';
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';
import UserContext from '../context/UserContext';
import '../styles/diceHisto.css'
init();

const cleanDate = (arrayDate) => {
  let savedDate = null;
  arrayDate.map(date => {
    if(date.createdAt && savedDate !== date.createdAt.toDate().toLocaleDateString()) {
      savedDate = date.createdAt.toDate().toLocaleDateString();
    } else {
      date.createdAt = null;
    }
  });
  return arrayDate;
};


const DiceHistorical = (props) => {
  const {character} = useContext(CharacterContext);
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const [limitHisto, setLimitHisto] = useState(15);
  const [diceHistorical, setDiceHistorical] = useState([]);
  const [classListToListen] = useState(['openChat', 'mainRoll', 'subRoll'])
  const db = firebase.firestore();
  const histoView = useRef(null)

  const getDice = (numberOfDiceToAdd = 0) => {
    const limit = limitHisto + numberOfDiceToAdd;
    setLimitHisto(limit)
    const query = db.collection('dice').where("campaignId", "==", campaign.uid).orderBy('createdAt', 'desc').limit(limit);
    const unsubscribe = query.onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      setDiceHistorical(cleanDate(data.reverse()));
    });
    return unsubscribe;
  }

  useEffect(() => {
    getDice();
  }, []);

  // console.log(user.photoURL);

  useEffect(() => {
    function handleClickOutside(event) {
      if (histoView.current && !histoView.current.contains(event.target) && !classListToListen.includes(event.srcElement.className)) {
        props.display(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [histoView]);

  const isMyRoll = (roll) => {
    if(character.uid === roll.characterId) {
      return true;
    } else if (campaign.idUserDm === user.uid && roll.isDmRoll) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if(document.getElementById("last") && limitHisto === 15) {
      document.getElementById("last").scrollIntoView({ behavior: 'smooth'});    
    }
  });
  return (
    <div ref={histoView} className='histoView'>
      { diceHistorical.length >= limitHisto && (
        <button
          className='empty'
          onClick={() => {
            getDice(10);
          }}
        >
          Load more ...
        </button>
      )}
      <ul className="listHisto">
        {diceHistorical.map((histo, i) => {
          if (!histo.isDmRoll || (histo.isDmRoll && campaign.idUserDm === user.uid)) {
            return (
              <div key={histo.uid} className='containerRollAndDate'>
                {histo.createdAt && (
                  <span className='date'>
                    {histo.createdAt.toDate().toLocaleDateString()}
                  </span>
                )}
                <li
                  id={i+1 === diceHistorical.length ? 'last' : `dice${i+1}`}
                  className={`${isMyRoll(histo) ? "myhistoRow" : "histoRow"} bubbleHisto`}
                >
                  <div className='histoLeftSide'>
                    {histo.pictureUserSendRoll && (
                      <img alt="userPicture" className='userPictureRoll' src={histo.pictureUserSendRoll} />
                    )}
                    <div className='infoRoll'>
                      <span>
                        {histo.userName}
                      </span>
                      <span>
                        d{histo.diceType}
                      </span>
                    </div>
                  </div>
                  <span className='histoRightSide'>
                    {histo.value}
                  </span>
                </li>
              </div>
            )
          }
          return null;
        })}
      </ul>
    </div>
  );
}
export default DiceHistorical