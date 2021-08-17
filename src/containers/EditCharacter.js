import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import i18next from 'i18next';
import '../styles/EditCharacter.css';
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// init();
// const db = firebase.firestore();

const EditCharacter = (props) => {
  const {character, updateCharacter} = useContext(CharacterContext);
  const {campaign} = useContext(CampaignContext);
  const [duplicateCharacter, setDuplicateCharacter] = useState({...character});

  useEffect( () => {
    setDuplicateCharacter({...character})
  }, [character]);

  return (
    <div className='editContainer'>
      {/* <Link className='link' onClick={() => {history.goBack()}}>
        {i18next.t('back to character')}
      </Link> */}
      <h2>{`${i18next.t('update')} ${i18next.t('of')} ${character.name}`}</h2>
      <div className='editBlock'>
        <form
          className={'formUpdateCharacter columnForm'}
          onSubmit={(e) => {
            if(duplicateCharacter.maxHp.length > 0 && duplicateCharacter.currentHp.length > 0) {              
              props.updateDataCharacter(duplicateCharacter);
              console.log('submit');
            }
            e.preventDefault();
          }}
        >
          <h3>{i18next.t('character')}</h3>
          <label>
            <span>{i18next.t('hp')} :</span>
            <input
              name="hp"
              type="number"
              min={0}
              max={90}
              className=''
              value={duplicateCharacter.currentHp}
              onChange={(e) => {
                duplicateCharacter.currentHp = e.target.value ? parseInt(e.target.value) : "";
                setDuplicateCharacter({...duplicateCharacter});
              }}
            />
          </label>
          <label>
            {i18next.t('hp max')} :
            <input
              name="maxHp"
              type="number"
              min={0}
              max={90}
              className=''
              value={duplicateCharacter.maxHp}
              onChange={(e) => {
                duplicateCharacter.maxHp = e.target.value ? parseInt(e.target.value) : "";
                setDuplicateCharacter({...duplicateCharacter});
              }}
            />
          </label>
          <label>
            <span>{i18next.t('description')} :</span>
            <textarea
              className='textAreaDescription'
              name="description"
              value={duplicateCharacter.description}
              onChange={(e) => {
                duplicateCharacter.description = e.target.value;
                setDuplicateCharacter({...duplicateCharacter});
              }}
            />
          </label>
          <h3>{i18next.t('skill')}</h3>
          <div className='containerEditSkill'>
            {
              duplicateCharacter.skills.map((skill, i) => (
                <label key={i}>
                  {skill.isCustom ? 
                    <input
                      name="skill name"
                      type="text"
                      className='editNameSkill'
                      placeholder={i18next.t('name of skill')}
                      value={skill.label}
                      onChange={(e) => {
                        duplicateCharacter.skills[i].label = e.target.value;
                        setDuplicateCharacter({...duplicateCharacter});
                      }}
                    />
                    : <span className='labelSkillUneditable'>{i18next.t(`skills.${skill.label}`)}</span>}
                  <input
                    name="maxHp"
                    type="number"
                    min={0}
                    max={90}
                    className='editValueSkill'
                    placeholder={i18next.t('value of skill')}
                    value={skill.value}
                    onChange={(e) => {
                      duplicateCharacter.skills[i].value = parseInt(e.target.value);
                      setDuplicateCharacter({...duplicateCharacter});
                    }}
                  />
                </label>
              ))
            }
            <button
              className="empty"
              onClick={(e) => {
                duplicateCharacter.skills.push({
                  isCustom: true,
                  label: '',
                  value: '',
                })
                console.log(duplicateCharacter.skills);
                setDuplicateCharacter({...duplicateCharacter});
                e.preventDefault()
              }}
            >
              {i18next.t('ADD')}
            </button>
          </div>
          <input type="submit" value={i18next.t('update')} />
        </form>
      </div>
    </div>
  );
  
}

export default EditCharacter