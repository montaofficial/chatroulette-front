// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import RegistrationForm from './components/RegistrationForm';
import WaitingRoom from './components/WaitingRoom';
import VideoChat from './components/VideoChat';
import MainUserInterface from './components/MainUserInterface'; // Special interface for the main user "Luke"
import { io } from 'socket.io-client';
import Header from './components/Header';
const rtcConfig = {
  iceServers: [
    {
      urls: 'stun:stun.1.google.com:19302'
    },
  ],
};

const socket = io('https://chatroulette.tokiostudio.it');
let sessionId = null;

socket.on('connect', () => {
  console.log('Connected to server', socket.id);
  sessionId = socket.id;
});

function App() {
  const [userData, setUserData] = useState(null);
  const [connectedUser, setConnectedUser] = useState(null);
  const [appState, setAppState] = useState('registration'); // 'registration', 'waiting', 'videochat', 'mainUser'
  const [isMainUser, setIsMainUser] = useState(false);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState({ videoDevices: [], audioDevices: [], outputDevices: [] });
  const [selectedDeviceIds, setSelectedDeviceIds] = useState({
    video: localStorage.getItem('preferredVideoDevice') || '',
    audio: localStorage.getItem('preferredAudioDevice') || '',
    output: localStorage.getItem('preferredOutputDevice') || ''
  });
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const mediaStreamRef = useRef();
  const peerConnectionRef = useRef();

  // Load available media devices and set default values
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter((device) => device.kind === 'videoinput');
      const audioDevices = deviceInfos.filter((device) => device.kind === 'audioinput');
      const outputDevices = deviceInfos.filter((device) => device.kind === 'audiooutput');

      setDevices({ videoDevices, audioDevices, outputDevices });

      setSelectedDeviceIds((prev) => ({
        video: prev.video || (videoDevices.length > 0 ? videoDevices[0].deviceId : ''),
        audio: prev.audio || (audioDevices.length > 0 ? audioDevices[0].deviceId : ''),
        output: prev.output || (outputDevices.length > 0 ? outputDevices[0].deviceId : '')
      }));
    }).catch((err) => {
      setError('Could not enumerate devices.');
    });
  }, []);

  // Request video and audio stream when devices are selected
  useEffect(() => {
    if (selectedDeviceIds.video && selectedDeviceIds.audio) {
      navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDeviceIds.video } },
        audio: { deviceId: { exact: selectedDeviceIds.audio } }
      }).then((stream) => {
        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setError(null);
      }).catch((err) => {
        setError('Failed to access the selected camera or microphone. Please allow access.');
      });
    }
  }, [selectedDeviceIds]);

  // WebSocket event listeners
  useEffect(() => {
    // Handle registration success
    socket.on('registered', (user) => {
      setUserData(user);
      sessionId = user.sessionId;
      const isLuke = user.nickname === 'luke';
      setIsMainUser(isLuke);
      setAppState(isLuke ? 'mainUser' : 'waiting');
    });

    // Handle user found for chat
    socket.on('user-found', ({randomUser, caller}) => {
      console.log('User found:', randomUser, "Caller:", caller);
      setConnectedUser({ ...randomUser, caller });
      setAppState('videochat');
    });

    // Handle user not found in queue
    socket.on('user-not-found', () => {
      setError('No user found. Please wait.');
    });

    // Handle received offer (guest user)
    socket.on('receive-offer', async ({ fromSessionId, offer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit('send-answer', { toSessionId: fromSessionId, answer });
      }
    });

    // Handle received answer (main user)
    socket.on('receive-answer', async ({ fromSessionId, answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Handle received ICE candidate
    socket.on('receive-ice-candidate', async ({ fromSessionId, candidate }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('registration-failed', ({ error }) => {
      setError(error);
    });

    // Clean up socket listeners on component unmount
    return () => {
      socket.off('registered');
      socket.off('user-found');
      socket.off('user-not-found');
      socket.off('receive-offer');
      socket.off('receive-answer');
      socket.off('receive-ice-candidate');
      socket.off('registration-failed');
    };
  }, []);

  const handleDeviceChange = (type, deviceId) => {
    setSelectedDeviceIds((prev) => ({ ...prev, [type]: deviceId }));
    if (type === 'video') {
      localStorage.setItem('preferredVideoDevice', deviceId);
    } else if (type === 'audio') {
      localStorage.setItem('preferredAudioDevice', deviceId);
    } else if (type === 'output') {
      localStorage.setItem('preferredOutputDevice', deviceId);
    }
  };

  const handleRegistration = (userData) => {
    const normalizedNickname = userData?.nickname?.trim().toLowerCase();
    socket.emit('register', { ...userData, sessionId });
    setUserData({ ...userData, nickname: normalizedNickname });
    const isLuke = normalizedNickname === 'luke';
    setIsMainUser(isLuke);
    setAppState(isLuke ? 'mainUser' : 'waiting');
  };


  const handleNextUser = () => {
    // Skip to the next user
    setConnectedUser(null);
    setAppState('waiting');
    socket.emit('get-user');
  };

  const handleEndCall = () => {
    setConnectedUser(null);
    setAppState(isMainUser ? 'mainUser' : 'waiting');
  };

  useEffect(() => {
    if (connectedUser) {
      console.log('Initiating connection with:', connectedUser);
      // WebRTC Setup for initiating or receiving connections
      const initiateConnection = () => {
        const peerConnection = new RTCPeerConnection(rtcConfig);
        peerConnectionRef.current = peerConnection;

        // Add media stream tracks
        mediaStreamRef.current.getTracks().forEach((track) => {
          peerConnection.addTrack(track, mediaStreamRef.current);
        });

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate && connectedUser) {
            socket.emit('send-ice-candidate', {
              toSessionId: connectedUser.sessionId,
              candidate: event.candidate,
            });
          }
        };

        // Handle remote stream
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Create offer if the user is the main user
        if (isMainUser) {
          peerConnection.createOffer({
            iceRestart: true,
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
          }).then((offer) => {
            return peerConnection.setLocalDescription(offer);
          }).then(() => {
            if (connectedUser) {
              socket.emit('send-offer', { toSessionId: connectedUser.sessionId, offer: peerConnection.localDescription });
            }
          }).catch((error) => {
            console.error('Error creating offer:', error);
          });
        }
      };
      initiateConnection();
    }
  }, [connectedUser, isMainUser]);

  return (
    <div className="main-app">
      <Header onNext={handleNextUser} />
      <div className="App" style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Remote Video or Placeholder */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', backgroundColor: connectedUser ? 'transparent' : 'black' }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', display: connectedUser ? 'block' : 'none' }}></video>
        </div>

        {/* Local Video */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%' }}>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%' }}></video>
        </div>
      </div>
      
      <div style={{ flex: 2, padding: '20px' }}>
        {appState === 'registration' && (
          <RegistrationForm
            onRegister={handleRegistration}
            devices={devices}
            selectedDeviceIds={selectedDeviceIds}
            onDeviceChange={handleDeviceChange}
            error={error}
          />
        )}
        {appState === 'waiting' && sessionId && (
          <WaitingRoom />
        )}
        {appState === 'videochat' && connectedUser && (
          <VideoChat
            socket={socket}
            userData={userData}
            connectedUser={connectedUser}
            onEndCall={handleEndCall}
            mediaStream={mediaStreamRef.current}
            remoteVideoRef={remoteVideoRef}
          />
        )}
        {appState === 'mainUser' && sessionId && (
          <MainUserInterface
            sessionId={sessionId}
            onNextUser={handleNextUser}
          />
        )}
      </div>
    </div>
    </div>
  );
}

export default App;
