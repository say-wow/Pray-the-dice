import React from 'react';
import Picture from './Picture';

const Company = (props) => {
  return (
    <div className='containerCompany'>
      {props.company.map(compagnyMember => (
        <div className='memberCompany'>
          <Picture character={compagnyMember}/>
          <b>{compagnyMember.name}</b>
        </div>
      ))}
    </div>
  );
  
}

export default Company