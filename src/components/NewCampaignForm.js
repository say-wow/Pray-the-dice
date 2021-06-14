import i18next from 'i18next';
import React, {useEffect, useState} from 'react';


const NewCampaignForm = (props) => {
  const [campaignName, setCompaignName] = useState('');
  const {createCampaign} = props;  

  return (
    <form
      className='formFullWidthMobile'
      onSubmit={(e) => {
      createCampaign(campaignName);
      e.preventDefault();
    }}>
      <input
        name="campaignName"
        type="text"
        placeholder={i18next.t('campaign name')}
        value={campaignName}
        onChange={(e) => setCompaignName(e.target.value)}
      />
      <input type="submit" value={i18next.t('create')} />
    </form>
  );
}

export default NewCampaignForm