import dataCharacter from '../assets/dataCharacter.json';

export const getAllStats = (listCharac, generationCharacterClassic) => (
  dataCharacter.skills.map(skill => {
    skill.value = calculStat(listCharac.find((chara) => (chara.label === skill.stat1)).value, listCharac.find((chara) => (chara.label === skill.stat2)).value, generationCharacterClassic);
    return skill;
  })
)

export const calculStat = (stat1, stat2, isClassicalGeneration) => {
    if(isClassicalGeneration) {
      return Math.floor((stat1+stat2)/2)*5 
    }
    return (stat1 + stat2) * 2
  }