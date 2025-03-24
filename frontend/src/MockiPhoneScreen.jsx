// MockiPhoneScreen.jsx
import React from 'react';
import './MockiPhoneScreen.css';
import homeScreen from './assets/iphone_home_screen.png';
import siriListening from './assets/siri_listening.png';
import samplePhoto from './assets/sample_photo.png';
import emailScreen from './assets/email_screen.png';

function MockiPhoneScreen({ intent, isListening }) {
  const renderContent = () => {
    if (isListening) {
      return <img src={siriListening}  className="iphone-image" />;
    }
    switch (intent) {
      case 'photos':
        return <img src={samplePhoto}  className="iphone-image" />;
      case 'email':
        return <img src={emailScreen}  className="iphone-image" />;
      case 'calendar':
      case 'weather':
      case 'downloads':
      default:
        return <img src={homeScreen} className="iphone-image" />;
    }
  };

  return (
    <div className="iphone-frame">
      <div className="iphone-screen">
        {renderContent()}
      </div>
    </div>
  );
}

export default MockiPhoneScreen;