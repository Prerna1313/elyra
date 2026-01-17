import React from 'react';
import './Logo.css';

const Logo = ({ variant = "center" }) => {
    return (
        <div className={`logo-wrapper ${variant}`}>
            {/* Direct path to the public folder */}
            <img src="/icons/logo.png" alt="Elyra Logo" className="logo-img" />
        </div>
    );
};

export default Logo;