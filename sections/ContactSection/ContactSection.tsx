'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendToWebhook } from '@/lib/tracking/webhook';
import { getTrackingData } from '@/lib/tracking/utm';
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
    { value: '', label: 'Select a service' },
    { value: 'ai-in-business', label: 'AI in Business' },
    { value: 'brand-marketing', label: 'Brand Marketing' },
    { value: 'business-apps', label: 'Business Apps' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'not-sure', label: 'Not sure yet / Want to discuss' }
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Send form data to webhook
    try {
      const trackingData = getTrackingData('form_submit', {
        formType: 'contact',
        formData: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
        },
      });

      await sendToWebhook(trackingData);
    } catch (error) {
      console.error('Error sending form data to webhook:', error);
      // Continue even if webhook fails - don't block user experience
    }

    setSuccessMessage("Thanks! We'll be in touch soon.");

    // Clear form after 2 seconds
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', service: '' });
      setSuccessMessage('');
    }, 2000);
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
                className="form-input form-select"
              >
                {services.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.service && <div className="form-error">{errors.service}</div>}
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>

            {errors.name && <div className="form-error">{errors.name}</div>}
            {errors.email && <div className="form-error">{errors.email}</div>}
            {successMessage && <div className="form-success">{successMessage}</div>}

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




