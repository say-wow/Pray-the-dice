import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import i18next from 'i18next';
import '../styles/EditCharacter.css';
import CharacterContext from '../context/CharacterContext';
import CampaignContext from '../context/CampaignContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from '../components/Breadcrumb';
import Picture from '../components/Picture';
// init();
// const db = firebase.firestore();

const EditCharacter = (props) => {
  const {character, updateCharacter} = useContext(CharacterContext);
  const {campaign} = useContext(CampaignContext);
  const [duplicateCharacter, setDuplicateCharacter] = useState({...character});
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [frame, setFrame] = useState(null);
  // const [progress, setProgress] = useState(0);

  useEffect( () => {
    setDuplicateCharacter({...character})
  }, [character]);

  useEffect( () => {
    duplicateCharacter.picture = url;
    //need to clean this duplicated code
    if(duplicateCharacter.maxHp !== '' && duplicateCharacter.currentHp !== '' && url) {
      props.updateDataCharacter(duplicateCharacter);
      toast.success(i18next.t('update succed'), {});
    }
  }, [url]);

  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleChangeFrame = (e) => {
    if(e.target.value) {
      setFrame(e.target.value);
    }
  }

  const handleUpload = async () => {
    if(image.size < 1048576){
      const uploadTask = firebase.storage().ref(`charactersPictures/${character.uid}.png`).put(image);
      console.log(uploadTask);
      uploadTask.on(
        "state_changed",
        snapshot => {
          // const progress = Math.round(
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // );
          // setProgress(progress);
        },
        error => {
          console.log(error);
        },
        async () => {
          await firebase.storage()
            .ref("charactersPictures")
            .child(`${character.uid}.png`)
            .getDownloadURL()
            .then(url => {
              setUrl(url);
            });
        }
      );
    } else {
      console.log('to big picture');
      //error message to big
    }
  };

  return (
    <div className='editContainer'>
      <Breadcrumb sentence={character.name}/>
      <h2>{`${i18next.t('update')} ${i18next.t('of')} ${character.name}`}</h2>
      <div className='editBlock'>
        <form
          className={'formUpdateCharacter columnForm'}
          onSubmit={ async (e) => {
            if(image) {
              try {
                await handleUpload();
              }
              catch (error) {
                console.log('error',error)
              }
            } else {
              if(frame) {
                duplicateCharacter.framePicture = frame === 'none' ? null : frame;
              }
              if(duplicateCharacter.maxHp !== '' && duplicateCharacter.currentHp !== '') {
                props.updateDataCharacter(duplicateCharacter);
                toast.success(i18next.t('update succed'), {});              
              }
            }
            e.preventDefault();
          }}
        >
          {/* <h3>{i18next.t('character')}</h3> */}
          <div className='containerPicture'>
            <Picture character={character} frame={frame}/>
            <label>
              <input type="file" name="file" id="file" className="inputfile" onChange={handleChange} />
              <label htmlFor="file">{image ? image.name : i18next.t('Choose a file')}</label>
          </label>
          </div>
          {/* Need to be update */}
          <label>
            PICTURE FRAME : 
            <select value={character.framePicture} onChange={handleChangeFrame}>
              <option value={'none'}>Aucune</option>
              <option value="https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2F92.png?alt=media&token=eaf56deb-53d5-4042-b348-3136a6bc062c">92 Aria</option>
              <option value="https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2Falchemy.png?alt=media&token=23dfcd2d-b1b2-4b95-acd4-fc0db08b60bf">Alchimiste</option>
              <option value="https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2Fcoin.png?alt=media&token=54a68609-afed-44dc-bff5-e765690d669e">Or</option>
              <option value="https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2Foublie.png?alt=media&token=390e84b8-c1e7-4167-b1c3-e06645730a06">Oublié</option>
              <option value="https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2Fcard.png?alt=media&token=4eeb7115-28b2-4d44-a49b-d8e29583b0b9">Magie</option>
              <option value="https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2Fcrown.png?alt=media&token=e964154a-ea2d-44fd-9c50-d33f4cf75ca3">Couronne</option>
              <option value="https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2Fdeath.png?alt=media&token=7dce2cee-4030-4bbb-a0b7-8b933101bf63">Mort</option>
              <option value="https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2Felement.png?alt=media&token=f69863b8-6bfe-4ad0-876d-2be9d236bc50">Elementaliste</option>
              <option value="https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2Fgladiator.png?alt=media&token=22a5ae74-9d9a-4e5b-a24f-d28c8a89069e">Gladiateur</option>
              <option value="https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/frame%2Flogo.png?alt=media&token=8c217f45-2899-445d-82aa-ca341a580a67">Logo Beyond</option>
            </select>
          </label>
          <label>
            <span>{i18next.t('hp')} :</span>
            <input
              name="hp"
              type="number"
              min={0}
              max={90}
              placeholder={duplicateCharacter.currentHp}
              value={duplicateCharacter.currentHp}
              onChange={(e) => {
                duplicateCharacter.currentHp = e.target.value ? parseInt(e.target.value) : "";
                setDuplicateCharacter({...duplicateCharacter});
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
              placeholder={duplicateCharacter.maxHp}
              value={duplicateCharacter.maxHp}
              onChange={(e) => {
                duplicateCharacter.maxHp = e.target.value ? parseInt(e.target.value) : "";
                setDuplicateCharacter({...duplicateCharacter});
              }}
            />
          </label>
          <label>
            <textarea
              placeholder={i18next.t('description')}
              className='textAreaDescription'
              name="description"
              value={duplicateCharacter.description}
              onChange={(e) => {
                duplicateCharacter.description = e.target.value;
                setDuplicateCharacter({...duplicateCharacter});
              }}
            />
          </label>
          <h3>{i18next.t('skill')}</h3>
          <div className='containerEditSkill'>
            {
              duplicateCharacter.skills.map((skill, i) => (
                <label key={i}>
                  {skill.isCustom ? 
                    <input
                      name="skill name"
                      type="text"
                      className='editNameSkill'
                      placeholder={i18next.t('name of skill')}
                      value={skill.label}
                      onChange={(e) => {
                        duplicateCharacter.skills[i].label = e.target.value;
                        setDuplicateCharacter({...duplicateCharacter});
                      }}
                    />
                    : <span className='labelSkillUneditable'>{i18next.t(`skills.${skill.label}`)}</span>}
                  <input
                    name="maxHp"
                    type="number"
                    min={0}
                    max={100}
                    className='editValueSkill'
                    placeholder={i18next.t('value of skill')}
                    value={skill.value}
                    onChange={(e) => {
                      duplicateCharacter.skills[i].value = parseInt(e.target.value);
                      setDuplicateCharacter({...duplicateCharacter});
                      console.log(duplicateCharacter);
                    }}
                  />
                </label>
              ))
            }
            <button
              className='outline'
              onClick={(e) => {
                duplicateCharacter.skills.push({
                  isCustom: true,
                  label: '',
                  value: '',
                })
                console.log(duplicateCharacter.skills);
                setDuplicateCharacter({...duplicateCharacter});
                e.preventDefault()
              }}
            >
              {i18next.t('create skill')}
            </button>
          </div>
          <input type="submit" value={i18next.t('update')} />
        </form>
      </div>
    </div>
  );
  
}

export default EditCharacter