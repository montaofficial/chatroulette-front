// src/components/RegistrationForm.jsx
import React from 'react';

function RegistrationForm({ onRegister, devices, selectedDeviceIds, onDeviceChange, error }) {
  const handleRegister = (e) => {
    e.preventDefault();

    const userData = {
      age: Number(e.target.age.value),
      gender: e.target.gender.value,
      country: e.target.country.value,
      bio: e.target.bio.value,
      nickname: e.target.nickname.value.toLowerCase().trim(), // Ensure nickname is always lowercase
    };

    console.log('Attempting to register user:', userData);
    onRegister(userData);
  };

  return (
    <div className="registration-form">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <label>
          Age:
          <input type="number" name="age" min="0" max="99" />
        </label>
        <label>
          Gender:
          <select name="gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Country:
          <input type="text" name="country" />
        </label>
        <label>
          Nickname:
          <input type="text" name="nickname" required />
        </label>
        <label>
          Bio:
          <textarea type="text" name="bio" cols={52} rows={3} />
        </label>
        <label>
          Select Camera:
          <select
            value={selectedDeviceIds.video}
            onChange={(e) => onDeviceChange('video', e.target.value)}
            required
          >
            {devices.videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Select Microphone:
          <select
            value={selectedDeviceIds.audio}
            onChange={(e) => onDeviceChange('audio', e.target.value)}
            required
          >
            {devices.audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Select Speaker:
          <select
            value={selectedDeviceIds.output}
            onChange={(e) => onDeviceChange('output', e.target.value)}
          >
            {devices.outputDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Speaker ${device.deviceId}`}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
