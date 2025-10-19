import './App.css';
import LiquidEther from './LiquidEther';
import RotatingText from './RotatingText';
import Loader from './Loader';
import ScrollReveal from './ScrollReveal';
import ServicesGrid from './ServicesGrid';

function App() {
  const rotatingWords = ['Thinks', 'Learns', 'Scales'];

  return (
    <>
      <Loader />
      <div className="container">
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <LiquidEther
            colors={['#00ff00', '#00ff00', '#00ff00']}
            mouseForce={20}
            cursorSize={100}
            resolution={0.3}
            autoDemo={true}
            autoSpeed={0.2}
            autoIntensity={2.2}
            dt={0.04}
            iterationsPoisson={16}
            iterationsViscous={16}
          />
        </div>
        <div className="content">
        <p className="tagline">HUMAN <span style={{color: '#00ff00'}}>X</span> AI</p>
          <h1>
            Marketing <RotatingText words={rotatingWords} interval={2000} />
          </h1>
          <p className="description">
            We build intelligent marketing systems powered by AI and human creativity.
          </p>
          <button 
            className="cta-button"
            onClick={() => window.open('https://wa.me/919353253817', '_blank')}
          >
            Get Started ➔
          </button>
        </div>
      </div>

      {/* ==================== SECTION 2: SCROLL REVEAL ==================== */}
      <section className="section-two">
        <div className="section-container">
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            baseRotation={0}
            blurStrength={20}
            rotationEnd="bottom top"
            wordAnimationEnd="bottom center"
          >
            At BCON, we merge data, design, and technology to build growth engines that never stop learning.
          </ScrollReveal>
        </div>
      </section>
    
      {/* ==================== SECTION 3: SERVICES GRID ==================== */}
      <section className="section-three">
        <div className="section-container">
          <h2 className="section-heading">Solutions</h2>
          <ServicesGrid />
        </div>
      </section>
    </>
  );
}

export default App;