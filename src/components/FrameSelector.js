import React from 'react';
import frameList from "../assets/frameList.json"
const FrameSelector = (props) => {
  return (
    <div>
      {frameList.map((frame) => (
        <img alt='' onClick={() => {props.select(frame.value)}} className={`${props.selected === frame.value ? "selectedFrame" : ''} frameDemo`} src={frame.value} />
      ))}
    </div>
  );
  
}

export default FrameSelector;