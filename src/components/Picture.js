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
        backgroundImage: `url(${props.character.picture || 'https://firebasestorage.googleapis.com/v0/b/beyond-dev-4a10b.appspot.com/o/charactersPictures%2FnoPicture.png?alt=media&token=63a24d98-aaa2-4480-b01d-761e58ad721e'})`,
      }}
    >
      {frameUrl && (
        <img className='framePicture' src={frameUrl} alt='' />
      )}
    </div>
  );
  
}

export default Picture