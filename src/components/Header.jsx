// src/components/Header.jsx
import React from 'react';

function Header({onNext}) {
  return (
    <div className="header">
      <h1 className="header-title">Chatroulette</h1>
      <div className="header-buttons">
        <button className="header-button" onClick={()=>{onNext()}}>Next (F2)</button>
        <button className="header-button">Stop (F3)</button>
        <label>
          <input type="checkbox" />
          Auto reconnect
        </label>
        <label>
          <input type="checkbox" />
          Auto start
        </label>
        <button className="header-button">Premium</button>
        <button className="header-button">Profile</button>
        <button className="header-button">Forum</button>
        <button className="header-button">Contacts</button>
      </div>
    </div>
  );
}

export default Header;
