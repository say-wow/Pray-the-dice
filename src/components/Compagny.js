import React from 'react';
import Picture from './Picture';

const Compagny = (props) => {
  return (
    <div className='containerCompagny'>
      {props.compagny.map(compagnyMember => (
        <div className='memberCompagny'>
          <Picture character={compagnyMember}/>
          <b>{compagnyMember.name}</b>
        </div>
      ))}
    </div>
  );
  
}

export default Compagny