import React, {useEffect, useState} from 'react';

const Home = (props) => {

  const {userId, campaignsList} = props;
  return (
    <div>
      <div>
        <h2>Liste des parties</h2>
        <ul>
          {campaignsList.map(campaign => (
            <li>
              {campaign.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Rejoindre une partie</h2>
      </div>
    </div>
  );
}

export default Home