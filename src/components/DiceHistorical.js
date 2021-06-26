import React, {useEffect, useState, useContext, useRef} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import {init} from '../utils/initFirebase';
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';
import UserContext from '../context/UserContext';
import '../styles/diceHisto.css';
import {
  isMobile
} from "react-device-detect";
import i18next from 'i18next';

init();

const cleanDuplicate = (arrayRoll, userUid, campaignUserUidDm) => {
  let savedDate = null;
  let savedPictureUrl = null;
  const newArrayRollList = [];
  arrayRoll.map((roll,i) => {
    roll.displayPicture = true;
    if(roll.createdAt && savedDate !== roll.createdAt.toDate().toLocaleDateString()) {
      savedDate = roll.createdAt.toDate().toLocaleDateString();
    } else {
      roll.createdAt = null;
    }
    if(roll.pictureUserSendRoll && savedPictureUrl !== roll.pictureUserSendRoll) {
      savedPictureUrl = roll.pictureUserSendRoll;
    } else if(i >= 1){
      arrayRoll[i-1].displayPicture = false;
    }
  });

  arrayRoll.map(roll => {
    if(!roll.isDmRoll || (roll.isDmRoll && campaignUserUidDm === userUid)) {
      newArrayRollList.push(roll);
    }
  })
  return newArrayRollList;
};


const DiceHistorical = (props) => {
  const {character} = useContext(CharacterContext);
  const {user} = useContext(UserContext);
  const {campaign} = useContext(CampaignContext);
  const [limitHisto, setLimitHisto] = useState(15);
  const [diceHistorical, setDiceHistorical] = useState([]);
  const db = firebase.firestore();
  const histoView = useRef(null)

  // const getDice = (numberOfDiceToAdd = 0) => {
  //   const limit = limitHisto + numberOfDiceToAdd;
  //   setLimitHisto(limit)
  //   console.log('getDice');
  //   const query = db.collection('dice').where("campaignId", "==", campaign.uid).orderBy('createdAt', 'desc').limit(limit);
  //   const unsubscribe = query.onSnapshot(querySnapshot => {
  //     const data = querySnapshot.docs.map(doc => ({
  //       ...doc.data(),
  //     }));
  //     setDiceHistorical(cleanDuplicate(data.reverse(), user.uid, campaign.idUserDm).reverse());
  //   });
  //   return unsubscribe;
  // }

  useEffect(() => {
    if(user.uid){
      // getDice();
    }
  }, [user]);


  useEffect(() => {
    if(document.getElementById("last") && props.chat) {
      setTimeout(function(){
        document.getElementById("last").scrollIntoView({ behavior: 'smooth'});
      }, 250);

    }
  });


  const isMyRoll = (roll) => {
    if(character.uid === roll.characterId) {
      return true;
    } else if (campaign.idUserDm === user.uid && roll.isDmRoll) {
      return true;
    }
    return false;
  }

  return (
    <div ref={histoView} className='histoView'>
      { diceHistorical.length >= limitHisto && (
        <button
          className='empty'
          onClick={() => {
            // getDice(10);
          }}
        >
          {i18next.t('load more')}
        </button>
      )}
      <ul className="listHisto">
        {diceHistorical.length > 0 && (
          diceHistorical.map((histo, i) => {
            return (
              <div key={histo.uid}>
                {histo.createdAt && (
                  <span className='date'>
                    {histo.createdAt.toDate().toLocaleDateString()}
                  </span>
                )}
                <div className={`${isMyRoll(histo) ? "containerRowReverse" : "containerRow"}`}>
                  {histo.displayPicture && !isMyRoll(histo) && (
                    <img
                      alt="userPicture"
                      className={`${i === 0 && diceHistorical[i-1] && !diceHistorical[i-1].displayPicture ? 'pictureAnimated' : 'userPictureRoll'}`}
                      src={histo.pictureUserSendRoll}
                    />
                  )}
                    
                  <li
                    id={i === 0 ? 'last' : `dice${i+1}`}
                    className={`${isMyRoll(histo) ? "myhistoRow" : "histoRow"} bubbleHisto`}
                    style={!isMyRoll(histo) ? {margin: '5px 35px'} : null}
                    
                  >
                    <div className='histoLeftSide'>
                      <span>
                        {histo.userName}
                      </span>
                      <span>
                        d{histo.diceType}
                      </span>
                    </div>
                    <span className='histoRightSide'>
                      {histo.value}
                    </span>
                  </li>
                </div>
              </div>
            )
          })
        )}
        {diceHistorical.length === 0 && (
          <p className='noDiceMessage'>
            {i18next.t('load more')}
          </p>
        )}
      </ul>
    </div>
  );
}
export default DiceHistorical