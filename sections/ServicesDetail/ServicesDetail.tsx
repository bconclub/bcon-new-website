'use client';

import { useEffect } from 'react';
import './ServicesDetail.css';

interface Stat {
  label: string;
  value: string;
  sublabel: string;
}

interface Service {
  id: number;
  title: string;
  oneLiner: string;
  description: string;
  stats: Stat[];
  benefits: string[];
  layout: 'left' | 'right';
}

export default function ServicesDetail() {
  const services: Service[] = [
    {
      id: 1,
      title: 'AI in Business',
      oneLiner: 'Turn your business into an intelligent system.',
      description: 'Most businesses waste time on work that could run itself. We integrate AI to automate workflows, eliminate repetition, and free your team to focus on growth. You don\'t need more people. You need smarter systems.',
      stats: [
        { label: 'Efficiency Gain', value: '98%', sublabel: 'Process Automation' },
        { label: 'Cost Reduction', value: '4/5', sublabel: 'Clients Saved' },
        { label: 'Integration Time', value: '2-4', sublabel: 'Weeks Average' }
      ],
      benefits: [
        'Workflow automation that eliminates manual tasks',
        'Smart CRM and sales systems',
        'Predictive analytics for better decisions',
        'AI tool integration across operations',
        'Team training to use intelligence effectively'
      ],
      layout: 'left'
    },
    {
      id: 2,
      title: 'Brand Marketing',
      oneLiner: 'Marketing that thinks, adapts, and performs.',
      description: 'Good marketing gets attention. Great marketing knows who to reach, what to say, and when to act. We build brands and campaigns powered by intelligence and creativity — not guesswork.',
      stats: [
        { label: 'ROI Increase', value: '300%', sublabel: 'Average Campaign' },
        { label: 'Engagement Rate', value: '85%', sublabel: 'Higher than Industry' },
        { label: 'Content Scale', value: '10x', sublabel: 'Production Speed' }
      ],
      benefits: [
        'Brand strategy that positions you clearly',
        'Creative that captures and converts',
        'Performance campaigns optimized in real time',
        'Content systems that scale without losing soul',
        'Social intelligence and engagement automation'
      ],
      layout: 'right'
    },
    {
      id: 3,
      title: 'Business Apps',
      oneLiner: 'Digital platforms built to learn and convert.',
      description: 'Your website and apps shouldn\'t just look good. They should adapt to users, optimize for conversion, and get smarter over time. We build digital experiences that think.',
      stats: [
        { label: 'Conversion Rate', value: '250%', sublabel: 'Improvement' },
        { label: 'Average ROI', value: '5X', sublabel: '' },
        { label: 'Businesses Transformed', value: '47+', sublabel: '' }
      ],
      benefits: [
        'Websites that personalize based on behavior',
        'Apps designed for conversion, not aesthetics',
        'AI-powered chatbots and assistants',
        'Performance tracking and optimization',
        'Platforms that scale with your business'
      ],
      layout: 'left'
    }
  ];

  // Handle scroll to service when page loads with hash or hash changes
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#service-')) {
        const serviceId = hash.replace('#service-', '');
        setTimeout(() => {
          const element = document.getElementById(`service-${serviceId}`);
          if (element) {
            // Scroll to the beginning of the service section with offset for header
            // This ensures heading and content are visible
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 500);
      }
    };

    // Check on mount
    handleHashScroll();

    // Also listen for hash changes
    window.addEventListener('hashchange', handleHashScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);

  return (
    <section className="services-detail-section" id="services">
      <div className="services-detail-container">
        {services.map((service) => (
          <div 
            key={service.id} 
            id={`service-${service.id}`}
            className={`service-card-modern ${service.layout === 'right' ? 'service-card-reverse' : ''}`}
          >
            {/* Left Side - Content */}
            <div className="service-card-content">
              <div className="service-card-header">
                <div className="service-number">0{service.id}</div>
                <h2 className="service-card-title">{service.title}</h2>
              </div>
              
              <p className="service-card-oneliner">{service.oneLiner}</p>
              
              <p className="service-card-description">{service.description}</p>

              {/* Stats Cards */}
              <div className="service-stats-grid">
                {service.stats.map((stat, index) => (
                  <div key={index} className="service-stat-card">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-sublabel">{stat.sublabel}</div>
                  </div>
                ))}
              </div>

              {/* Benefits List */}
              <div className="service-benefits-modern">
                <h3 className="benefits-title">What you get:</h3>
                <ul className="service-benefits-list-modern">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="benefit-item-modern">
                      <span className="benefit-icon">✓</span>
                      <span className="benefit-text">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Side - Visual Card */}
            <div className="service-card-visual">
              <div className="service-visual-card">
                <div className="visual-card-header">
                  <span className="visual-card-badge">Featured</span>
                  <div className="visual-card-icon">→</div>
                </div>
                <div className="visual-card-content">
                  <div className="visual-card-graphic">
                    <div className="graphic-circle"></div>
                    <div className="graphic-elements">
                      <div className="graphic-dot graphic-dot-1"></div>
                      <div className="graphic-dot graphic-dot-2"></div>
                      <div className="graphic-dot graphic-dot-3"></div>
                    </div>
                  </div>
                  <div className="visual-card-text">
                    <h3 className="visual-card-title">Intelligent Solutions</h3>
                    <p className="visual-card-desc">Powered by Human × AI collaboration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="services-cta-section">
        <div className="services-cta-container">
          <h2 className="services-cta-headline">Ready to build an intelligent business?</h2>
          <p className="services-cta-copy">These aren't separate services. They're three parts of one system — designed to make your business think faster, move smarter, and scale further.</p>
          <div className="services-cta-buttons">
            <a href="https://wa.me/919353253817" className="services-cta-button services-cta-primary">Start a Project</a>
            <a href="https://wa.me/919353253817" className="services-cta-button services-cta-secondary">Book a Strategy Call</a>
          </div>
        </div>
      </div>
    </section>
  );
}




