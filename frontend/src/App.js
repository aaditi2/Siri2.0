// App.js
import React, { useState } from 'react';
import axios from 'axios';
import MockiPhoneScreen from './MockiPhoneScreen';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [lastIntent, setLastIntent] = useState('default');
  const [isListening, setIsListening] = useState(false);

  const sendMessage = async () => {
    setIsListening(false);
    try {
      const res = await axios.post('http://127.0.0.1:8000/chat', {
        user_input: input
      });
      setResponse(res.data.response);

      const lower = input.toLowerCase();
      if (lower.includes('meeting') || lower.includes('calendar')) setLastIntent('calendar');
      else if (lower.includes('photo') || lower.includes('picture')) setLastIntent('photos');
      else if (lower.includes('weather') || lower.includes('rain')) setLastIntent('weather');
      else if (lower.includes('download')) setLastIntent('downloads');
      else if (lower.includes('email')) setLastIntent('email');
      else setLastIntent('default');

      setInput('');
    } catch (err) {
      console.error("❌ Backend error", err);
      setResponse("⚠️ Could not reach the assistant.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleListenClick = () => {
    setIsListening(true);
    // integrate speech recognition start logic here
  };

  return (
    <div style={{ display: 'flex', padding: '2rem', fontFamily: 'Arial' }}>
      <div style={{ flex: 1 }}>
        <h1>Siri2.0 🤖</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type or speak..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ padding: '0.5rem', width: '300px' }}
          />
          <button type="submit" style={{ marginLeft: '1rem' }}>Send</button>
          <button type="button" style={{ marginLeft: '1rem' }} onClick={handleListenClick}>🎙️ Speak</button>
        </form>
        <p style={{ marginTop: '1rem' }}><strong>Response:</strong> {response}</p>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <MockiPhoneScreen intent={lastIntent} isListening={isListening} />
      </div>
    </div>
  );
}

export default App;