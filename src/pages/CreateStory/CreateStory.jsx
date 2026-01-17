import React, { useEffect, useState, useRef } from 'react';
import { Mic, Plus, Send, Compass, BookOpen, Sparkles, Upload, HardDrive, Image as ImageIcon, User, Settings, LogOut, LogIn, Loader2, Copy, RefreshCw } from 'lucide-react';
import './CreateStory.css';

// Typewriter Sub-component for the story reveal
const Typewriter = ({ text }) => {
    const [displayedText, setDisplayedText] = useState("");
    useEffect(() => {
        let i = 0;
        setDisplayedText("");
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, i));
            i++;
            if (i > text.length) clearInterval(timer);
        }, 20);
        return () => clearInterval(timer);
    }, [text]);
    return <p>{displayedText}</p>;
};

const CreateStory = () => {
    const [scrollY, setScrollY] = useState(0);
    const [smoothScrollY, setSmoothScrollY] = useState(0);
    const [prompt, setPrompt] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showFileMenu, setShowFileMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    // Backend & Story States
    const [generatedStory, setGeneratedStory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const storySectionRef = useRef(null);
    
    const vh = window.innerHeight;

    // Reset scroll on load
    useEffect(() => { window.scrollTo(0, 0); }, []);

    // Smooth Parallax Animation (Lerp)
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

    // Native Scroll Listener
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // API Call to Node.js Backend
    const handleSend = async () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            const data = await response.json();
            if (data.answer) {
                setGeneratedStory(data.answer);
                // Scroll to result after a short delay
                setTimeout(() => {
                    storySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        } catch (e) {
            alert("Ensure backend is running on port 5000");
        } finally {
            setIsLoading(false);
        }
    };

    const isVisible = smoothScrollY < 6500;

    // Calculate dynamic transform for parallax layers
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
            
            {/* Loading Screen */}
            {isLoading && (
                <div className="loading-overlay">
                    <Loader2 className="spinner" size={40} />
                    <p>Fetching your story from the stars...</p>
                </div>
            )}

            {/* Sticky Navigation */}
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

            {/* Parallax Background Layers */}
            <div className="parallax-viewport">
                {['L1', 'L2', 'L3', 'L4', 'L5'].map((id, index) => (
                    <div key={id} className={`layer ${id}`} style={{ ...getLayerStyle(id), zIndex: index + 10 }}>
                        <img src={`/img/create-story/${id}.png`} alt={id} />
                    </div>
                ))}
            </div>

            {/* Hero Heading */}
            <div className="hero-overlay" style={{ opacity: Math.max(0, 1 - smoothScrollY / 1500) }}>
                <h1 className="hero-title-refined">CREATE YOUR OWN <span className="magic-text">STORY</span></h1>
                <p className="hero-subtitle">Every scroll weaves a new world.</p>
            </div>

            {/* REFINED PROMPT BOX */}
            <div className={`prompt-wrapper ${isVisible ? 'show' : 'hide'}`} onClick={(e) => e.stopPropagation()}>
                <div className="prompt-box-accessible">
                    <div className="prompt-inner">
                        <div className="input-section">
                            <div className="file-upload-container">
                                <button className="tool-btn" onClick={() => setShowFileMenu(!showFileMenu)}>
                                    <Plus size={22} strokeWidth={2.5}/>
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
                                onChange={(e) => { setPrompt(e.target.value); setIsTyping(e.target.value.length > 0); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                        </div>
                        
                        {/* Grouped Action Cluster (Mic + Send) */}
                        <div className="action-group">
                            <button className="prompt-mic-btn">
                                <Mic size={20} />
                            </button>
                            <button className={`morph-send-btn ${isTyping ? 'active' : 'waiting'}`} onClick={handleSend}>
                                {isTyping ? (
                                    <Send size={18} />
                                ) : (
                                    <div className="visualizer-bars">
                                        <span></span><span></span><span></span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Large spacer for scrolling experience */}
            <div className="scroll-spacer" style={{ height: '8500px' }}></div>

            {/* WHITE BG STORY SECTION */}
            <div className={`story-result-page ${generatedStory ? 'visible' : ''}`} ref={storySectionRef}>
                {generatedStory && (
                    <div className="story-content-box">
                        <h2 className="result-title">A Tale of {prompt.split(' ')[0] || "Wonder"}</h2>
                        <div className="result-text">
                            <Typewriter text={generatedStory} />
                        </div>
                        <div className="story-footer">
                           <button className="footer-btn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                               <RefreshCw size={16}/> New Story
                           </button>
                           <button className="footer-btn" onClick={() => navigator.clipboard.writeText(generatedStory)}>
                               <Copy size={16}/> Copy Text
                           </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateStory;