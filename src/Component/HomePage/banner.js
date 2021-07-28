import React from 'react';
import '../../css/style.css';

const Banner = () => {
  const moveLogo = () => {
    if (document.getElementById('elem')) {
      const element = document.getElementById('elem');
      const desiredPosition = 700;
      if (window.pageYOffset > desiredPosition) {
        element.style.cssText += 'transform: matrix(1.4, 0, 0, 1.7, 0, 0); top: 28px; z-index: 5;';
      } else {
        element.style.cssText += 'transform: matrix(8, 0, 0, 7, 0, 70); top: 90px; z-index: 0';
      }
    }
  };
  window.onscroll = moveLogo;

  return (
    <>
      <div className="banner">
        <img className="banner-img" src="./imgs/bmin.jpg" alt="banner" />
        <div className="intro-line1">EXPLORE</div>
        <div className="intro-line2">WANDER</div>
        <div className="intro-line3">COLLECT</div>
        <div className="banner-desc">Every journey starts from the first one step, and each one writes the future. Make your way to see the world.</div>
        <div id="elem">O N E S T E P</div>
      </div>
      <div className="features">
        <div className="feature">
          <div className="feature-title">PLAN or TRACK</div>
          <div className="feature-content">Start a trip in seconds. Add your ideas into the itinerary and check the location in the built-in map view to turn travel moments into lifetime memories. </div>
        </div>
        <div className="feature-sep" />
        <div className="feature">
          <div className="feature-title">INSPIRE or BE INSPIRED</div>
          <div className="feature-content">Bring the adventure to life to inspire other travel lovers. Or check out other travel addiction to get brilliant ideas for your next trip. </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
