import {getAllStats,calculStat} from '../utils/characterGeneration';
import dataCharacter from '../assets/dataCharacter.json';

describe('calculStat', () => {
  it('get one stat with classic generation', () => {
    expect(calculStat(10,13,true)).toBe(55);
  });
  it('get one stat with custom generation', () => {
    expect(calculStat(10,13,false)).toBe(46);
  });
});

describe('getAllStats', () => {
  it('Generate all stat for a character with classic build', () => {
    dataCharacter.characteristics[0].value = 10;
    dataCharacter.characteristics[1].value = 12;
    dataCharacter.characteristics[2].value = 8;
    dataCharacter.characteristics[3].value = 14;
    dataCharacter.characteristics[4].value = 16;
    expect(getAllStats(dataCharacter.characteristics, true)).toStrictEqual([
        {
          "label": "craft",
          "value": 65,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "intelligence"
        },
        {
          "label": "cac",
          "value": 55,
          "isCustom": false,
          "stat1": "strength",
          "stat2": "dexterity"
        },
        {
          "label": "dist",
          "value": 65,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "intelligence"
        },
        {
          "label": "nature",
          "value": 65,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "intelligence"
        },
        {
          "label": "secret",
          "value": 75,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "run",
          "value": 50,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "endurance"
        },
        {
          "label": "stealth",
          "value": 70,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "charisma"
        },
        {
          "label": "law",
          "value": 75,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "dodge",
          "value": 65,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "intelligence"
        },
        {
          "label": "intimidate",
          "value": 65,
          "isCustom": false,
          "stat1": "strength",
          "stat2": "charisma"
        },
        {
          "label": "read",
          "value": 75,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "lie",
          "value": 75,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "perception",
          "value": 75,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "pilot",
          "value": 50,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "endurance"
        },
        {
          "label": "psychology",
          "value": 55,
          "isCustom": false,
          "stat1": "endurance",
          "stat2": "intelligence"
        },
        {
          "label": "reflexes",
          "value": 65,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "intelligence"
        },
        {
          "label": "lock",
          "value": 50,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "endurance"
        },
        {
          "label": "heal",
          "value": 75,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "survive",
          "value": 55,
          "isCustom": false,
          "stat1": "endurance",
          "stat2": "intelligence"
        },
        {
          "label": "steal",
          "value": 65,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "dexterity"
        }
      ]);
  });
  it('Generate all stat for a character with custom build', () => {
    dataCharacter.characteristics[0].value = 10;
    dataCharacter.characteristics[1].value = 12;
    dataCharacter.characteristics[2].value = 8;
    dataCharacter.characteristics[3].value = 14;
    dataCharacter.characteristics[4].value = 16;
    expect(getAllStats(dataCharacter.characteristics, false)).toStrictEqual([
        {
          "label": "craft",
          "value": 52,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "intelligence"
        },
        {
          "label": "cac",
          "value": 44,
          "isCustom": false,
          "stat1": "strength",
          "stat2": "dexterity"
        },
        {
          "label": "dist",
          "value": 52,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "intelligence"
        },
        {
          "label": "nature",
          "value": 52,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "intelligence"
        },
        {
          "label": "secret",
          "value": 60,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "run",
          "value": 40,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "endurance"
        },
        {
          "label": "stealth",
          "value": 56,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "charisma"
        },
        {
          "label": "law",
          "value": 60,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "dodge",
          "value": 52,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "intelligence"
        },
        {
          "label": "intimidate",
          "value": 52,
          "isCustom": false,
          "stat1": "strength",
          "stat2": "charisma"
        },
        {
          "label": "read",
          "value": 60,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "lie",
          "value": 60,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "perception",
          "value": 60,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "pilot",
          "value": 40,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "endurance"
        },
        {
          "label": "psychology",
          "value": 44,
          "isCustom": false,
          "stat1": "endurance",
          "stat2": "intelligence"
        },
        {
          "label": "reflexes",
          "value": 52,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "intelligence"
        },
        {
          "label": "lock",
          "value": 40,
          "isCustom": false,
          "stat1": "dexterity",
          "stat2": "endurance"
        },
        {
          "label": "heal",
          "value": 60,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "charisma"
        },
        {
          "label": "survive",
          "value": 44,
          "isCustom": false,
          "stat1": "endurance",
          "stat2": "intelligence"
        },
        {
          "label": "steal",
          "value": 52,
          "isCustom": false,
          "stat1": "intelligence",
          "stat2": "dexterity"
        }
      ]);
  });
});