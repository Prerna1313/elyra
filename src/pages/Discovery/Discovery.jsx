import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import './Discovery.css';

const Discovery = ({ isVisible }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const navigate = useNavigate(); // Hook to change pages

    // Parallax Mouse Movement Logic
    useEffect(() => {
        const handleMove = (e) => {
            setMousePos({
                x: (e.clientX - window.innerWidth / 2) / 25,
                y: (e.clientY - window.innerHeight / 2) / 25
            });
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    // Rain Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let w, h, particles = [];

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        class RainDrop {
            constructor() { this.init(); }
            init() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.length = Math.random() * 20 + 10;
                this.speed = Math.random() * 10 + 12;
                this.opacity = Math.random() * 0.2 + 0.1;
            }
            draw() {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.length);
                ctx.stroke();
            }
            update() {
                this.y += this.speed;
                if (this.y > h) { 
                    this.y = -this.length; 
                    this.x = Math.random() * w; 
                }
            }
        }

        const setup = () => {
            resize();
            particles = []; // Clear existing to prevent duplicates on resize
            for (let i = 0; i < 100; i++) particles.push(new RainDrop());
        };

        let animationFrameId;
        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.draw(); p.update(); });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', setup);
        setup(); 
        animate();

        return () => {
            window.removeEventListener('resize', setup);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // These IDs match your existing naming /img/layer-1.png, etc.
    const forestLayers = [
        { id: 1, z: -150, speed: 0.2 }, { id: 2, z: -50, speed: 0.4 },
        { id: 3, z: 100, speed: 0.7 }, { id: 4, z: 250, speed: 1.1 },
        { id: 5, z: 400, speed: 1.5 }, { id: 6, z: 750, speed: 3.5 },
        { id: 7, z: 950, speed: 5.0 },
    ];

    return (
        <div className={`discovery-page ${isVisible ? 'show-ui' : ''}`}>
            
            <nav className="discovery-nav">
                <div className="nav-content">
                    <div className="nav-logo">ELYRA</div>
                    <div className="nav-links">
                        <button className="nav-item">About</button>
                        <button className="nav-item">My Stories</button>
                        {/* Connected to your new Create Page */}
                        <button 
                            className="nav-btn-special" 
                            onClick={() => navigate('/create')}
                        >
                            TRY NOW
                        </button>
                    </div>
                </div>
            </nav>

            <div className="layers-container">
                <div className="layers-wrapper">
                    
                    {/* 1. Forest Parallax Layers */}
                    {forestLayers.map((layer) => (
                        <div key={layer.id} className={`layer-item layer-${layer.id}`}
                            style={{
                                backgroundImage: `url(/img/layer-${layer.id}.png)`,
                                transform: `translate3d(${mousePos.x * layer.speed}px, ${mousePos.y * layer.speed}px, ${layer.z}px)`
                            }}
                        />
                    ))}

                    {/* 2. Golden Sun Rays */}
                    <div className="sun-rays-layer" 
                         style={{ transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px, 0)` }} 
                    />

                    {/* 3. Hero Content */}
                    {isVisible && (
                        <div className="hero-box-container"
                            style={{ transform: `translate3d(${mousePos.x * 1.1}px, ${mousePos.y * 1.1}px, 600px)` }}>
                            <div className="hero-glass-card">
                                <h1 className="hero-title">ELYRA</h1>
                                <p className="hero-description">
                                    A gentle, neuro-inclusive space where voices, symbols, and visuals unite. 
                                    Designed for diverse minds to express through sound and visual 
                                    storytelling — without rush, at your own pace.
                                </p>
                                <button className="hero-cta" onClick={() => navigate('/home')}>
                                    BEGIN DISCOVERY
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 4. Rain Overlay */}
                    <canvas ref={canvasRef} className="rain-canvas" />
                </div>
            </div>
        </div>
    );
};

export default Discovery;