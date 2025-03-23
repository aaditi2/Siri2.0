import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    console.log("Sending input:", input); // 👀 Debug: show input before sending
    try {
      const res = await axios.post('http://127.0.0.1:8000/chat', {
        user_input: input
      });
      setResponse(res.data.response);
      setInput(''); // Clear input box
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setResponse("⚠️ Backend error — check if it's running.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form reload
    console.log("✅ Form submitted");
    sendMessage();
  };

  return (
    <div className="App" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Siri2.0 🤖</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask me something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '300px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: '10px',
            padding: '0.5rem 1rem',
            fontSize: '16px',
            backgroundColor: '#222',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>

      <p style={{ marginTop: '2rem', fontSize: '18px' }}>
        <strong>Response:</strong> {response || 'Waiting for your question...'}
      </p>
    </div>
  );
}

export default App;
