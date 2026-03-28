import React from 'react';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.3px' }}>{title}</h2>
    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8 }}>{children}</div>
  </div>
);

const TermsConditions = () => (
  <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Terms & Conditions</h1>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 36 }}>Last updated: March 2026</p>

      <div style={{ background: '#fff', borderRadius: 18, padding: '32px 28px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>

        <Section title="1. Acceptance of Terms">
          <p>By using Zui Quick Mart's website or placing an order, you agree to these Terms & Conditions. If you do not agree, please do not use our services.</p>
        </Section>

        <Section title="2. Delivery Policy">
          <ul style={{ paddingLeft: 20 }}>
            <li>We deliver within a <strong>5 km radius</strong> of Royal Global University, Guwahati</li>
            <li>Estimated delivery time is <strong>15–20 minutes</strong> from order confirmation</li>
            <li>Delivery times may vary during peak hours, bad weather, or public holidays</li>
            <li>Orders outside our delivery zone will not be processed</li>
          </ul>
        </Section>

        <Section title="3. Pricing & Payment">
          <ul style={{ paddingLeft: 20 }}>
            <li>All prices are in Indian Rupees (₹) and inclusive of applicable taxes</li>
            <li>We accept Cash on Delivery (COD) and UPI payments</li>
            <li>For UPI payments, orders are confirmed only after admin verification of the payment screenshot</li>
            <li>We reserve the right to change prices without prior notice</li>
          </ul>
        </Section>

        <Section title="4. Order Cancellation">
          <ul style={{ paddingLeft: 20 }}>
            <li>Orders can be cancelled before they are confirmed by our team</li>
            <li>Once an order is confirmed and dispatched, cancellation is not possible</li>
            <li>To cancel, contact us immediately via WhatsApp at +91 863 824 0878</li>
          </ul>
        </Section>

        <Section title="5. Product Availability">
          <p>All products are subject to availability. In case a product is out of stock after your order is placed, we will contact you to offer a substitute or refund.</p>
        </Section>

        <Section title="6. User Responsibilities">
          <ul style={{ paddingLeft: 20 }}>
            <li>Provide accurate delivery address and contact information</li>
            <li>Be available to receive the delivery at the provided address</li>
            <li>Do not place fraudulent or test orders</li>
          </ul>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>Zui Quick Mart is not liable for delays caused by factors beyond our control (traffic, weather, etc.). Our maximum liability is limited to the value of the order placed.</p>
        </Section>

        <Section title="8. Governing Law">
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Guwahati, Assam.</p>
        </Section>

        <Section title="9. Contact">
          <p>For any queries regarding these terms:<br />
            📧 support@zuiquickmart.co.in<br />
            📞 +91 863 824 0878
          </p>
        </Section>
      </div>
    </div>
  </div>
);

export default TermsConditions;
