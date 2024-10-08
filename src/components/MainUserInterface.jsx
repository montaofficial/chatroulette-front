// src/components/MainUserInterface.jsx
import React from 'react';

function MainUserInterface({ onNextUser, onStartVideoChat }) {
  return (
    <div className="main-user-interface">
      <h2>Main User Interface - Luke</h2>
      <p>Welcome, Luke! You are the main user.</p>
      <button onClick={onNextUser}>Next User</button>
    </div>
  );
}

export default MainUserInterface;
