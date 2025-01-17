/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import i18next from 'i18next';
import '../styles/EditCharacter.css';
import CharacterContext from '../context/CharacterContext';
import UserContext from '../context/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from '../components/Breadcrumb';
import Picture from '../components/Picture';
import FrameSelector from '../components/FrameSelector';
// init();
// const db = firebase.firestore();

const EditCharacter = (props) => {
  const {character} = useContext(CharacterContext);
  const {user} = useContext(UserContext);
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

  const handleUpload = async () => {
    if(image.size < 1048576){
      const uploadTask = firebase.storage().ref(`charactersPictures/${character.uid}.png`).put(image);
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
              duplicateCharacter.framePicture = frame === '' ? null : frame;
              if(duplicateCharacter.maxHp !== '' && duplicateCharacter.currentHp !== '') {
                props.updateDataCharacter(duplicateCharacter);
                toast.success(i18next.t('update succed'), {});              
              }
            }
            e.preventDefault();
          }}
        >
          <h3>{i18next.t('avatar')} :</h3>
          <div className='containerPicture'>
            <Picture character={character} frame={frame}/>
            <label>
              <input type="file" name="file" id="file" className="inputfile" onChange={handleChange} />
              <label htmlFor="file">{image ? image.name : i18next.t('choose a file')}</label>
          </label>
          </div>
          <FrameSelector
            user={user}
            selected={frame}
            select={(frame) => {
              setFrame(frame);
            }}
          />
          <h3>{i18next.t('general')} :</h3>
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
          <h3>{i18next.t('skill')} :</h3>
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
                setDuplicateCharacter({...duplicateCharacter});
                e.preventDefault()
              }}
            >
              {i18next.t('create skill')}
            </button>
          </div>
          <input type="submit" value={i18next.t('save')} />
        </form>
        <h3>{i18next.t('management')} :</h3>
        <button
          className='danger'
          onClick={(e) => {
            if(window.confirm(i18next.t('archive.character-validation'))) {
              duplicateCharacter.active = false;
              props.updateDataCharacter(duplicateCharacter);
              toast.success(i18next.t('archive.succed'), {});
            }
            e.preventDefault()
          }}
        >
          {i18next.t('archive.character')}
        </button>
      </div>
    </div>
  );
  
}

export default EditCharacter