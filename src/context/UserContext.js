import React from 'react';

export default React.createContext({
  user: {
    uid: null,
    displayName: null
  },
  updateUser: newUser => {}
});