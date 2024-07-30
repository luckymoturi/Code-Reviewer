import React, { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

const socket = io('http://localhost:3001'); // Your signaling server URL

const ScreenShare = () => {
  const videoRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    socket.on('signal', data => {
      if (peerRef.current) {
        peerRef.current.signal(data);
      }
    });

    return () => {
      socket.off('signal');
    };
  }, []);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream
      });

      peer.on('signal', data => {
        socket.emit('signal', data);
      });

      peer.on('stream', stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });

      peerRef.current = peer;
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  return (
    <div>
      <h1>Screen Share</h1>
      <button onClick={startScreenShare}>Start Screen Share</button>
      <video ref={videoRef} autoPlay style={{ width: '80%', height: '80%' }}></video>
    </div>
  );
};

export default ScreenShare;
