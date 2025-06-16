import React, { useState } from 'react';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

  let mediaRecorder;

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => {
          setAudioChunks(prev => [...prev, e.data]);
        };
        mediaRecorder.start();
        setRecording(true);
      })
      .catch(err => console.error('Error accessing microphone:', err));
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const playRecording = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioChunks.length > 0 && (
        <button onClick={playRecording}>Play Recording</button>
      )}
    </div>
  );
};

export default VoiceRecorder;