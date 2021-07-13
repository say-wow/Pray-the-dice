import React from 'react';
import Inventory from '../components/Inventory';

const MobileInventory = (props) => {

  return (
    <div className=''>
      <Inventory
        updateInventory={(characterWithNewInventory) => {
          props.updateInventory(characterWithNewInventory)
        }}
      />
    </div>
  );
  
}

export default MobileInventory