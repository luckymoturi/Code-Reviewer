import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';

const socket = io('http://localhost:300o'); // Point to your backend server

const CodeEditor = () => {
  const [code, setCode] = useState('');

  useEffect(() => {
    socket.on('codeChange', (newCode) => {
      setCode(newCode);
    });

    return () => socket.off('codeChange');
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit('codeChange', value);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Editor
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={(e) => handleEditorChange(e)}
      />
    </div>
  );
};

export default CodeEditor;
