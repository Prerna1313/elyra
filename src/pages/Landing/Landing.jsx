import React, { useEffect } from 'react';
import Logo from '../../components/Logo/Logo';
import './Landing.css';

const Landing = ({ onEnter, isEntered }) => {
    useEffect(() => {
        const handleGlobalMove = (e) => {
            requestAnimationFrame(() => {
                // These power your torch effect
                document.documentElement.style.setProperty('--x', `${e.clientX}px`);
                document.documentElement.style.setProperty('--y', `${e.clientY}px`);
            });
        };
        window.addEventListener('mousemove', handleGlobalMove);
        return () => window.removeEventListener('mousemove', handleGlobalMove);
    }, []);

    return (
        /* The torch effect lives on this div. 
           'is-fading' will handle the storytelling transition. */
        <div className={`landing-overlay ${isEntered ? 'is-fading' : ''}`}>
            <div className="landing-content">
                <Logo variant="center" />

                <h1 className="aura-title">ELYRA</h1>
                <p className="aura-subtitle">A world waiting to be seen...</p>
                
                <button className="aura-btn" onClick={onEnter}>
                    LIGHT THE PATH
                </button>
            </div>
        </div>
    );
};

export default Landing;