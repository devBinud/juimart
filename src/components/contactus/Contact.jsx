import React, { useEffect, useState } from 'react';
import styles from './contact.module.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    agree: false
  });

  const whatsappNumber = '919101038129'; // without '+'

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agree) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    const messageText = `*Contact Form Enquiry*\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage: ${formData.message}`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

    window.open(whatsappLink, '_blank');
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        {/* LEFT SIDE */}
        <div className={styles.left}>
          <h2>Stay in Touch</h2>
          <p style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Have questions or need assistance? We’d love to hear from you. Reach out to us using the details below or send us a message through the form.
          </p>

          <div className={styles.contactRow}>
            <FaPhoneAlt className={styles.icon} />
            <a href="tel:+919101038129" className={styles.contactLink}>+91 91010 38129</a>
          </div>
          <div className={styles.contactRow}>
            <FaPhoneAlt className={styles.icon} />
            <a href="tel:+916000800104" className={styles.contactLink}>+91 60008 00104</a>
          </div>
          <div className={styles.contactRow}>
            <FaPhoneAlt className={styles.icon} />
            <a href="tel:+919101169350" className={styles.contactLink}>+91 91011 69350</a>
          </div>
          <div className={styles.contactRow}>
            <FaEnvelope className={styles.icon} />
            <a href="mailto:mrittikanaturals@gmail.com" className={styles.contactLink}>mrittikanaturals@gmail.com</a>
          </div>
          <div className={styles.contactRow}>
            <FaMapMarkerAlt className={styles.icon} />
            <span className={styles.contactLink}>
              1st Floor, House No 67, HM Das Road, Rehabari, Guwahati, Assam, 781008
            </span>
          </div>

          <div className="mt-4"></div>
          <h2>Whatsapp Us</h2>
          <p style={{ fontFamily: 'Montserrat, sans-serif', marginTop: '10px' }}>
            Want to find the perfect Mrittika Naturals products for you? Get a personalized product consultation on<br />
            <strong style={{ color: '#b76538' }}>+91-9101038129 / +91 91010 38129</strong><br />
            <span style={{ fontStyle: 'italic' }}>(Mon–Sat, 10 A.M – 6 P.M / Sunday - 10AM -1PM)</span>
          </p>

          <div className={styles.mapWrapper} style={{ position: 'relative' }}>
            <iframe
              className={styles.map}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14204.97297889448!2d91.75296715!3d26.1807034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5991ab3b2c2d%3A0x89854e857c8fe1ae!2sHM%20Das%20Road%2C%20Rehabari%2C%20Guwahati%2C%20Assam%20781008!5e0!3m2!1sen!2sin!4v1722162912991!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              title="Store Location"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', height: '400px', border: 0 }}
            ></iframe>
            <div
              style={{
                position: 'absolute',
                right: '0px',
                top: '10px',
                background: '#ffffffdd',
                color: '#b76538',
                fontFamily: 'Playfair Display, serif',
                padding: '8px 14px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              Mrittika Naturals
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.right}>
          <h2>Send us a Query</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            <textarea
              name="message"
              rows="5"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                required
              />
              <label>I agree to the terms and conditions</label>
            </div>
            <button className={styles.sendMessage_button} type="submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
