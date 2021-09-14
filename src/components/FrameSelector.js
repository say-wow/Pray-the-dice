import React from 'react';
import frameList from "../assets/frameList.json"
const FrameSelector = (props) => {
  return (
    <div>
      {frameList.map((frame) => {
        if((props.user.frameUnlock && props.user.frameUnlock.includes(frame.condition)) || frame.condition === null) {
          return (
            <img
              alt=''
              onClick={() => {props.select(props.selected === frame.value ? '' :frame.value)}}
              className={`${props.selected === frame.value ? "selectedFrame" : ''} frameDemo`}
              src={frame.value}
            />
          )
        }
      })}
    </div>
  );
  
}

export default FrameSelector;