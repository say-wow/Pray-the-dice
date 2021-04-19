import React from 'react';

export default React.createContext({
  character: {
      name: '',
      uid: undefined,
      idCampaign: undefined,
      idUser: undefined,
      age: '',
      currentHp: undefined,
      maxHp: undefined,
      iAmAwesome: '',
      problemWithSociety: '',
  },
  updateCharacter: newCharacter => {}
});