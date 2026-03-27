import React from 'react';
import styles from './privacypolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.privacyContainer}>
      <h2 className={styles.headingText}>Privacy Policy</h2>
      <p className={styles.effectiveDate}>
        <strong>Effective Date:</strong> 10/08/2025
        <br />
        <strong>Company Name:</strong> Mrittika Naturals
      </p>

      <p className={styles.paragraph}>
        At Mrittika Naturals, we value your trust and respect your privacy. This Privacy Policy explains
        how we collect, use, and protect your personal information when you interact with us—whether
        through our website, social media, or any other channels.
      </p>

      <hr className={styles.separator} />

      <h3 className={styles.subHeading}>Information We Collect</h3>
      <p className={styles.paragraph}>We may collect the following information from you:</p>
      <ol className={styles.list}>
        <li><strong>Personal Details:</strong> Name, phone number, email address, billing/shipping address.</li>
        <li><strong>Order Information:</strong> Products purchased, payment details, delivery preferences.</li>
        <li><strong>Technical Information:</strong> IP address, browser type, device information, browsing history on our website.</li>
        <li><strong>Communications:</strong> Messages, feedback, and inquiries sent to us via email, forms, or social media.</li>
      </ol>

      <hr className={styles.separator} />

      <h3 className={styles.subHeading}>How We Use Your Information</h3>
      <p className={styles.paragraph}>Your information may be used for:</p>
      <ol className={styles.list}>
        <li>Processing and delivering your orders.</li>
        <li>Responding to your queries and providing customer support.</li>
        <li>Sending updates, offers, and promotions (if you have opted in).</li>
        <li>Improving our products, services, and website experience.</li>
        <li>Complying with legal obligations.</li>
      </ol>

      <hr className={styles.separator} />

      <h3 className={styles.subHeading}>How We Share Your Information</h3>
      <p className={styles.paragraph}>We do not sell or rent your personal information to third parties. We may share your data with:</p>
      <ol className={styles.list}>
        <li><strong>Delivery Partners:</strong> For shipping your orders.</li>
        <li><strong>Payment Gateways:</strong> For processing secure payments.</li>
        <li><strong>Service Providers:</strong> Such as IT, marketing, or analytics companies that help us operate our business.</li>
        <li><strong>Legal Authorities:</strong> If required by law.</li>
      </ol>

      <hr className={styles.separator} />

      <h3 className={styles.subHeading}>Changes to This Privacy Policy</h3>
      <p className={styles.paragraph}>
        We may update this Privacy Policy from time to time. Any changes will be posted on our website
        with a revised “Effective Date.”
      </p>
    </div>
  );
};

export default PrivacyPolicy;
