import React from 'react';
import styles from './herosection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.heroSection_wrapper}>
      <div className={styles.heroSection_content}>
        <h1 className={styles.heroSection_heading}>
          Fresh Groceries, <br/>
          <span className={styles.orangeText}>Delivered Instantly.</span>
        </h1>
        <p className={styles.heroSection_paragraph}>
          Get your daily essentials, fresh produce, and favorite snacks delivered right to your doorstep before you even finish making tea.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
