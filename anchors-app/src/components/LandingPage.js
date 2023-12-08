import React, { useState } from 'react';
import Result from './ResultPage';
import '../css/landingPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faEye, faPlay } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/anchor-logo.png'
import Loader from './Loader';

const Home = () => {
  const [videoLink, setVideoLink] = useState('');
  const [youtubeData, setYouTubeData] = useState(null);
  const [isLoader, setIsLoader] = useState(false)

  const handleSubmit = async (e) => {
    setIsLoader(true)
    e.preventDefault();
    const response = await fetch('http://localhost:5000/analyze-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoLink }),
    });
    const result = await response.json();
    setYouTubeData(result)
    setIsLoader(false)


  };

  const handleReset = () => {
    setVideoLink('')
    setYouTubeData(null)
  };

  return ( 
    youtubeData ? 
    <Result ytDetails={youtubeData} ResetPage={handleReset}/>
    : 
    <div className='main-div'>
      <div className='header-div'>
          <img src={logo} alt="logo"/>
      </div>
      <div className='main-body'>
        <h1>Discover your earning Potential</h1>
        <h2>Turn your Youtube expertise into a lucrative income through resource sharing</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            <input
              className='input-box'
              type="text"
              value={videoLink}
              placeholder='Enter YouTube video link'
              onChange={(e) => setVideoLink(e.target.value)}
            />
          </label>
          <button className="button" type="submit"> <FontAwesomeIcon className="icon" icon={faPlay} /></button>
        </form>
      </div>
      <div className='style-div'>
          <div className='style-element'>
              <FontAwesomeIcon className="style-icon" icon={faPlay} />
          </div>
        </div>
        {
          isLoader?<Loader/> : <></>
        }
      
    </div>
  );
};

export default Home;
