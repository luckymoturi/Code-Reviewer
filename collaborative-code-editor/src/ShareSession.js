import React, { useState } from 'react';

const ShareSession = () => {
  const [sessionId, setSessionId] = useState('');

  const createSession = () => {
    // Generate a unique session ID
    const id = Math.random().toString(36).substr(2, 9);
    setSessionId(id);
  };

  const joinSession = (id) => {
    setSessionId(id);
    // Logic to join the session
  };

  return (
    <div>
      <button onClick={createSession}>Create Session</button>
      <input
        type="text"
        placeholder="Enter session ID"
        onChange={(e) => joinSession(e.target.value)}
      />
      <p>Session ID: {sessionId}</p>
    </div>
  );
};

export default ShareSession;
