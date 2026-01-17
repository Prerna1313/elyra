import React, { useState } from 'react';
import './GeneratorUI.css';

const GeneratorUI = () => {
    const [prompt, setPrompt] = useState("");

    return (
        <div className="generator-container">
            <div className="glass-input-card">
                <h2 className="generator-title">Whipser to the Forest</h2>
                <p className="generator-desc">Describe the creature or flora you wish to manifest.</p>
                
                <div className="input-group">
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A bioluminescent owl with crystalline wings..."
                        className="forest-input"
                    />
                    <button className="generate-btn">
                        <span>MANIFEST</span>
                        <div className="btn-glow"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeneratorUI;