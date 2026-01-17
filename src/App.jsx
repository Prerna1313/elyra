import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Discovery from './pages/Discovery/Discovery';
import CreateStory from './pages/CreateStory/CreateStory';
import Home from './pages/Home/Home'; 
import './styles/global.css'; 

function App() {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Landing Page (The Intro) */}
        <Route path="/" element={
          <div className={`app-container ${isEntered ? 'is-active' : 'is-sleeping'}`}>
            <Discovery isVisible={isEntered} />
            <Landing isEntered={isEntered} onEnter={() => setIsEntered(true)} />
          </div>
        } />

        {/* Home Page (The Fairy Forest) */}
        <Route path="/home" element={<Home />} />

        {/* Create Page (The AI Assistant) */}
        <Route path="/create" element={<CreateStory />} />
      </Routes>
    </Router>
  );
}

export default App;