import i18next from 'i18next';
import React from 'react';
import '../styles/card.css'

const Card = (props) => {
  return (
    <div className='playinCard'>
      <span className={/♥/.test(props.card.value) || /♦/.test(props.card.value) ? 'red' : 'black'}>
        {props.card.value}
      </span>
    </div>
  )
}

const MagicCardResume = (props) => {
  return (
    <div>
      {props.cardsList.filter(card => card.enable === true).length > 0 && (
        <div>
          <h2>{i18next.t('cards available')}</h2>
          <div className='containerCardResume'>
            {props.cardsList.filter(card => card.enable === true).map(card => (
              <Card card={card}/>
            ))}
          </div>
        </div>
      )}
      {props.cardsList.filter(card => card.enable === false).length > 0 && (
        <div>
          <h2>{i18next.t('cards used')}</h2>
          <div className='containerCardResume'>
            {props.cardsList.filter(card => card.enable === false).map(card => (
              <Card card={card}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );  
}

export default MagicCardResume
