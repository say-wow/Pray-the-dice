import i18next from 'i18next';

/**
 * @param  {Number} max The value max of the dice
 * @param  {String} uidUserDmCampaign Uid of the DM for the current campaign
 * @param  {{}} character Json of the current Character
 * @param  {{}} user Json of the user account
 * @param  {{}} stat Json of the current stat rolled
 * @returns {{}} Json with all data to send at Firestore
 */
export const getRoll = (max, uidUserDmCampaign, character, user ,stat) => {
    const randomValue = Math.floor(Math.random() * max) + 1;
    const isDm = uidUserDmCampaign === user.uid;
    const dataRoll = {
      createdAt: new Date(Date.now()).toLocaleDateString("fr-FR"),
      userName: !isDm ? character.name : "DM",
      characterId: character.uid,
      value: randomValue,
      isDmRoll: isDm,
      diceType: max,
      pictureUserSendRoll: user.photoURL,
      stat: stat
    }
    return dataRoll
    // props.setNewDice(dataRoll);
  }