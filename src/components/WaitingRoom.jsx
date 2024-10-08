// src/components/WaitingRoom.jsx
import React from 'react';

function WaitingRoom({ onStartVideoChat }) {
  return (
    <div className="waiting-room">
      <h2>Waiting for Connection...</h2>
      <p>Please wait while we connect you to another user.</p>
      {/* You could add a cancel button here if needed */}
    </div>
  );
}

export default WaitingRoom;
