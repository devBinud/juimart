import React from 'react';
import { FaWhatsapp, FaPhoneAlt, FaStore } from 'react-icons/fa';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.3px' }}>{title}</h2>
    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.8 }}>{children}</div>
  </div>
);

const ReturnPolicy = () => (
  <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Return & Refund Policy</h1>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 36 }}>Last updated: March 2026</p>

      {/* Quick summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 32 }}>
        {[
          { icon: '✅', title: 'Easy Returns', desc: 'Within 24 hours of delivery' },
          { icon: '💰', title: 'Full Refund', desc: 'For damaged or wrong items' },
          { icon: '📞', title: 'Contact First', desc: 'Reach us before returning' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ background: '#fff', borderRadius: 14, padding: '16px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: 28, margin: '0 0 8px' }}>{icon}</p>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{title}</p>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 18, padding: '32px 28px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>

        <Section title="1. Return Eligibility">
          <p>We accept returns in the following cases:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>You received a <strong>damaged or spoiled</strong> product</li>
            <li>You received the <strong>wrong item</strong> (different from what you ordered)</li>
            <li>The product is <strong>past its expiry date</strong></li>
            <li>The product is <strong>missing</strong> from your order</li>
          </ul>
          <div style={{ background: '#fef9c3', borderRadius: 10, padding: '12px 14px', marginTop: 12, border: '1px solid #fde047' }}>
            <p style={{ fontSize: 13, color: '#854d0e', margin: 0 }}>⚠️ Returns must be reported within <strong>24 hours</strong> of delivery with photo evidence.</p>
          </div>
        </Section>

        <Section title="2. Non-Returnable Items">
          <ul style={{ paddingLeft: 20 }}>
            <li>Perishable items (vegetables, fruits, dairy) once delivered in good condition</li>
            <li>Items that have been partially consumed</li>
            <li>Products damaged due to improper handling by the customer</li>
            <li>Items returned without prior approval from our team</li>
          </ul>
        </Section>

        <Section title="3. How to Initiate a Return">
          <p>To initiate a return, follow these steps:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {[
              { step: '1', text: 'Take a clear photo of the damaged/wrong item' },
              { step: '2', text: 'Contact our support team within 24 hours of delivery' },
              { step: '3', text: 'Share the photo and your order ID via WhatsApp or visit our store' },
              { step: '4', text: 'Our team will review and process your return/refund within 24–48 hours' },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#22c55e', color: '#fff', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step}</div>
                <p style={{ fontSize: 14, color: '#374151', margin: 0, paddingTop: 4 }}>{text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="4. Refund Process">
          <ul style={{ paddingLeft: 20 }}>
            <li><strong>COD orders:</strong> Refund will be given as store credit or cash on your next order</li>
            <li><strong>Online (UPI) orders:</strong> Refund will be processed back to your UPI account within 3–5 business days</li>
            <li>Refunds are processed only after the return is approved by our team</li>
          </ul>
        </Section>

        <Section title="5. Contact for Returns">
          <p style={{ marginBottom: 16 }}>You can reach us through any of the following:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="https://wa.me/91863 824 0878" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#f0fdf4', borderRadius: 12, border: '1.5px solid #86efac', textDecoration: 'none' }}>
              <FaWhatsapp size={20} color="#25d366" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#15803d', margin: 0 }}>WhatsApp Support</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>+91 863 824 0878 — Fastest response</p>
              </div>
            </a>
            <a href="tel:+918638240878"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#eff6ff', borderRadius: 12, border: '1.5px solid #bfdbfe', textDecoration: 'none' }}>
              <FaPhoneAlt size={18} color="#3b82f6" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8', margin: 0 }}>Call Us</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>+91 8638240878 — Mon–Sun, 7AM–10PM</p>
              </div>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fff7ed', borderRadius: 12, border: '1.5px solid #fdba74' }}>
              <FaStore size={18} color="#f97316" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#c2410c', margin: 0 }}>Visit Our Store</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Near Royal Global University, Guwahati, Assam 781035</p>
              </div>
            </div>
          </div>
        </Section>

      </div>
    </div>
  </div>
);

export default ReturnPolicy;
