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
  const [error, setError] = useState(null)
  const handleSubmit = async (e) => {
    setIsLoader(true);
    e.preventDefault();

    try {
      const response = await fetch('http://3.109.55.138:5011/analyze-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoLink }),
      });

      if (!response.ok) {
        throw new Error('Error in API');
      }

      const result = await response.json();
      setYouTubeData(result);
    } catch (err) {
      setError('There is Probably some issue! You sure you pasted the correct link?');
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsLoader(false);
    }
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
      {error ? <div className='error-div'>{error}</div>: <></>}
    </div>
  );
};

export default Home;
