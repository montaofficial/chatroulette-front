// src/api.js
export const API_URL = 'https://chatroulette.tokiostudio.it';

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return await response.json();
}

export async function getUser(sessionId) {
  const response = await fetch(`${API_URL}/get-user?sessionId=${sessionId}`);
  if (!response.ok) {
    throw new Error('No active users available');
  }
  return await response.json();
}

export async function getQueue() {
  const response = await fetch(`${API_URL}/get-queue`);
  if (!response.ok) {
    throw new Error('Failed to get queue');
  }
  return await response.json();
}

export async function imUp(sessionId) {
  const response = await fetch(`${API_URL}/im-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to update ping');
  }

  return await response.json();
}

export async function sendOffer(sessionId, toSessionId, offer) {
  const response = await fetch(`${API_URL}/send-offer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, toSessionId, offer }),
  });

  if (!response.ok) {
    throw new Error('Failed to send offer');
  }

  return await response.json();
}

export async function getOffer(sessionId) {
  const response = await fetch(`${API_URL}/get-offer?sessionId=${sessionId}`);
  if (!response.ok) {
    throw new Error('No offer available');
  }

  return await response.json();
}

export async function sendAnswer(sessionId, toSessionId, answer) {
  const response = await fetch(`${API_URL}/send-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, toSessionId, answer }),
  });

  if (!response.ok) {
    throw new Error('Failed to send answer');
  }

  return await response.json();
}

export async function getAnswer(sessionId) {
  const response = await fetch(`${API_URL}/get-answer?sessionId=${sessionId}`);
  if (!response.ok) {
    throw new Error('No answer available');
  }

  return await response.json();
}

export async function sendIceCandidate(sessionId, toSessionId, candidate) {
  const response = await fetch(`${API_URL}/send-ice-candidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, toSessionId, candidate }),
  });

  if (!response.ok) {
    throw new Error('Failed to send ICE candidate');
  }

  return await response.json();
}

export async function getIceCandidates(sessionId) {
  const response = await fetch(`${API_URL}/get-ice-candidates?sessionId=${sessionId}`);
  if (!response.ok) {
    throw new Error('No ICE candidates available');
  }

  return await response.json();
}
