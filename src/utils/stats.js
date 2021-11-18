
export const getNumberOfCriticalFail = (rolls) => {
  const ArrayFilter = rolls.filter(roll => roll.diceType === 100 && roll.value >= 90);
  return ArrayFilter.length;
}
export const getNumberOfCriticalSuccess = (rolls) => {
  const ArrayFilter = rolls.filter(roll => roll.diceType === 100 && roll.value <= 10);
  return ArrayFilter.length;
}

export const playerMostUnlucky = (rolls, company) => {
  const arrayOfFailForCharacter = [];
  for (let i = 0; i < company.length; i += 1) {
    arrayOfFailForCharacter.push({
      character: company[i].name,
      uidCharacter: company[i].uid,
      fails: rolls.filter(roll => roll.diceType === 100 && roll.value >= 90 && roll.characterId === company[i].uid).length
    })
  }
  arrayOfFailForCharacter.sort(compare);
  if(arrayOfFailForCharacter.length > 0) {
    return {
      character: arrayOfFailForCharacter[0].character,
      numberOfCriticalFail: arrayOfFailForCharacter[0].fails,
    }
  }
}

export const playerMostLucky = (rolls, company) => {
  const arrayOfFailForCharacter = [];
  for (let i = 0; i < company.length; i += 1) {
    arrayOfFailForCharacter.push({
      character: company[i].name,
      uidCharacter: company[i].uid,
      success: rolls.filter(roll => roll.diceType === 100 && roll.value <= 10 && roll.characterId === company[i].uid).length
    })
  }
  arrayOfFailForCharacter.sort(compare);
  if(arrayOfFailForCharacter.length > 0) {
    return {
      character: arrayOfFailForCharacter[0].character,
      numberOfCriticalSuccess: arrayOfFailForCharacter[0].success,
    }
  }
}

const compare = ( a, b ) => {
  if ( a.fails < b.fails ){
    return 1;
  }
  if ( a.fails > b.fails ){
    return -1;
  }
  return 0;
}