import React, { useState } from 'react';
import styles from './productenquiry.module.css';
import { FaWhatsapp } from 'react-icons/fa';

const ProductEnquiry = () => {
  const [message, setMessage] = useState('');

  const whatsappNumber = '919101038129';

  const handleSendEnquiry = () => {
    if (!message.trim()) return;
    const link = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank');
  };

  return (
    <div className={styles.enquiryContainer}>
      <h2 className={styles.headingText}>
        Have Questions? Send a Product Enquiry
      </h2>

      <div className={styles.formPlaceholder}>
        <p className={styles.enquiryText}>
          Type your enquiry below and click the button to message us on WhatsApp.
        </p>
        <textarea
          className={styles.enquiryInput}
          rows={2}
          placeholder="Enter your enquiry here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className={styles.whatsappButton} onClick={handleSendEnquiry}>
          <FaWhatsapp className={styles.whatsappIcon} />
          Send Enquiry on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductEnquiry;
