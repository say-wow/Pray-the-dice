import React from 'react';

const Picture = (props) => {
  let frameUrl = props.character.framePicture;
  if(props.frame) {
    frameUrl = props.frame
  }
  if (props.frame === '') {
    frameUrl = null;
  }
  return (
    <div
      className='characterPicture'
      style={{
        backgroundImage: `url(${props.character.picture || 'https://firebasestorage.googleapis.com/v0/b/beyondthedice-cfc1b.appspot.com/o/charactersPictures%2Fnopicture.png?alt=media&token=4a376f9c-0235-4b6c-889b-f1ffd6d12a48'})`,
      }}
    >
      {frameUrl && (
        <img className='framePicture' src={frameUrl} alt='' />
      )}
    </div>
  );
  
}

export default Picture