import React from 'react';

export default React.createContext({
  character: {
      name: '',
      uid: undefined,
      idCampaign: undefined,
      idUser: undefined,
      currentHp: undefined,
      maxHp: undefined,
      description: '',
      inventory:[],
  },
  updateCharacter: newCharacter => {}
});