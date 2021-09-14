import React from 'react';
import Picture from './Picture';

const Company = (props) => {
  return (
    <div className='containerCompany'>
      {props.company.map((compagnyMember,i) => (
        <div
          key={i}
          className='memberCompany'
        >
          <Picture character={compagnyMember}/>
          <b>{compagnyMember.name}</b>
        </div>
      ))}
    </div>
  );
  
}

export default Company