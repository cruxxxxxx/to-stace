// src/App.js
import React, { useState, useCallback } from 'react';
import Player from './Player';
import { StyleSheet, View } from 'react-native';
import data from './data.json'; // Import JSON data
import './App.css';
import Typewriter from 'typewriter-effect';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackDetail, setTrackDetail] = useState({
    tracktitle: 'Sample Track',
    trackArtist: 'Sample Artist',
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [delay, setDelay] = useState('natural');

  
  // Update the current message based on the current time
  const handleTimeUpdate = useCallback((currentTime) => {
    if (!data.data || currentTime == 0) return;
    console.log(currentTime);

    const sortedData = data.data.sort((a, b) => a.timestamp - b.timestamp);
    const message = sortedData.find(item => item.timestamp >= currentTime)?.msg || '';
    const delay = sortedData.find(item => item.timestamp >= currentTime)?.delay || 50;
    setCurrentMessage(message);
    setDelay(delay);
  }, []);

  return (
    <div className="App">
      <div className="message-display">
          <Typewriter
            key={currentMessage} // Force re-render when currentMessage changes
            options={{
              strings: [currentMessage],
              autoStart: true,
              cursor: "",
              delay: delay,
              pauseFor: 100000,
              loop: false,
            }}/>
            </div>


        <div className="player">
          <Player
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            trackDetail={trackDetail}
            onTimeUpdate={handleTimeUpdate} // Pass the callback to Player
          />

      </div>
    </div>
  );
}

export default App;
