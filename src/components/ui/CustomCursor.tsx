
import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over a clickable element
      const target = e.target as HTMLElement;
      const isLink = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') || 
        target.closest('button');
      
      setLinkHovered(!!isLink);
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    addEventListeners();
    return () => removeEventListeners();
  }, []);

  // Only render custom cursor on non-touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      <div
        className={`custom-cursor ${clicked ? 'cursor--clicked' : ''} ${linkHovered ? 'cursor--link' : ''} ${hidden ? 'cursor--hidden' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      <div 
        className={`custom-cursor-follower ${clicked ? 'follower--clicked' : ''} ${linkHovered ? 'follower--link' : ''} ${hidden ? 'follower--hidden' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      
      {/* Cursor Styles */}
      <style>
        {`
        .custom-cursor {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 9999;
          transition: width 0.2s, height 0.2s, background-color 0.2s;
        }
        
        .cursor--clicked {
          transform: translate(-50%, -50%) scale(0.8);
        }
        
        .cursor--link {
          width: 12px;
          height: 12px;
          background: hsl(var(--accent));
        }
        
        .cursor--hidden {
          opacity: 0;
        }
        
        .custom-cursor-follower {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: all 0.15s ease-out;
          z-index: 9998;
        }
        
        .follower--clicked {
          width: 24px;
          height: 24px;
          border-color: hsl(var(--accent));
        }
        
        .follower--link {
          width: 40px;
          height: 40px;
          border-color: rgba(147, 112, 219, 0.5);
        }
        
        .follower--hidden {
          opacity: 0;
        }
        `}
      </style>
    </>
  );
};

export default CustomCursor;
