import React from 'react';

const Picture = (props) => {
  return (
    <div
      className='characterPicture'
      style={{
        backgroundImage: `url(${props.character.picture || 'https://firebasestorage.googleapis.com/v0/b/beyond-dev-4a10b.appspot.com/o/charactersPictures%2FnoPicture.png?alt=media&token=63a24d98-aaa2-4480-b01d-761e58ad721e'})`,
      }}
    >
      {((props.frame && props.frame !== 'none') || props.character.framePicture) && (
        <img className='framePicture' src={props.frame || props.character.framePicture} alt='' />
      )}
    </div>
  );
  
}

export default Picture