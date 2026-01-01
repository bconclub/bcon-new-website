'use client';

import { useState } from 'react';
import Link from 'next/link';
import './ContactSection.css';

interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    service: ''
  });

  const services = [
    'AI Strategy Consulting',
    'Human X AI Marketing',
    'AI-Powered Content',
    'Smart Webistes',
    'AI-Driven Ads',
    'Conversation AI - PROXe'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-left">
          <h2 className="contact-heading">
            Let's <span className="highlight">Begin</span>
          </h2>

          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <p className="step-text">
                  Fill out the form—we'll get back to you within 24 hours
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <p className="step-text">
                  Get a tailored proposal specifically for your project
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <p className="step-subtitle">Kick-start your project</p>
                <p className="step-text">with our expert team</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-right">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="form-input form-select"
              >
                <option value="">Select Service</option>
                {services.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>

            <p className="privacy-text">
              By submitting this form, you agree to our{' '}
              <Link href="/privacy" className="privacy-link">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

