import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope
} from "react-icons/fa";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* LEFT */}
        <div className={styles.brand}>
          <h2>Zui Quick Mart</h2>
          <p>
            A celebration of Northeast India's rich heritage through natural,
            handmade, and sustainable products.
          </p>

          {/* CONTACT */}
          <div className={styles.contact}>
            <div>
              <FaWhatsapp /> <span>+91 863 824 0878</span>
            </div>
            <div>
              <FaPhoneAlt /> <span>+91 863 824 0878</span>
            </div>
            <div>
              <FaEnvelope /> <span>support@zuiquickmart.co.in</span>
            </div>
          </div>

          {/* SOCIAL */}
          <div className={styles.socials}>
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
            <FaYoutube />
          </div>
        </div>

        {/* LINKS */}
        <div className={styles.links}>
          <h5>Help</h5>
          <a href="/contact-us">Contact Us</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-conditions">Terms & Conditions</a>
          <a href="/return-policy">Return & Refund Policy</a>
        </div> 

        {/* NEWSLETTER */}
        <div className={styles.newsletter}>
          <h5>Stay Updated</h5>
          <p>Get latest offers and updates directly in your inbox.</p>

          <div className={styles.inputBox}>
            <input type="email" placeholder="you@example.com" />
            <button>Subscribe</button>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className={styles.bottom}>
        © {new Date().getFullYear()} Zui Quick Mart. All rights reserved | Developed by <a href="https://binud.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}>Binud Panging</a>
      </div>
    </footer>
  );
};

export default Footer;