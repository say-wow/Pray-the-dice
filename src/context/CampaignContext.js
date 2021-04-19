import React from 'react';

export default React.createContext({
  campaign: {
    uid: null,
    idUserDm: null,
    name: null,
    invitationCode: null,
  },
  updateCampaign: newCampaign => {}
});