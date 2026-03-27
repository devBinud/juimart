import React from 'react';
import styles from './ctahome.module.css';

const CTAHome = () => {
  return (
    <div className={styles.ctaSection}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Experience the Purity of Nature
        </h2>
        <p className={styles.subtitle}>
          Pure – Natural – Rooted
        </p>
        <button className={styles.ctaButton}>View More</button>
      </div>
    </div>
  );
};

export default CTAHome;
