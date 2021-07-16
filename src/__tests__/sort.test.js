import {dynamicSortWithTraduction} from '../utils/sort';
import dataCharacter from '../assets/dataCharacter.json';

describe('dynamicSortWithTraduction', () => {
  it('Sort array of object for a key', () => {
    expect(dataCharacter.characteristics.sort(dynamicSortWithTraduction('label'))).toStrictEqual([
      { label: 'charisma', value: null },
      { label: 'dexterity', value: null },
      { label: 'endurance', value: null },
      { label: 'intelligence', value: null },
      { label: 'strength', value: null }
    ]);
  });
});