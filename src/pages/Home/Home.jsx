import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const storyData = [
    { title: "The Hidden Forest", img: "/img/home/scroll_story1.jpeg", gallery: ["/img/home/scroll_story1.jpeg", "/img/home/scroll_story2.jpeg"] },
    { title: "Midnight City", img: "/img/home/scroll_story2.jpeg", gallery: ["/img/home/scroll_story2.jpeg", "/img/home/scroll_story3.jpeg"] },
    { title: "Ocean's Secret", img: "/img/home/scroll_story3.jpeg", gallery: ["/img/home/scroll_story3.jpeg", "/img/home/scroll_story4.jpeg"] },
    { title: "Mountain Peak", img: "/img/home/scroll_story4.jpeg", gallery: ["/img/home/scroll_story4.jpeg", "/img/home/scroll_story5.jpeg"] },
    { title: "Desert Mirage", img: "/img/home/scroll_story5.jpeg", gallery: ["/img/home/scroll_story5.jpeg", "/img/home/scroll_story6.jpeg"] }
  ];

  useEffect(() => {
    // 1. Handle Scroll Variable (The --scrollTop logic)
    const handleScroll = () => {
      document.documentElement.style.setProperty('--scrollTop', `${window.scrollY}px`);
    };

    // 2. Initialize GSAP from window (Assumes scripts are in index.html)
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const ScrollSmoother = window.ScrollSmoother;

    let smoother;
    if (gsap && ScrollTrigger && ScrollSmoother) {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
      smoother = ScrollSmoother.create({
        wrapper: '.wrapper',
        content: '.content',
        smooth: 1.5,
        effects: true,
      });
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (smoother) smoother.kill();
    };
  }, []);

  const moveSlider = (step) => {
    setCurrentIndex((prev) => (prev + step + storyData.length) % storyData.length);
  };

  const openStory = () => {
    setIsOverlayOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeStory = () => {
    setIsOverlayOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="wrapper">
      <div className="content">
        {/* HEADER SECTION */}
        <header className="main-header">
          <div className="layers">
            <div className="layer__header">
              <div className="layers__caption">Welcome to </div>
              <div className="layers__title">ELYRA</div>
              <div className="neuro-info-wrapper">
                <div className="neuro-box box-left">
                  <h3>Focus: ADHD</h3>
                  <p>Combatting distractibility with movement-based focus.</p>
                </div>
                <div className="neuro-box box-right">
                  <h3>Clarity: Dyslexia</h3>
                  <p>Utilizing high-contrast ratios and weighted typography.</p>
                </div>
              </div>
            </div>
            <div className="layer layers__base" style={{ backgroundImage: 'url(/img/home/layer-base.png)' }}></div>
            <div className="layer layers__middle" style={{ backgroundImage: 'url(/img/home/layer-middle.png)' }}></div>
            <div className="layer layers__front" style={{ backgroundImage: 'url(/img/home/layer-front.png)' }}></div>
          </div>
        </header>

        {/* ARTICLE SECTION */}
        <article className="main-article" style={{ backgroundImage: 'url(/img/home/dungeon.jpg)' }}>
          <div className="main-article__content">
            <div className="content-left">
              <h2 className="main-article__header">Stories Designed for Every Mind.</h2>
              <p className="main-article__paragraph">Immersive parallax movement and neuro-inclusive typography.</p>
              <div className="ai-card">
                <h4>Adaptive AI Companion</h4>
                <p>Found on the next page, our AI assistant breaks down complex lore.</p>
              </div>
            </div>
            <div className="content-right">
              <button className="tech-btn">Neuro-Inclusive Tech</button>
            </div>
          </div>
        </article>

        <div className="blend-divider"></div>

        {/* LIBRARY SECTION */}
        <section className="library-section">
          <div id="bg-overlay" style={{ backgroundImage: `url(${storyData[currentIndex].img})`, opacity: 0.2 }}></div>
          <h1 className="header-title">Story World Library</h1>

          <div className="slider-container">
            <button className="nav-btn left" onClick={() => moveSlider(-1)}>❮</button>
            <div className="slider">
              {storyData.map((story, i) => {
                let posClass = "hidden";
                const pos = (i - currentIndex + storyData.length) % storyData.length;
                if (pos === 0) posClass = "active";
                else if (pos === 1) posClass = "right";
                else if (pos === storyData.length - 1) posClass = "left";

                return (
                  <div key={i} className={`card ${posClass}`} onClick={() => pos === 0 ? openStory() : setCurrentIndex(i)}>
                    <img src={story.img} alt={story.title} />
                    <div className="card-info">
                      <h3>{story.title}</h3>
                      <div className="try-it-text">Try It..</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="nav-btn right" onClick={() => moveSlider(1)}>❯</button>
          </div>

          <div className="footer-nav">
             <div className="progress-container">
                <div id="progress-bar" style={{ width: `${((currentIndex + 1) / storyData.length) * 100}%` }}></div>
             </div>
             <button className="big-explore-btn" onClick={openStory}>
                Explore More! <span>&#10142;</span>
             </button>
          </div>
        </section>

        {/* OVERLAY */}
        {isOverlayOpen && (
          <div className="overlay" style={{ display: 'block' }}>
            <button className="close-btn" onClick={closeStory}>✕</button>
            <div className="image-grid">
              {storyData[currentIndex].gallery.map((url, idx) => (
                <img key={idx} src={url} alt="gallery" style={{ width: '100%', borderRadius: '15px' }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;