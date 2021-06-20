import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import i18next from 'i18next';
import { uid } from 'uid';
import {init} from '../utils/initFirebase';
import '../styles/EditCharacter.css';
import {
  useRouteMatch,
  useHistory
} from "react-router-dom";
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

init();
const db = firebase.firestore();

const EditCharacter = () => {

  const {character, updateCharacter} = useContext(CharacterContext);
  const {campaign} = useContext(CampaignContext);
  const [nameNewSkill, setNameNewSkill] = useState('');
  const [valueNewSkill, setValueNewSkill] = useState('');
  const [skillToUpdate, setSkillToUpdate] = useState({});
  const [maxHp, setMaxHp] = useState(character.maxHp);
  const [hp, setHp] = useState(character.currentHp);
  const [description, setDescription] = useState(character.description);


  useEffect( () => {
    if(character && skillToUpdate && !skillToUpdate.uid) {
      setSkillToUpdate(character.skills[0]);
    }
  }, [character]);


  const createSkill = async () => {
    const uidSkill = uid();
      const dataSkill = {
        uid: uidSkill,
        name: nameNewSkill,
        value: valueNewSkill,
        characterId: character.uid,
        isCustom: true,
      }
      const listSkills = [...character.skills];
      listSkills.push(dataSkill);
      console.log('createSkill');
      await db.collection('skills').doc(uidSkill).set(dataSkill).then(() => {
        updateCharacter({
          ...character,
          skills: [...listSkills],
        })
        toast.success(i18next.t('new skill created with success'), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }).catch(e => {
        console.log(e)
      });
  }

  const updateCharacterData = async () => {
    const newDataCharacter = {
      ...character,
      maxHp: maxHp,
      currentHp: hp,
      description,
    }
    updateCharacter({
      ...character,
      ...newDataCharacter,
    });
    delete newDataCharacter.characteristics
    delete newDataCharacter.skills
    delete newDataCharacter.inventory
    console.log('updateCharacterData');
    await db.collection('characters').doc(newDataCharacter.uid).set(newDataCharacter).then(res => {
      updateCharacter({
        ...character,
        maxHp: maxHp,
        currentHp: hp,
        description
      })
      console.log('log toast')
      toast.success(i18next.t('update succed'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      });
    }).catch(e => {
      toast.error(i18next.t('an error is appeare'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      console.log(e)
    });
  }

  const updateSkill = async () => {
    const listSkills = character.skills;
    console.log('updateSkill');
    await db.collection('skills').doc(skillToUpdate.uid).set(skillToUpdate).then(() => {
      listSkills.find((skill) => (
        skill.uid === skillToUpdate.uid
      )).value = skillToUpdate.value;
      updateCharacter({
        ...character,
        skills: [...listSkills],
      })
      toast.success(i18next.t('update succed'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(e => {
      toast.error(i18next.t('an error is appeare'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      console.log(e)
    });
  }
  return (
    <div className='editContainer'>
      {/* <Link className='link' onClick={() => {history.goBack()}}>
        {i18next.t('back to character')}
      </Link> */}
      <h2>{`${i18next.t('update')} ${i18next.t('of')} ${character.name}`}</h2>
      <div className='editBlock'>
        <h3>{i18next.t('character')}</h3>
        <form
          className={'formUpdateCharacter columnForm'}
          onSubmit={(e) => {
            updateCharacterData();
            e.preventDefault();
          }}
        >
          <label>
            <span>{i18next.t('hp')} :</span>
            <input
              name="hp"
              type="number"
              min={0}
              max={90}
              className=''
              value={hp}
              onChange={(e) => {
                setHp(parseInt(e.target.value))
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
              value={maxHp}
              onChange={(e) => {
                setMaxHp(parseInt(e.target.value))
              }}
            />
          </label>
          <label>
            <span>{i18next.t('description')} :</span>
            <textarea
              className='textAreaDescription'
              name="description"
              value={description}
              onChange={(e) => {setDescription(e.target.value)}}
            />
          </label>
          <input type="submit" value={i18next.t('validate')} />
        </form>
      </div>
      <div className='editBlock'>
        <h3>{i18next.t('skill')}</h3>
        <form
          className='formUpdateCharacter'
          onSubmit={(e) => {
            updateSkill();
            e.preventDefault();
          }}
        >
          <div className='row'>
            <select
              onChange={(e) => {
                setSkillToUpdate(JSON.parse(e.target.value))
              }}
            >
              {character.skills.map(skill => (
                  <option
                    key={skill.uid}
                    value={JSON.stringify(skill)}>
                      {skill.isCustom ?
                        skill.name :
                        i18next.t(`skills.${skill.name}`)}
                  </option>
                )
              )}
            </select>
            <input
              name="valueNewSkill"
              type="number"
              min={0}
              max={90}
              className=''
              value={skillToUpdate ? skillToUpdate.value : ''}
              onChange={(e) => {
                const skillUpdated = {...skillToUpdate};
                skillUpdated.value = e.target.value ? JSON.parse(e.target.value) : '';
                setSkillToUpdate(skillUpdated)
              }}
            />
          </div>
          <input type="submit" value={i18next.t('validate')} />
        </form>
        <form
          className='formUpdateCharacter'
          onSubmit={(e) => {
            createSkill()
            e.preventDefault();
          }}
        >
          <label>
              {`${i18next.t('new skill')} :`}
            <input
              name="nameNewSkill"
              type="text"
              className=''
              placeholder={i18next.t('name')}
              value={nameNewSkill}
              onChange={(e) => {setNameNewSkill(e.target.value)}}
            />
            <input
              name="valueNewSkill"
              type="number"
              min={0}
              max={90}
              className=''
              value={valueNewSkill}
              onChange={(e) => {setValueNewSkill(e.target.value)}}
            />
          </label>
          <input type="submit" value={i18next.t('create')} />
        </form>
      </div>
    </div>
  );
  
}

export default EditCharacter