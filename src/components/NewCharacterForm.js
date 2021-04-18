import React, {useEffect, useState} from 'react';
import i18next from 'i18next';
import dataCharacter from '../assets/dataCharacter.json'

const NewCharacterForm = (props) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [listCharac, setListCharac] = useState(dataCharacter.characteristics);
  const [characComplete, setCharacComplete] = useState(false);
  const [listSkills, setListSkills] = useState([...dataCharacter.skills]);
  const [additionalSkillPoint, setAdditionalSkillPoint] = useState(50);
  const [listBonusSkills, setListBonusSkills] = useState([...dataCharacter.skillsBonus]);
  const [iAmAwesome, setIAmAwesome] = useState('');
  const [problemWithSociety, setProblemWithSociety] = useState('');
  const [hp, setHp] = useState([]);
  const {createCharacter} = props;

  useEffect( () => {
    const skills = [...listSkills];
    const dexterity = listCharac.find((chara) => ( chara.label === 'dexterity')).value
    const intelligence = listCharac.find((chara) => ( chara.label === 'intelligence')).value
    const strength = listCharac.find((chara) => ( chara.label === 'strength')).value
    const charisma = listCharac.find((chara) => ( chara.label === 'charisma')).value
    const endurance = listCharac.find((chara) => ( chara.label === 'endurance')).value

    if(dexterity && intelligence && strength && charisma && endurance) {
      setCharacComplete(true);
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

  return (
    <form onSubmit={(e) => {
      if(additionalSkillPoint >= 0) {
        let skillsCalculated = [...listSkills];
        for(let i=0; i < skillsCalculated.length; i+=1) {
          if(listBonusSkills[i].value) {
            skillsCalculated[i].value += listBonusSkills[i].value;
          }
        }
        createCharacter({
          name,
          age,
          hp,
          iAmAwesome,
          problemWithSociety,
          alive: true,
          characteristics: listCharac,
          skills: skillsCalculated
        });
      }
      e.preventDefault();
    }}>
      <div>
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
            {i18next.t('age')} :
            <input
              name="age"
              type="text"
              value={age}
              onChange={(e) => {setAge(e.target.value)}}
            />
          </label>
        </p>
        <p>
          <label>
            {i18next.t('awesome')} :
            <input
              name="awesome"
              type="text"
              value={iAmAwesome}
              onChange={(e) => {setIAmAwesome(e.target.value)}}
            />
          </label>
        </p>
        <p>
          <label>
            {i18next.t('problem')} :
            <input
              name="problemWithSociety"
              type="text"
              value={problemWithSociety}
              onChange={(e) => {setProblemWithSociety(e.target.value)}}
            />
          </label>
        </p>
      <p>
        <b>characteristic</b>
      </p>
      </div>
        {listCharac.map((chara) => (
          <p>
            <label>
              {i18next.t(`characteristics.${chara.label}`)}
              <input
                name={chara.label}
                type="number"
                max={18}
                value={chara.value}
                onChange={(e) => {
                  const newList = [...listCharac]
                  newList[newList.findIndex((charac) => charac.label === chara.label)].value = JSON.parse(e.target.value);
                  setListCharac(newList);
                }}
              />
            </label>
          </p>
        ))}
      {characComplete && (
        <div>
          <div>
            <div style={{display: "inline-block"}}>
              <p>
                <b>Skills</b> 
              </p>
              {listSkills.map((skill) => (
                <p>
                  <label>
                  {i18next.t(`skills.${skill.label}`)}
                  <input
                    name={skill.label}
                    type="number"
                    min={skill.value}
                    max={99}
                    value={skill.value}
                    disabled
                  />
                </label>
                </p>
              ))}
            </div>
            <div style={{display: "inline-block"}}>
              <p>
                <b>{additionalSkillPoint}</b> 
              </p>
              {listBonusSkills.map((skillBonus) => (
                <p>
                  <input
                    name={skillBonus.label}
                    type="number"
                    value={skillBonus.value}
                    onChange={(e) => {
                      const newListBonus = [...listBonusSkills]
                      newListBonus[newListBonus.findIndex((charac) => charac.label === skillBonus.label)].value = JSON.parse(e.target.value);
                      setListBonusSkills(newListBonus);
                    }}
                  />
                </p>
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
        </div>
      )}
    </form>
  );
}

export default NewCharacterForm