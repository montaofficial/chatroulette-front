// src/components/VideoChat.jsx
import React, { useEffect, useState } from 'react';
import ChatBox from './ChatBox';


function VideoChat({ socket, userData, connectedUser, onEndCall }) {
  const [messages, setMessages] = useState([]);


  const onSendMessage = (text) => {
    setMessages([...messages, { sender: 'You', text }]);
    socket.emit('send-message', { toSessionId: connectedUser.sessionId, message: text });
  }

  useEffect(() => {
    let initialMessages= [];
    for ( let prop of ["Age", "Gender", "Country", "Bio"]) {
      if (connectedUser[prop.toLowerCase()]) {
        initialMessages.push({ sender: prop, text: connectedUser[prop.toLowerCase()] });
      }
    }
    setMessages(initialMessages);
    socket.on('receive-message', async ({ fromSessionId, message }) => {
      if (connectedUser.sessionId === fromSessionId) {
        console.log('Received message:', message);
        setMessages((messages) => [...messages, { sender: connectedUser.nickname, text: message }]);
      } else {
        console.log('Message from unknown user:', fromSessionId);
      }});
      return () => {
        setMessages([]);
        socket.off('receive-message');
      };
    }, [connectedUser, socket]);

  return (
    <div className="video-chat">
      <h2>Connected to {connectedUser.nickname}</h2>
      <ChatBox messages={messages} onSendMessage={onSendMessage}/>
      <button onClick={onEndCall}>End Call</button>
    </div>
  );
}

export default VideoChat;
