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
          <h2>JuiMart</h2>
          <p>
            A celebration of Northeast India's rich heritage through natural,
            handmade, and sustainable products.
          </p>

          {/* CONTACT */}
          <div className={styles.contact}>
            <div>
              <FaWhatsapp /> <span>+91 9395108221</span>
            </div>
            <div>
              <FaPhoneAlt /> <span>+91 9706393924</span>
            </div>
            <div>
              <FaEnvelope /> <span>support@juimart.com</span>
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
          <h4>Help</h4>
          <a href="/">Contact Us</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms & Conditions</a>
        </div>

        {/* NEWSLETTER */}
        <div className={styles.newsletter}>
          <h4>Stay Updated</h4>
          <p>Get latest offers and updates directly in your inbox.</p>

          <div className={styles.inputBox}>
            <input type="email" placeholder="you@example.com" />
            <button>Subscribe</button>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className={styles.bottom}>
        © {new Date().getFullYear()} JuiMart. All rights reserved | Developed by Binud Panging
      </div>
    </footer>
  );
};

export default Footer;