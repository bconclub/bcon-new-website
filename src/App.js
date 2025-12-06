import './App.css';
// ✅ Component imports - Updated paths
import LiquidEther from './effects/LiquidEther/LiquidEther';
import RotatingText from './sections/RotatingText/RotatingText';
import Loader from './effects/Loader/Loader';
import ScrollReveal from './sections/ScrollReveal/ScrollReveal';
import ServicesGrid from './sections/ServicesGrid/ServicesGrid';
import LiquidBentoPortfolio from './sections/LiquidBentoPortfolio/LiquidBentoPortfolio';
import ShowReel from './sections/ShowReel/ShowReel';
import GradualBlur from './effects/GradualBlur/GradualBlur';
import StaggeredMenu from './components/StaggeredMenu/StaggeredMenu';
import ContactSection from './sections/ContactSection/ContactSection';
// Keep this line, no changes needed

function App() {
  const rotatingWords = ['Thinks', 'Learns', 'Scales'];
  
  // ✅ Menu configuration
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '#home' },
    { label: 'About', ariaLabel: 'Learn about us', link: '#about' },
    { label: 'Work', ariaLabel: 'View our work', link: '#work' },
    { label: 'Hire Us', ariaLabel: 'Get in touch', link: 'https://wa.me/919353253817' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/bconclub/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/bconclub' },
    { label: 'YouTube', link: 'https://www.youtube.com/@bconclub' }
  ];

  return (
    <>
      {/* ✅ StaggeredMenu Header - Fixed at top */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={false}
        accentColor="#CCFF00"
      />

      {/* ✅ Loader Animation */}
      <Loader />

      {/* ✅ Hero Section */}
      <div className="container">
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
          <LiquidEther
            colors={['#CCFF00', '#CCFF00', '#CCFF00']}
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
          <p className="tagline">HUMAN <span style={{color: '#CCFF00'}}>X</span> AI</p>
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

      {/* ==================== SHOWREEL SECTION ==================== */}
      <ShowReel />

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
            At BCON, we combine strategy, creativity, and AI to build brands that don't just grow, they scale and dominate.
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

      {/* ==================== SECTION 4: PORTFOLIO ==================== */}
      <LiquidBentoPortfolio />

      {/* ==================== SECTION 5: Contact ==================== */}
      <ContactSection />

      {/* ==================== FIXED FOOTER BLUR ==================== */}
      <GradualBlur 
        target="page"
        position="bottom"
        height="8rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential={true}
        opacity={1}
        style={{ zIndex: 50 }} 
      />
    </>
  );
}

export default App;