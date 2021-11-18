import i18next from 'i18next';
import React from 'react';
import {
    getNumberOfCriticalFail,
    getNumberOfCriticalSuccess,
    playerMostUnlucky,
    playerMostLucky
  } from '../utils/stats';

const Statistics = (props) => {
  const {rollList, company} = props;

  return (
    <div className='statsCampaign'>
      <h2>{i18next.t('stats.title')}</h2>
      <div>
        <span>
          {i18next.t('stats.TotalRoll')} :
        </span>
        <span>
          {rollList.filter(roll => roll.diceType !== "Magic").length}
        </span>
      </div>
      <div>
        <span>
          {i18next.t('stats.criticFail')} :
        </span>
        <span>
          {getNumberOfCriticalFail(rollList)}
        </span>
      </div>
      <div>
        <span>
          {i18next.t('stats.criticSuccess')} :
        </span>
        <span>
          {getNumberOfCriticalSuccess(rollList)}
        </span>
      </div>
      <div>
        <span>
          {i18next.t('stats.unluckiestPlayer')} :
        </span>
        <span>
          {playerMostUnlucky(rollList, company) ? `${playerMostUnlucky(rollList, company).character} (${playerMostUnlucky(rollList, company).numberOfCriticalFail})` : ''}
        </span>
      </div>
      <div>
        <span>
          {i18next.t('stats.luckiestPlayer')} :
        </span>
        <span>
          {playerMostLucky(rollList, company) ? `${playerMostLucky(rollList, company).character} (${playerMostLucky(rollList, company).numberOfCriticalSuccess})` : ''}
        </span>
      </div>
    </div>
  );
  
}

export default Statistics