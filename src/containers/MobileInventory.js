import React, {useContext} from 'react';
import Inventory from '../components/Inventory';
import Breadcrumb from '../components/Breadcrumb';
import CharacterContext from '../context/CharacterContext';

const MobileInventory = (props) => {
  const {character} = useContext(CharacterContext);

  return (
    <div className=''>
      <Breadcrumb sentence={character.name}/>
      <Inventory
        updateInventory={(characterWithNewInventory) => {
          props.updateInventory(characterWithNewInventory)
        }}
      />
    </div>
  );
  
}

export default MobileInventory