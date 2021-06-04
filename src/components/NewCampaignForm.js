import React, {useEffect, useState} from 'react';


const NewCampaignForm = (props) => {
  const [campaignName, setCompaignName] = useState('');
  const {createCampaign} = props;  

  return (
    <form onSubmit={(e) => {
      createCampaign(campaignName);
      e.preventDefault();
    }}>
      <input
        name="campaignName"
        type="text"
        placeholder='Campaign name'
        value={campaignName}
        onChange={(e) => setCompaignName(e.target.value)}
      />
      <input type="submit" value="Créer" />
    </form>
  );
}

export default NewCampaignForm