import React from 'react';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.3px' }}>{title}</h2>
    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8 }}>{children}</div>
  </div>
);

const PrivacyPolicy = () => (
  <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 36 }}>Last updated: March 2026</p>

      <div style={{ background: '#fff', borderRadius: 18, padding: '32px 28px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>

        <Section title="1. Information We Collect">
          <p>When you place an order or use our services, we collect:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Name, phone number, and delivery address</li>
            <li>Order history and payment method (COD or UPI)</li>
            <li>Device information and browser type for analytics</li>
            <li>Location data (only when you grant permission) to verify delivery zone</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul style={{ paddingLeft: 20 }}>
            <li>To process and deliver your orders</li>
            <li>To send order confirmations and delivery updates via WhatsApp</li>
            <li>To improve our services and app experience</li>
            <li>To verify payment and prevent fraud</li>
          </ul>
        </Section>

        <Section title="3. Data Sharing">
          <p>We do <strong>not</strong> sell, trade, or rent your personal information to third parties. Your data may be shared only with:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Delivery partners (name and address only)</li>
            <li>Firebase (Google) for secure data storage</li>
          </ul>
        </Section>

        <Section title="4. Data Security">
          <p>Your data is stored securely on Firebase with industry-standard encryption. Payment screenshots are stored temporarily for verification and deleted after processing.</p>
        </Section>

        <Section title="5. Location Data">
          <p>We request location access only to verify that your delivery address is within our 5 km delivery zone. We do not track your location continuously or share it with third parties.</p>
        </Section>

        <Section title="6. Cookies & Analytics">
          <p>We use basic analytics to understand how users interact with our app (device type, browser, pages visited). No personally identifiable information is linked to analytics data.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>You have the right to request deletion of your personal data. Contact us at <a href="mailto:support@zuiquickmart.co.in" style={{ color: '#22c55e' }}>support@zuiquickmart.co.in</a> or WhatsApp us at +91 863 824 0878.</p>
        </Section>

        <Section title="8. Contact">
          <p>For any privacy-related concerns, reach us at:<br />
            📧 support@zuiquickmart.co.in<br />
            📞 +91 863 824 0878<br />
            📍 Near Royal Global University, Guwahati, Assam 781035
          </p>
        </Section>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
