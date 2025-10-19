import { useState, useEffect } from 'react';

function RotatingText({ words, interval = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsBlurred(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsBlurred(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span 
      className="highlight rotating-text" 
      style={{
        filter: isBlurred ? 'blur(10px)' : 'blur(0px)',
        opacity: isBlurred ? 0 : 1,
        transition: 'filter 0.5s ease-in-out, opacity 0.5s ease-in-out',
        display: 'inline-block',
        minWidth: '300px',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        fontWeight: '700',
        textTransform: 'capitalize'
      }}
    >
      {words[currentIndex]}
    </span>
  );
}

export default RotatingText;