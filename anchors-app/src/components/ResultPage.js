import React, { useEffect, useState } from 'react';
import logo from '../images/anchor-logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faEye, faPlay, faThumbsUp, faPhone } from '@fortawesome/free-solid-svg-icons';

import '../css/ResultPage.css'
import CallBack from './CallbackForm';

const Result = ({ytDetails, ResetPage}) => {
  const [topVideos, setTopVideos] = useState(null)
  const [callback, setCallback] = useState(false)
  useEffect(() => {
    if(ytDetails)
    {
      setTopVideos(ytDetails.channel_metrics.top_data)
    }
    
  }, [ytDetails]);

  const handleReset = () => {
    ResetPage(true)
  };

  const EnableCallback = () => {
    setCallback(true)
  };
  
  const handleCallBackDisable = () => {
    setCallback(false)
  };
  return (
    <div className='main-div'>
      <div className='header-div'>
          <img src={logo} alt="logo" onClick={handleReset}/>
          <div className='callback' onClick={EnableCallback}> <FontAwesomeIcon className="sm-icon" icon={faPhone} /> Request a call back</div>
      </div>
      <div className='main-body2'>
        <div className='video-data'>
          <div className='thumbnail-div'>
            <div className='top-batch'>{ytDetails.video_metrics.rank==1? 'Top earner video' : `${ytDetails.video_metrics.rank}th rank`}</div>
            <img className="thumbnail-img-big" src={ytDetails.video_metrics.thumbnail}/>
            <p>Uploaded on - {ytDetails.video_metrics.uploadedDate}</p>
          </div>
          <div className='video-metrics'>
            <p>{ytDetails.video_metrics.title}</p>
            {/* <p>Subscriber Count: {ytDetails.channel_metrics.subscriberCount}</p> */}
            <p><FontAwesomeIcon className="bg-icon" icon={faEye} />{ytDetails.video_metrics.views}</p>
            <p><FontAwesomeIcon className="bg-icon" icon={faThumbsUp} />{ytDetails.video_metrics.likes}</p>
            <p><FontAwesomeIcon className="bg-icon" icon={faComment} />{ytDetails.video_metrics.comments}</p>
          </div>
          <div className='earnings-div'>
            <div className='cta'>
              <p>₹{ytDetails.video_metrics.earnings}</p>
              <div className='check'> Check How?</div>
            </div>
          </div>
        </div>
        
        <div className='table-div'>
        <h2>Other Videos Potentials</h2>
        {topVideos?
        <table className='more-videos'>
        <thead>
          <tr className='table-row'>
            <th>Rank</th>
            <th className='title-cl'>Title</th>
            <th>Thumbnail</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Comments</th>
            <th>Uploaded On</th>
            <th>*Estimated Earning</th>
            
          </tr>
        </thead>
        <tbody>
          {topVideos.map((video, index) => (
            <tr key={index} className='table-row' >
              <td>{video.rank}</td>
              <td>{video.title}</td>
              <td><img className="img" src={video.thumbnail} alt={`Thumbnail for ${video.title}`} /></td>
              <td>{video.views}</td>
              <td>{video.likes}</td>
              <td>{video.comments}</td>
              <td>{video.uploadedDate}</td>
              <td>₹ {video.earnings}</td>
            </tr>
          ))}
        </tbody>
      </table>
        :
          <p>Fetching ...</p>
        }
      </div>
    </div>
    {callback? <CallBack onDisableCallBack={handleCallBackDisable} ResetPage={handleReset}/>: <></>}
    </div>
  );
};

export default Result;
