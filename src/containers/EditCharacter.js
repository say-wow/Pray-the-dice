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
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  useHistory
} from "react-router-dom";
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';

init();
const db = firebase.firestore();

const EditCharacter = (props) => {
  let match = useRouteMatch();
  const history = useHistory();

  const {character, updateCharacter} = useContext(CharacterContext);
  const {campaign} = useContext(CampaignContext);
  const [nameNewSkill, setNameNewSkill] = useState('');
  const [valueNewSkill, setValueNewSkill] = useState('');
  const [skillToUpdate, setSkillToUpdate] = useState({});

  useEffect( () => {
    if(!skillToUpdate.uid) {
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
      await db.collection('skills').doc(uidSkill).set(dataSkill).then(res => {
        console.log('OK');
        updateCharacter({
          ...character,
          skills: [...listSkills],
        })
      }).catch(e => {
        console.log(e)
      });
  }

  const updateSkill = async () => {
      const listSkills = character.skills;
      await db.collection('skills').doc(skillToUpdate.uid).set(skillToUpdate).then(res => {
        console.log('OK');
        listSkills.find((skill) => (
          skill.uid === skillToUpdate.uid
        )).value = skillToUpdate.value;
        updateCharacter({
          ...character,
          skills: [...listSkills],
        })
      }).catch(e => {
        console.log(e)
      });
  }
  return (
    <div className='editContainer'>
      <Link className='link' onClick={() => {history.goBack()}}>
        {'<- Back to character'}
      </Link>
      <form
        className='formUpdateCharacter'
        onSubmit={(e) => {
          updateSkill();
          console.log(skillToUpdate);
          e.preventDefault();
        }}
      >
        <select
          onChange={(e) => {
            setSkillToUpdate(JSON.parse(e.target.value))
          }}
        >
          {character.skills.map(skill => (
              <option
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

        <input type="submit" value="Update" />
      </form>
      <form
        className='formCreateSkill'
        onSubmit={(e) => {
          createSkill()
          e.preventDefault();
        }}
      >
        <label>
            New skill:
          <input
            name="nameNewSkill"
            type="text"
            className=''
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
        <input type="submit" value="Creer" />
      </form>
    </div>
  );
  
}

export default EditCharacter