import React, {useEffect, useState, useRef, useContext} from 'react';
import i18next from 'i18next';
import dataCharacter from '../assets/dataCharacter.json';
import CampaignContext from '../context/CampaignContext';
import '../styles/characters.css';

const NewCharacterForm = (props) => {
  const {campaign} = useContext(CampaignContext)
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

  const calculStat = (stat1, stat2, generationClassic) => {
    if(generationClassic) {
      return Math.floor((stat1+stat2)/2)*5 
    }
    return (stat1 + stat2) * 2
  }

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
    const dexInt = calculStat(dexterity,intelligence, campaign.characterGenerationClassic);
    const strDex = calculStat(strength,dexterity, campaign.characterGenerationClassic);
    const intCha = calculStat(intelligence,charisma, campaign.characterGenerationClassic);
    const dexEnd = calculStat(dexterity,endurance, campaign.characterGenerationClassic);
    const strCha = calculStat(strength,charisma, campaign.characterGenerationClassic);
    const endInt = calculStat(endurance,intelligence, campaign.characterGenerationClassic);

    skills[skills.findIndex((skill) => skill.label === 'psychology')].value = endInt
    skills[skills.findIndex((skill) => skill.label === 'survive')].value = endInt
    skills[skills.findIndex((skill) => skill.label === 'intimidate')].value = strCha
    skills[skills.findIndex((skill) => skill.label === 'run')].value = dexEnd
    skills[skills.findIndex((skill) => skill.label === 'stealth')].value = dexEnd
    skills[skills.findIndex((skill) => skill.label === 'pilot')].value = dexEnd
    skills[skills.findIndex((skill) => skill.label === 'secret')].value = intCha
    skills[skills.findIndex((skill) => skill.label === 'law')].value = intCha
    skills[skills.findIndex((skill) => skill.label === 'read')].value = intCha
    skills[skills.findIndex((skill) => skill.label === 'lie')].value = intCha
    skills[skills.findIndex((skill) => skill.label === 'perception')].value = intCha
    skills[skills.findIndex((skill) => skill.label === 'heal')].value = intCha
    skills[skills.findIndex((skill) => skill.label === 'steal')].value = intCha
    skills[skills.findIndex((skill) => skill.label === 'cac')].value = strDex
    skills[skills.findIndex((skill) => skill.label === 'lock')].value = strDex
    skills[skills.findIndex((skill) => skill.label === 'craft')].value = dexInt
    skills[skills.findIndex((skill) => skill.label === 'dist')].value = dexInt
    skills[skills.findIndex((skill) => skill.label === 'nature')].value = dexInt
    skills[skills.findIndex((skill) => skill.label === 'reflexes')].value = dexInt
    skills[skills.findIndex((skill) => skill.label === 'dodge')].value = dexInt

    setListSkills(skills);
  }, [listCharac, campaign]);

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
    <div>
      <h3>{i18next.t('new character')}</h3>
      <form
        className='formNewCharacter'
        onSubmit={(e) => {
          let valid = true;
          if(additionalSkillPoint >= 0) {
            let skillsCalculated = [...listSkills];
            for(let i=0; i < skillsCalculated.length; i+=1) {
              if(skillsCalculated[i].value > 90) {
                valid = false;
              }
            }
            if(valid) {
              for(let i=0; i < skillsCalculated.length; i+=1) {
                if(listBonusSkills[i].value) {
                  skillsCalculated[i].value += listBonusSkills[i].value;
                }
              }
              createCharacter({
                name,
                hp: dataCharacter.characteristics.find((chara) => ( chara.label === 'endurance')).value <= 15 ? dataCharacter.characteristics.find((chara) => ( chara.label === 'endurance')).value : 15,
                description,
                alive: true,
                characteristics: listCharac,
                skills: skillsCalculated
              });
              setName('');
              setDescription('');
              setListCharac([...dataCharacter.characteristics]);
              setCharacComplete(false);
              setListSkills([...dataCharacter.skills]);
              setAdditionalSkillPoint(50);
              setListBonusSkills([...dataCharacter.skillsBonus]);
              setHp(null);
            } else {
              alert('ERROR')
            }
          }
          e.preventDefault();
        }}
      >
        <div className='defaultInformation'>
          <p>
            <label className='column'>
              {i18next.t('name')} :
              <input
                name="name"
                type="text"
                className='nameNewCharacter'
                value={name}
                onChange={(e) => {setName(e.target.value)}}
              />
            </label>
          </p>
          <p>
            <label className='column'>
              {i18next.t('description')} :
              <textarea
                className='textAreaDescription'
                name="description"
                value={description}
                onChange={(e) => {setDescription(e.target.value)}}
              />
            </label>
          </p>
        </div>
          <div className='characteristics'>
            <p>
              <b>{i18next.t('characteristic')}</b>
            </p>
            {listCharac.map((chara) => (
              <div>
                <label>
                  {i18next.t(`characteristics.${chara.label}`)}
                  <input
                    name={chara.label}
                    type="number"
                    className='inputCharacteristics'
                    max={18}
                    min={3}
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
              {i18next.t('auto generation')}
            </button>
          </div>
        {characComplete && (
          <div className='skillsContainer'>
            <div ref={skillsRef} className='skills'>
              <p>
                <b>{i18next.t('skill')} {!campaign.characterGenerationClassic ? `(${additionalSkillPoint})` : null}</b>
              </p>
              {listSkills.map((skill, i) => (
                <div className='skillRow'>
                  <span>
                    {i18next.t(`skills.${skill.label}`)}
                  </span>
                  <div>
                    <span>
                      {`${skill.value}`}
                    </span>
                    {!campaign.characterGenerationClassic && (
                      <span>
                        +
                      </span>
                    )}
                    {!campaign.characterGenerationClassic && (
                      <input
                        name={skill.label}
                        max={50}
                        min={0}
                        className='inputSkills'
                        type="number"
                        value={listBonusSkills[i].value}
                        onChange={(e) => {
                          const newValue = e.target.value !== '' ? JSON.parse(e.target.value) : null;
                          const newListBonus = [...listBonusSkills]
                          newListBonus[newListBonus.findIndex((charac) => charac.label === listBonusSkills[i].label)].value = newValue;
                          setListBonusSkills(newListBonus);
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className='createCharacterButton'>
              {(additionalSkillPoint === 0 || campaign.characterGenerationClassic)&& (
                <div>
                  <input type="submit" value={i18next.t('create')} />
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default NewCharacterForm