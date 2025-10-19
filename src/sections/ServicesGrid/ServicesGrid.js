import { useRef } from 'react';
import './ServicesGrid.css';

function ServicesGrid() {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const services = [
    {
      title: 'AI Marketing Strategy',
      gradient: 'linear-gradient(135deg, #000000 0%, #00ff00 100%)'
    },
    {
      title: 'Performance Marketing',
      gradient: 'linear-gradient(135deg, #000000 0%, #00ff00 100%)'
    },
    {
      title: 'Brand Building',
      gradient: 'linear-gradient(135deg, #000000 0%, #00ff00 100%)'
    },
    {
      title: 'AI Content Creation',
      gradient: 'linear-gradient(135deg, #000000 0%, #00ff00 100%)'
    },
    {
      title: 'Web & Next-Gen Apps',
      gradient: 'linear-gradient(135deg, #000000 0%, #00ff00 100%)'
    },
    {
      title: 'Analytics & Intelligence',
      gradient: 'linear-gradient(135deg, #000000 0%, #00ff00 100%)'
    }
  ];

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  return (
    <div 
      className="services-grid"
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {services.map((service, index) => (
        <div key={index} className="service-card-visual">
          <h3 className="service-title">{service.title}</h3>
          <div 
            className="service-card-image" 
            style={{ background: service.gradient }}
          ></div>
        </div>
      ))}
    </div>
  );
}

export default ServicesGrid;