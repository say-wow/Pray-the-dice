import React, {useContext} from 'react';
import {useHistory} from "react-router-dom";
import { ArrowSmLeftIcon, ChevronLeftIcon} from '@heroicons/react/outline'

const Breadcrumb = (props) => {
  const history = useHistory();

  return (
    <div style={{
      display: 'flex',
      alignItems:'center',
      margin: '0.5rem 0px',
      cursor: 'pointer',
    }}>
      <ChevronLeftIcon className='iconBreadcrumb'/>
      <span className='link' onClick={() => {history.goBack()}}>
        {props.sentence}
      </span>
    </div>
  );
  
}

export default Breadcrumb;