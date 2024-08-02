import React, { useState, useEffect } from 'react';
import { Howler, Howl } from 'howler';
import './App.css';

export default function Player({
  isPlaying,
  setIsPlaying,
  trackDetail,
  onTimeUpdate
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(null);

  // Automatically load the music when the component mounts
  useEffect(() => {
    const music = new Howl({
      src: ['to-stace/mixtape.ogg'], // Update with your actual audio file path
      html5: true,
      onload: () => {
        setSelectedMusic(music);
      },
      onplay: () => {
        setIsPlaying(true);
        requestAnimationFrame(updateCurrentTime);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0); // Reset time when audio ends
      },
    });

    // Clean up: stop music and clear interval on component unmount
    return () => {
      if (selectedMusic) {
        selectedMusic.unload();
      }
    };
  }, []);

  // Update the current time of the audio
  const updateCurrentTime = () => {
    if (selectedMusic) {
      setCurrentTime(selectedMusic.seek());
      if (selectedMusic.playing()) {
        requestAnimationFrame(updateCurrentTime);
      }
    }
  };

  // Play or pause the audio
  function togglePlay() {
    if (!selectedMusic) return;

    if (isPlaying) {
      selectedMusic.pause();
      setIsPlaying(false);
    } else {
      selectedMusic.play();
      setIsPlaying(true);
    }
  }

  // Howler.volume is a global volume controller for all Howl instances
  function handleVolumeChange(e) {
    Howler.volume(parseInt(e.target.value, 10) / 100);
  }

  // Reset the range button when the music is changed
  useEffect(() => {
    if (selectedMusic) {
      setCurrentTime(0);
      selectedMusic.seek(0);
    }
  }, [selectedMusic]);

  // Seek to a specific time
  function handleSeekChange(e) {
    const seekTime = parseInt(e.target.value, 10);
    setCurrentTime(seekTime);
    if (selectedMusic) selectedMusic.seek(seekTime);
  }

  // Update the currentTime every second
  useEffect(() => {
    let timerInterval;
    if (selectedMusic) {
      const updaterTimer = () => {
        const seekTimer = Math.round(selectedMusic.seek());
        setCurrentTime(seekTimer);
      };

      timerInterval = setInterval(updaterTimer, 1000);
    }
    return () => {
      clearInterval(timerInterval);
    };
  }, [selectedMusic]);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(currentTime);
    }
  }, [currentTime]);


  // Format time from seconds
  function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }
  const formattedTime = formatTime(currentTime);

  return (
    <div>
      <div>
        <div id="player">
          <label htmlFor="durationController"></label>
          <input
            className="rounded-sm cursor-pointer"
            type="range"
            min="0"
            max={selectedMusic ? selectedMusic.duration() : 0}
            value={currentTime || 0}
            onChange={handleSeekChange}
          />
          <div>{formattedTime}</div>
          <button onClick={togglePlay} className="playButton">
            <img src={isPlaying ? "pause-30.png" : "play-30.png"} alt={isPlaying ? "Pause" : "Play"} />
          </button>
        </div>
      </div>
    </div>
  );
}
