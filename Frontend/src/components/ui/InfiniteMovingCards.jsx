import React, { useEffect, useRef } from 'react';
import './InfiniteMovingCards.css';

const InfiniteMovingCards = ({ items, direction = 'left', speed = 'normal' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollContainer = container.querySelector('.scroll-container');
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const containerWidth = container.offsetWidth;
    
    // Clone items for seamless loop
    const items = scrollContainer.children;
    const itemsArray = Array.from(items);
    
    itemsArray.forEach(item => {
      const clone = item.cloneNode(true);
      scrollContainer.appendChild(clone);
    });

    let animationId;
    let scrollPosition = 0;
    
    const speedMap = {
      slow: 0.5,
      normal: 1,
      fast: 2
    };
    
    const currentSpeed = speedMap[speed] || 1;
    const scrollSpeed = direction === 'right' ? -currentSpeed : currentSpeed;

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      if (direction === 'left' && scrollPosition >= scrollWidth / 2) {
        scrollPosition = 0;
      } else if (direction === 'right' && scrollPosition <= -scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.style.transform = `translateX(${scrollPosition}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [direction, speed]);

  return (
    <div className="infinite-moving-cards" ref={containerRef}>
      <div className="scroll-container">
        {items.map((item, index) => (
          <div key={index} className="news-moving-card">
            <div className="card-header">
              <span className={`card-category ${item.category.toLowerCase().replace(' ', '-')}`}>
                {item.category}
              </span>
              <span className="card-date">{item.date}</span>
            </div>
            <h4 className="card-title">{item.title}</h4>
            <p className="card-description">{item.description}</p>
            <div className="card-footer">
              <span className={`card-status ${item.status.toLowerCase().replace(' ', '-')}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteMovingCards;