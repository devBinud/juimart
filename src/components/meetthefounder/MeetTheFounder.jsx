import React from 'react';
import styles from './meetthefounder.module.css';

const MeetTheFounder = () => {
  return (
    <section className={styles.meetSection}>
      <div className={styles.content}>
        <h2 className={styles.heading}>Meet the Founder</h2>
        <p className={styles.text}>
          <strong className={styles.highlight}>Mrittika Naturals</strong> was founded by <strong>Dhiman Deka</strong>, a passionate changemaker with a deep commitment to <em>sustainability</em>, <em>rural empowerment</em>, and the <strong className={styles.highlight}>natural wealth of Northeast India</strong>.
        </p>
        <p className={styles.text}>
          An <em>engineering graduate</em> from the National Institute of Technology, Dhiman brings a solid background in <strong className={styles.highlight}>waste management</strong> and <em>environmental responsibility</em>. He is also a co-owner of a <strong>plastic waste recycling</strong> firm based in Guwahati, where he has worked extensively to build <em>sustainable solutions</em>.
        </p>
        <p className={styles.text}>
          His vision goes far beyond that — to <em>uplift farmers</em>, preserve <strong>traditional knowledge</strong>, and promote <strong className={styles.highlight}>natural products</strong> from the region. And so, <strong className={styles.highlight}>Mrittika Naturals</strong> was born.
        </p>
      </div>
    </section>
  );
};

export default MeetTheFounder;
