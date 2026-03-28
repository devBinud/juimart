import React, { useState } from 'react';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `*New Contact Message*\n\nName: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`;
    window.open(`https://wa.me/91863 824 0878?text=${encodeURIComponent(text)}`, '_blank');
    setSent(true);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 6, letterSpacing: '-0.5px' }}>Contact Us</h1>
        <p style={{ fontSize: 15, color: '#64748b', marginBottom: 36 }}>We're here to help. Reach out anytime.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <FaWhatsapp color="#25d366" size={20} />, label: 'WhatsApp', value: '+91 863 824 0878', href: 'https://wa.me/91863 824 0878' },
              { icon: <FaPhoneAlt color="#22c55e" size={18} />, label: 'Phone', value: '+91 8638240878', href: 'tel:+918638240878' },
              { icon: <FaEnvelope color="#3b82f6" size={18} />, label: 'Email', value: 'support@zuiquickmart.co.in', href: 'mailto:support@zuiquickmart.co.in' },
              { icon: <FaMapMarkerAlt color="#ef4444" size={18} />, label: 'Address', value: 'Near Royal Global University, Guwahati, Assam 781035', href: null },
            ].map(({ icon, label, value, href }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 3px' }}>{label}</p>
                  {href ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>{value}</a>
                    : <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{value}</p>}
                </div>
              </div>
            ))}

            <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '16px 18px', border: '1px solid #86efac' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#15803d', margin: '0 0 4px' }}>⚡ Delivery Hours</p>
              <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>Monday – Sunday: 7:00 AM – 10:00 PM</p>
              <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Delivery within 5 km of Royal Global University</p>
            </div>
          </div>

          {/* Contact form */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Message sent via WhatsApp!</p>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>We'll get back to you shortly.</p>
                <button onClick={() => setSent(false)} style={{ marginTop: 16, padding: '10px 24px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Send us a message</h3>
                {[
                  { label: 'Your Name', key: 'name', type: 'text', placeholder: 'Rahul Sharma' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>{label}</label>
                    <input type={type} required placeholder={placeholder} value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#22c55e'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 }}>Message</label>
                  <textarea required placeholder="How can we help you?" value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: 'none', boxSizing: 'border-box', height: 100, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = '#22c55e'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <button type="submit" style={{ padding: '12px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <FaWhatsapp size={16} /> Send via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>

        <style>{`@media(max-width:640px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
      </div>
    </div>
  );
};

export default ContactUs;
