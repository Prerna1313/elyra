import React, { useEffect, useState } from 'react';
import { Mic, Plus, Send, Compass, BookOpen, Sparkles, Upload, HardDrive, Image as ImageIcon, User, Settings, LogOut, LogIn } from 'lucide-react';
import './CreateStory.css';

const CreateStory = () => {
    const [scrollY, setScrollY] = useState(0);
    const [smoothScrollY, setSmoothScrollY] = useState(0);
    const [prompt, setPrompt] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showFileMenu, setShowFileMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    const vh = window.innerHeight;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        let requestRef;
        const lerp = (start, end, factor) => start + (end - start) * factor;
        const animate = () => {
            setSmoothScrollY(prev => lerp(prev, scrollY, 0.04));
            requestRef = requestAnimationFrame(animate);
        };
        requestRef = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef);
    }, [scrollY]);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleInputChange = (e) => {
        setPrompt(e.target.value);
        setIsTyping(e.target.value.length > 0);
    };

    const isVisible = smoothScrollY < 6500;

    const getLayerStyle = (id) => {
        let yPos = 0;
        const s = smoothScrollY;
        const speed = 0.7;
        switch (id) {
            case 'L1': yPos = 0; break;
            case 'L2': yPos = Math.max(0, vh - (s - 1000) * speed); break;
            case 'L3':
                const l3In = Math.max(0, vh - (s - 2500) * speed);
                const l3Out = s > 4500 ? -(s - 4500) * speed : 0;
                yPos = l3In + l3Out;
                break;
            case 'L4': yPos = Math.max(0, vh - (s - 4500) * speed); break;
            case 'L5': yPos = Math.max(0, vh - (s - 6500) * 0.8); break;
            default: break;
        }
        return { transform: `translate3d(0, ${yPos}px, 0)` };
    };

    return (
        <div className="create-container" onClick={() => { setShowFileMenu(false); setShowProfileMenu(false); }}>
            
            <nav className="navbar-fixed">
                <div className="nav-container">
                    <div className="nav-logo">ELYRA</div>
                    <div className="nav-center">
                        <a href="/" className="nav-link"><Compass size={16} /> Discovery</a>
                        <a href="#" className="nav-link"><BookOpen size={16} /> My Stories</a>
                    </div>
                    <div className="nav-right" onClick={(e) => e.stopPropagation()}>
                        <div className="avatar-wrapper" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="round-avatar" />
                        </div>
                        {showProfileMenu && (
                            <div className="dropdown-menu profile-menu">
                                <button className="menu-item"><LogIn size={16} /> Login / Signup</button>
                                <hr />
                                <button className="menu-item"><User size={16} /> Your Profile</button>
                                <button className="menu-item"><Settings size={16} /> Settings</button>
                                <hr />
                                <button className="menu-item logout"><LogOut size={16} /> Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="parallax-viewport">
                {['L1', 'L2', 'L3', 'L4', 'L5'].map((id, index) => (
                    <div key={id} className={`layer ${id}`} style={{ ...getLayerStyle(id), zIndex: index + 10 }}>
                        <img src={`/img/create-story/${id}.png`} alt={id} />
                    </div>
                ))}
            </div>

            <div className="hero-overlay" style={{ opacity: Math.max(0, 1 - smoothScrollY / 1500) }}>
                <h1 className="hero-title-refined">CREATE YOUR OWN <span className="magic-text">STORY</span></h1>
                <p className="hero-subtitle">Every scroll weaves a new world.</p>
            </div>

            <div className={`prompt-wrapper ${isVisible ? 'show' : 'hide'}`} onClick={(e) => e.stopPropagation()}>
                <div className="prompt-box-accessible">
                    <div className="prompt-inner">
                        <div className="input-section">
                            <div className="file-upload-container">
                                <button className="tool-btn" onClick={() => setShowFileMenu(!showFileMenu)}>
                                    <Plus size={22} />
                                </button>
                                {showFileMenu && (
                                    <div className="dropdown-menu file-menu">
                                        <button className="menu-item"><Upload size={14} /> Upload File</button>
                                        <button className="menu-item"><HardDrive size={14} /> From Drive</button>
                                        <button className="menu-item"><ImageIcon size={14} /> Photos</button>
                                    </div>
                                )}
                            </div>
                            <div className="agent-chip">
                                <Sparkles size={12} />
                                <span>Storyteller</span>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Describe your journey..." 
                                value={prompt}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="action-section">
                            <button className="side-mic-btn"><Mic size={20} /></button>
                            <button className={`morph-send-btn ${isTyping ? 'active' : 'waiting'}`}>
                                {!isTyping ? (
                                    <div className="visualizer-bars">
                                        <span></span><span></span><span></span>
                                    </div>
                                ) : (
                                    <Send size={16} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="scroll-spacer" style={{ height: '8500px' }}></div>
        </div>
    );
};

export default CreateStory;