import React, {useEffect, useState, useRef} from 'react';
import i18next from 'i18next';
import dataCharacter from '../assets/dataCharacter.json'
import '../styles/characters.css';

const NewCharacterForm = (props) => {
  const [name, setName] = useState('');
  const [listCharac, setListCharac] = useState(dataCharacter.characteristics);
  const [characComplete, setCharacComplete] = useState(false);
  const [listSkills, setListSkills] = useState([...dataCharacter.skills]);
  const [additionalSkillPoint, setAdditionalSkillPoint] = useState(50);
  const [listBonusSkills, setListBonusSkills] = useState([...dataCharacter.skillsBonus]);
  const [description, setDescription] = useState('');
  const [hp, setHp] = useState(null);
  const {createCharacter} = props;
  const skillsRef = useRef(null)

  useEffect( () => {
    const skills = [...listSkills];
    const dexterity = listCharac.find((chara) => ( chara.label === 'dexterity')).value
    const intelligence = listCharac.find((chara) => ( chara.label === 'intelligence')).value
    const strength = listCharac.find((chara) => ( chara.label === 'strength')).value
    const charisma = listCharac.find((chara) => ( chara.label === 'charisma')).value
    const endurance = listCharac.find((chara) => ( chara.label === 'endurance')).value

    if(dexterity && intelligence && strength && charisma && endurance) {
      setCharacComplete(true);
      // setTimeout(() => {
      //   skillsRef.current.scrollIntoView();  
      // }, 100);      
    }
    if(dexterity && intelligence) {
      const dexInt = (dexterity + intelligence) * 2
      skills[skills.findIndex((skill) => skill.label === 'craft')].value = dexInt
      skills[skills.findIndex((skill) => skill.label === 'dist')].value = dexInt
      skills[skills.findIndex((skill) => skill.label === 'nature')].value = dexInt
      skills[skills.findIndex((skill) => skill.label === 'reflexes')].value = dexInt
      skills[skills.findIndex((skill) => skill.label === 'dodge')].value = dexInt
    }
    if(strength && dexterity) {
      const strDex = (strength + dexterity) * 2
      skills[skills.findIndex((skill) => skill.label === 'cac')].value = strDex
      skills[skills.findIndex((skill) => skill.label === 'lock')].value = strDex
    }
    if(intelligence && charisma) {
      const intCha = (intelligence + charisma) * 2;
      skills[skills.findIndex((skill) => skill.label === 'secret')].value = intCha
      skills[skills.findIndex((skill) => skill.label === 'law')].value = intCha
      skills[skills.findIndex((skill) => skill.label === 'read')].value = intCha
      skills[skills.findIndex((skill) => skill.label === 'lie')].value = intCha
      skills[skills.findIndex((skill) => skill.label === 'perception')].value = intCha
      skills[skills.findIndex((skill) => skill.label === 'heal')].value = intCha
      skills[skills.findIndex((skill) => skill.label === 'steal')].value = intCha
    }
    if(dexterity && endurance) {
      const dexEnd = (dexterity + endurance) * 2;
      skills[skills.findIndex((skill) => skill.label === 'run')].value = dexEnd
      skills[skills.findIndex((skill) => skill.label === 'stealth')].value = dexEnd
      skills[skills.findIndex((skill) => skill.label === 'pilot')].value = dexEnd
    }
    if(strength && charisma) {
      const strCha = (strength + charisma) * 2;
      skills[skills.findIndex((skill) => skill.label === 'intimidate')].value = strCha
    }
    if(endurance && intelligence) {
      const endInt = (endurance + intelligence) * 2;
      skills[skills.findIndex((skill) => skill.label === 'psychology')].value = endInt
      skills[skills.findIndex((skill) => skill.label === 'survive')].value = endInt
    }
    setListSkills(skills);
  }, [listCharac]);

  useEffect(() => {
    let bonusUsed = 0;
    for(let i=0; i < listBonusSkills.length; i+=1) {
      bonusUsed += listBonusSkills[i].value;
    };
    setAdditionalSkillPoint(50 - bonusUsed);
  }, [listBonusSkills]);

  const diceRollForNewStat = () => {
    let result = 0;
    for(let i = 0; i < 3; i+=1) {
      result += JSON.parse(Math.floor(Math.random() * 6) + 1);
    }
    return result;
  }

  return (
    <form
      className='formNewCharacter'
      onSubmit={(e) => {
        if(additionalSkillPoint >= 0) {
          let skillsCalculated = [...listSkills];
          for(let i=0; i < skillsCalculated.length; i+=1) {
            if(listBonusSkills[i].value) {
              skillsCalculated[i].value += listBonusSkills[i].value;
            }
          }
          createCharacter({
            name,
            hp,
            description,
            alive: true,
            characteristics: listCharac,
            skills: skillsCalculated
          });
          setName('')
          setListCharac([...dataCharacter.characteristics]);
          setCharacComplete(false);
          setListSkills([...dataCharacter.skills]);
          setAdditionalSkillPoint(50);
          setListBonusSkills([...dataCharacter.skillsBonus]);
          setHp(null);
        }
        e.preventDefault();
      }}
    >
      <div className='defaultInformation'>
          <h3>New character</h3>
        <p>
          <label>
            {i18next.t('name')} :
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => {setName(e.target.value)}}
            />
          </label>
        </p>
        <p>
          <label>
            {i18next.t('hp')} :
            <input
              name="hp"
              type="number"
              value={hp}
              onChange={(e) => {setHp(JSON.parse(e.target.value))}}
            />
          </label>
        </p>
        <p>
          <label>
            {i18next.t('description')} :
            <textarea
              name="description"
              value={description}
              onChange={(e) => {setDescription(e.target.value)}}
            />
          </label>
        </p>
      </div>
        <div className='characteristics'>
          <p>
            <b>characteristic</b>
          </p>
          {listCharac.map((chara) => (
            <div>
              <label>
                {i18next.t(`characteristics.${chara.label}`)}
                <input
                  name={chara.label}
                  type="number"
                  max={18}
                  value={chara.value}
                  onChange={(e) => {
                    const newValue = e.target.value !== '' ? JSON.parse(e.target.value) : null;
                    const newList = [...listCharac]
                    newList[newList.findIndex((charac) => charac.label === chara.label)].value = newValue
                    setListCharac(newList);
                  }}
                />
              </label>
            </div>
          ))}
          <button
            className='autoGeneration'
            onClick={(e) => {
              listCharac.map((chara) => {
                e.preventDefault();
                const newList = [...listCharac]
                newList[newList.findIndex((charac) => charac.label === chara.label)].value = diceRollForNewStat();
                setListCharac(newList);
              });
            }}
          >
            Generate auto
          </button>
        </div>
      {characComplete && (
        <div className='skillsContainer'>
          <div ref={skillsRef} className='skills'>
            <p>
              <b>Skills ({additionalSkillPoint})</b>
            </p>
            {console.log(listBonusSkills)}
            {listSkills.map((skill, i) => (
              <div className='skillRow'>
                <span>
                  {i18next.t(`skills.${skill.label}`)}
                </span>
                <div>
                  <span>
                    {skill.value}
                  </span>
                  <input
                    name={skill.label}
                    type="number"
                    value={listBonusSkills[i].value}
                    onChange={(e) => {
                      const newValue = e.target.value !== '' ? JSON.parse(e.target.value) : null;
                      const newListBonus = [...listBonusSkills]
                      newListBonus[newListBonus.findIndex((charac) => charac.label === listBonusSkills[i].label)].value = newValue;
                      setListBonusSkills(newListBonus);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div>
            {additionalSkillPoint === 0 && (
              <div>
                <input type="submit" value="Envoyer" />
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

export default NewCharacterForm