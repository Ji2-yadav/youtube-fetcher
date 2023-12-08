import React, { useState } from 'react';
import Result from './ResultPage';
import '../css/callback.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faEye, faPlay, faCheckCircle, faRightLong, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/anchor-logo.png'
import Loader from './Loader';

const CallBack = ({onDisableCallBack, ResetPage}) => {
  const [name, setName] = useState('');
  const [mb, setMb] = useState('');
  const [viewsuccessmsg, setViewsuccessMsg] = useState(false)
  const [isLoader, setIsLoader] = useState(false)

  const handleSubmit = async (e) => {
    setIsLoader(true)
    e.preventDefault();
    const response = await fetch('http://localhost:5000/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, mb }),
    });
    const result = await response.json();
    if(result)
        setViewsuccessMsg(true)
    setIsLoader(false)

  };
  const disableCallback =  () => {
    onDisableCallBack(true)

  };
  
  const gotoHomePage =  () => {
    ResetPage(true)

  };
  return ( 
    <>
    <div className='callback-div' onClick={disableCallback}>
        
    </div>
    {viewsuccessmsg ?
    <div className="cl-form">
        <FontAwesomeIcon className="style-icon-cb" icon={faCheckCircle} />
        <h1>Request a callback</h1>
        <p>Our Team will call you shortly in 12-24 hrs</p>
        <p>Can't you wait for call?</p>
        <button className="cta-home" onClick={gotoHomePage}>Check another video <FontAwesomeIcon className="fa-right" icon={faArrowRight} /></button>
    </div>
    :
    <form className="cl-form" onSubmit={handleSubmit}>
        <h1>Request a callback</h1>
        <label>
        <input
            className='cl-input-box'
            type="text"
            value={name}
            placeholder='Enter Name'
            onChange={(e) => setName(e.target.value)}
        />
        <input
            className='cl-input-box'
            type="text"
            value={mb}
            placeholder='Enter Mobile Number'
            onChange={(e) => setMb(e.target.value)}
        />
        <button className="cl-button" type="submit">Request a callback</button>
        </label>
    
    </form>
    }
    { isLoader?<Loader/> : <></> }
  </>
      
  );
};

export default CallBack;
