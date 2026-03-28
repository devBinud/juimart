import React, { useEffect, useState, useMemo } from 'react';
import { listenOrders, updateOrder, deleteOrder } from '../../firebase/orderService';
import { AdminPage, PageHeader, Card, StatusBadge } from './AdminLayout';
import { FiSearch, FiX, FiChevronDown, FiChevronUp, FiDownload, FiFileText, FiTrash2, FiPrinter } from 'react-icons/fi';
import './admin.css';

const FILTERS = ['All', 'COD', 'Online', 'Pending', 'Verified', 'Delivered', 'Cancelled'];
const PER_PAGE = 15;


const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [screenshotModal, setScreenshotModal] = useState(null);
  const [page, setPage] = useState(1);
  const [newCount, setNewCount] = useState(0);
  const prevCountRef = React.useRef(0);

  useEffect(() => {
    const unsub = listenOrders((data) => {
      setOrders(data);
      setLoading(false);
      // Show "new orders" badge if count increased
      if (prevCountRef.current > 0 && data.length > prevCountRef.current) {
        setNewCount(data.length - prevCountRef.current);
        setTimeout(() => setNewCount(0), 5000);
      }
      prevCountRef.current = data.length;
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.id?.toLowerCase().includes(q) || o.customer?.name?.toLowerCase().includes(q) || o.customer?.phone?.includes(q);
    const matchFilter = filter === 'All' ? true
      : filter === 'COD' ? o.paymentMethod === 'cod'
      : filter === 'Online' ? o.paymentMethod === 'online'
      : filter === 'Pending' ? o.paymentStatus === 'pending_verification'
      : filter === 'Verified' ? o.paymentStatus === 'verified'
      : filter === 'Delivered' ? o.orderStatus === 'delivered'
      : filter === 'Cancelled' ? o.orderStatus === 'cancelled'
      : true;
    return matchSearch && matchFilter;
  }), [orders, search, filter]);

  const totalRevenue = useMemo(() => orders.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0), [orders]);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const exportCSV = () => {
    const rows = [['Order ID','Date','Customer','Phone','Items','Total','Payment','Status']];
    filtered.forEach(o => rows.push([o.id, o.date, o.customer?.name, o.customer?.phone, o.items?.map(i=>`${i.name}x${i.quantity}`).join('; '), o.total, o.paymentMethod, o.orderStatus]));
    const csv = rows.map(r => r.map(c => `"${c||''}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const handleDelete = (order) => {
    if (!window.confirm(`Delete order ${order.id?.slice(-10)}? This cannot be undone.`)) return;
    deleteOrder(order.firebaseKey).catch(() => alert('Delete failed'));
  };

  const printReceipt = async (order) => {
    const html2pdf = (await import('html2pdf.js')).default;

    // Convert logo to base64 so it embeds in the PDF
    const logoUrl = window.location.origin + '/logo192.png';
    let logoBase64 = '';
    try {
      const res = await fetch(logoUrl);
      const blob = await res.blob();
      logoBase64 = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (_) {}

    const el = document.createElement('div');
    el.style.cssText = 'font-family:Arial,sans-serif;padding:32px;max-width:480px;margin:0 auto;background:#fff;';
    el.innerHTML = `
      <!-- Header with logo -->
      <div style="text-align:center;margin-bottom:24px">
        ${logoBase64 ? `<img src="${logoBase64}" style="width:100px;height:auto;margin-bottom:10px;display:block;margin-left:auto;margin-right:auto;" alt="Zui Quick Mart"/>` : ''}
        <h2 style="margin:0;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px">Zui Quick Mart</h2>
        <p style="margin:4px 0 2px;font-size:13px;color:#64748b;font-weight:600">Order Receipt</p>
        <p style="margin:0;font-size:11px;color:#94a3b8">${order.date}</p>
      </div>

      <!-- Order + Customer info -->
      <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;margin-bottom:16px;font-size:12px;line-height:1.8">
        <div style="display:flex;justify-content:space-between;margin-bottom:2px">
          <span style="color:#94a3b8;font-weight:600">ORDER ID</span>
          <span style="color:#0f172a;font-weight:700">${order.id?.slice(-12) || order.id}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:2px">
          <span style="color:#94a3b8;font-weight:600">CUSTOMER</span>
          <span style="color:#0f172a">${order.customer?.name || ''}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:2px">
          <span style="color:#94a3b8;font-weight:600">PHONE</span>
          <span style="color:#0f172a">${order.customer?.phone || ''}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:2px">
          <span style="color:#94a3b8;font-weight:600">ADDRESS</span>
          <span style="color:#0f172a;text-align:right;max-width:260px">${order.customer?.address || ''}</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="color:#94a3b8;font-weight:600">PAYMENT</span>
          <span style="color:#0f172a">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (UPI)'}</span>
        </div>
      </div>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px">
        <thead>
          <tr style="border-bottom:2px solid #e2e8f0">
            <th style="text-align:left;padding:8px 0;color:#64748b;font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:0.5px">Item</th>
            <th style="text-align:center;padding:8px 0;color:#64748b;font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:0.5px">Qty</th>
            <th style="text-align:right;padding:8px 0;color:#64748b;font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:0.5px">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items?.map(i => `
            <tr style="border-bottom:1px solid #f1f5f9">
              <td style="padding:8px 0;color:#0f172a">${i.name}</td>
              <td style="padding:8px 0;text-align:center;color:#64748b">×${i.quantity}</td>
              <td style="padding:8px 0;text-align:right;color:#0f172a;font-weight:600">₹${i.price * i.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#64748b;margin-bottom:6px"><span>Subtotal</span><span>₹${order.subtotal}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#64748b;margin-bottom:10px"><span>Delivery</span><span>${order.delivery === 0 ? 'FREE' : '₹' + order.delivery}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:#0f172a;border-top:1px solid #e2e8f0;padding-top:10px"><span>Total</span><span style="color:#22c55e">₹${order.total}</span></div>
      </div>

      <!-- Footer -->
      <p style="text-align:center;font-size:11px;color:#94a3b8;margin:0">Thank you for shopping with Zui Quick Mart! ❤️</p>
      <p style="text-align:center;font-size:10px;color:#cbd5e1;margin:4px 0 0">For support: +91 9101038129</p>
    `;

    html2pdf().set({
      margin: [8, 8, 8, 8],
      filename: `receipt-${order.id?.slice(-10)}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
    }).from(el).save();
  };

  const exportPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const el = document.createElement('div');
    el.style.fontFamily = 'Arial, sans-serif';
    el.style.padding = '20px';
    el.innerHTML = `
      <h2 style="color:#0f172a;margin-bottom:4px">Zui Quick Mart — Orders Report</h2>
      <p style="color:#64748b;font-size:12px;margin-bottom:16px">Generated: ${new Date().toLocaleString()} · ${filtered.length} orders</p>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="background:#f1f5f9">
            ${['Order ID','Date','Customer','Phone','Items','Total','Payment','Status'].map(h=>`<th style="padding:8px;text-align:left;border-bottom:2px solid #e2e8f0">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${filtered.map((o,i)=>`
            <tr style="background:${i%2===0?'#fff':'#f8fafc'}">
              <td style="padding:7px 8px;border-bottom:1px solid #f1f5f9">${o.id?.slice(-10)||''}</td>
              <td style="padding:7px 8px;border-bottom:1px solid #f1f5f9">${o.date||''}</td>
              <td style="padding:7px 8px;border-bottom:1px solid #f1f5f9">${o.customer?.name||''}</td>
              <td style="padding:7px 8px;border-bottom:1px solid #f1f5f9">${o.customer?.phone||''}</td>
              <td style="padding:7px 8px;border-bottom:1px solid #f1f5f9">${o.items?.map(i=>`${i.name}×${i.quantity}`).join(', ')||''}</td>
              <td style="padding:7px 8px;border-bottom:1px solid #f1f5f9;font-weight:bold;color:#22c55e">₹${o.total||0}</td>
              <td style="padding:7px 8px;border-bottom:1px solid #f1f5f9">${o.paymentMethod==='cod'?'COD':'Online'}</td>
              <td style="padding:7px 8px;border-bottom:1px solid #f1f5f9">${o.orderStatus||''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p style="margin-top:16px;font-size:11px;color:#64748b">Total Revenue (excl. cancelled): ₹${totalRevenue}</p>
    `;
    html2pdf().set({ margin:10, filename:`orders-${new Date().toISOString().slice(0,10)}.pdf`, html2canvas:{scale:2}, jsPDF:{unit:'mm',format:'a4',orientation:'landscape'} }).from(el).save();
  };

  return (
    <AdminPage>
      {screenshotModal && (
        <div className="admin-modal-overlay" onClick={() => setScreenshotModal(null)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <span style={{ fontWeight: 700, fontSize: 15 }}>Payment Screenshot</span>
              <button className="admin-close-btn" onClick={() => setScreenshotModal(null)}>✕</button>
            </div>
            <img src={screenshotModal} alt="proof" style={{ width: '100%', borderRadius: 12, maxHeight: '70vh', objectFit: 'contain' }} />
          </div>
        </div>
      )}

      <PageHeader title="All Orders" subtitle={`${orders.length} total · ₹${totalRevenue} revenue`}
        action={
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={exportPDF} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'#eff6ff', border:'1.5px solid #bfdbfe', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', color:'#1d4ed8', fontFamily:"'Outfit',sans-serif" }}><FiFileText size={13}/> PDF</button>
            <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'#f0fdf4', border:'1.5px solid #86efac', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', color:'#15803d', fontFamily:"'Outfit',sans-serif" }}><FiDownload size={13}/> CSV</button>
          </div>
        }
      />

      {/* New orders live banner */}
      {newCount > 0 && (
        <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1.5px solid #86efac', borderRadius:12, padding:'10px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10, fontFamily:"'Outfit',sans-serif", animation:'slideUp 0.3s ease' }}>
          <span style={{ fontSize:18 }}>🔔</span>
          <span style={{ fontSize:13, fontWeight:700, color:'#15803d' }}>{newCount} new order{newCount>1?'s':''} just came in!</span>
          <button onClick={() => { setFilter('All'); setPage(1); setNewCount(0); }} style={{ marginLeft:'auto', fontSize:12, fontWeight:700, color:'#15803d', background:'none', border:'1px solid #86efac', borderRadius:6, padding:'3px 10px', cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>View</button>
        </div>
      )}

      {/* TOOLBAR */}
      <Card style={{ marginBottom: 16, padding: '14px 18px' }}>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <FiSearch style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} />
            <input placeholder="Search by name, phone or order ID..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width:'100%', padding:'9px 36px 9px 36px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:13, fontFamily:"'Outfit',sans-serif", outline:'none', boxSizing:'border-box' }}
              onFocus={e => e.target.style.borderColor='#22c55e'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
            {search && <button onClick={() => setSearch('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}><FiX size={13}/></button>}
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                style={{ padding:'6px 14px', borderRadius:50, border:'none', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif", background:filter===f?'#22c55e':'#f1f5f9', color:filter===f?'#fff':'#64748b' }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <p style={{ fontSize:12, color:'#94a3b8', margin:'10px 0 0' }}>Showing {filtered.length} order{filtered.length!==1?'s':''}</p>
      </Card>

      {/* TABLE */}
      <Card style={{ padding:0, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:24 }}>{[...Array(5)].map((_,i) => <div key={i} className="skeleton" style={{ height:48, borderRadius:8, marginBottom:8 }} />)}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <p style={{ fontSize:32, marginBottom:8 }}>📭</p>
            <p style={{ color:'#64748b', fontWeight:500, fontSize:14 }}>No orders found.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, fontFamily:"'Outfit',sans-serif" }}>
                <thead>
                  <tr style={{ background:'#f8fafc', borderBottom:'2px solid #f1f5f9' }}>
                    {['','Order ID','Date','Customer','Items','Total','Payment','Status','Actions'].map(h => (
                      <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((order, i) => (
                    <React.Fragment key={order.firebaseKey}>
                      <tr style={{ borderBottom:'1px solid #f1f5f9', background: expanded===order.id ? '#f8fafc' : i%2===0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding:'12px 8px 12px 14px', width:32 }}>
                          <button onClick={() => setExpanded(expanded===order.id ? null : order.id)}
                            style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex', padding:0 }}>
                            {expanded===order.id ? <FiChevronUp size={14}/> : <FiChevronDown size={14}/>}
                          </button>
                        </td>
                        <td style={{ padding:'12px 14px', fontWeight:700, color:'#0f172a', whiteSpace:'nowrap' }}>
                          <span style={{ background:'#f1f5f9', padding:'2px 8px', borderRadius:6, fontSize:12 }}>{order.id?.slice(-10)}</span>
                        </td>
                        <td style={{ padding:'12px 14px', color:'#64748b', whiteSpace:'nowrap', fontSize:12 }}>{order.date}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <p style={{ fontWeight:600, color:'#0f172a', margin:0 }}>{order.customer?.name}</p>
                          <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>{order.customer?.phone}</p>
                        </td>
                        <td style={{ padding:'12px 14px', color:'#64748b' }}>{order.items?.length} item{order.items?.length!==1?'s':''}</td>
                        <td style={{ padding:'12px 14px', fontWeight:800, color:'#22c55e', whiteSpace:'nowrap' }}>₹{order.total}</td>
                        <td style={{ padding:'12px 14px' }}><StatusBadge status={order.paymentMethod==='cod'?'cod':order.paymentStatus}/></td>
                        <td style={{ padding:'12px 14px' }}><StatusBadge status={order.orderStatus}/></td>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                            {order.paymentStatus==='pending_verification' && <>
                              <button onClick={() => updateOrder(order.firebaseKey,{paymentStatus:'verified',orderStatus:'confirmed'})} style={{ padding:'4px 10px', background:'#f0fdf4', border:'1px solid #86efac', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', color:'#15803d', fontFamily:"'Outfit',sans-serif" }}>✅</button>
                              <button onClick={() => updateOrder(order.firebaseKey,{paymentStatus:'rejected',orderStatus:'cancelled'})} style={{ padding:'4px 10px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', color:'#dc2626', fontFamily:"'Outfit',sans-serif" }}>❌</button>
                            </>}
                            {order.paymentMethod==='cod' && order.orderStatus!=='delivered' && order.orderStatus!=='cancelled' && <>
                              {(order.orderStatus==='placed'||order.orderStatus==='pending'||!order.orderStatus) && (
                                <button onClick={() => updateOrder(order.firebaseKey,{orderStatus:'confirmed'})} style={{ padding:'4px 10px', background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', color:'#1d4ed8', fontFamily:"'Outfit',sans-serif" }}>📦 Confirm</button>
                              )}
                              {order.orderStatus==='confirmed' && (
                                <button onClick={() => updateOrder(order.firebaseKey,{orderStatus:'shipped'})} style={{ padding:'4px 10px', background:'#f5f3ff', border:'1px solid #c4b5fd', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', color:'#6d28d9', fontFamily:"'Outfit',sans-serif" }}>🚚 Ship</button>
                              )}
                              {(order.orderStatus==='confirmed'||order.orderStatus==='shipped') && (
                                <button onClick={() => updateOrder(order.firebaseKey,{orderStatus:'delivered'})} style={{ padding:'4px 10px', background:'#f0fdf4', border:'1px solid #86efac', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', color:'#15803d', fontFamily:"'Outfit',sans-serif" }}>🎉 Deliver</button>
                              )}
                            </>}
                            <button onClick={() => printReceipt(order)} title="Generate Receipt" style={{ padding:'4px 8px', background:'#f5f3ff', border:'1px solid #c4b5fd', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', color:'#6d28d9', fontFamily:"'Outfit',sans-serif" }}><FiPrinter size={11}/></button>
                            <button onClick={() => handleDelete(order)} title="Delete Order" style={{ padding:'4px 8px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', color:'#dc2626', fontFamily:"'Outfit',sans-serif" }}><FiTrash2 size={11}/></button>
                          </div>
                        </td>
                      </tr>
                      {expanded===order.id && (
                        <tr style={{ background:'#f8fafc' }}>
                          <td colSpan={9} style={{ padding:'0 14px 16px 46px' }}>
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, paddingTop:12 }}>
                              <div>
                                <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Customer</p>
                                <p style={{ fontSize:13, color:'#374151', marginBottom:3 }}>{order.customer?.name}</p>
                                <p style={{ fontSize:13, color:'#374151', marginBottom:3 }}>📞 {order.customer?.phone}</p>
                                <p style={{ fontSize:13, color:'#374151' }}>📍 {order.customer?.address}</p>
                              </div>
                              <div>
                                <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Items</p>
                                {order.items?.map((item,j) => (
                                  <div key={j} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#374151', marginBottom:4 }}>
                                    <span>{item.name} ×{item.quantity}</span>
                                    <span style={{ fontWeight:600 }}>₹{item.price*item.quantity}</span>
                                  </div>
                                ))}
                                <div style={{ borderTop:'1px solid #e2e8f0', marginTop:6, paddingTop:6 }}>
                                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#64748b', marginBottom:2 }}><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#64748b', marginBottom:2 }}><span>Delivery</span><span>₹{order.delivery}</span></div>
                                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:800, color:'#0f172a' }}><span>Total</span><span>₹{order.total}</span></div>
                                </div>
                              </div>
                              <div>
                                <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Payment</p>
                                <p style={{ fontSize:13, color:'#374151', marginBottom:6 }}>Method: <b>{order.paymentMethod==='cod'?'Cash on Delivery':'Online (UPI)'}</b></p>
                                {order.paymentProof && <img src={order.paymentProof} alt="proof" onClick={() => setScreenshotModal(order.paymentProof)} style={{ width:72, height:72, objectFit:'cover', borderRadius:8, border:'2px solid #e2e8f0', cursor:'pointer' }} />}
                              </div>
                              <div style={{ display:'flex', gap:8, marginTop:12, gridColumn:'1/-1' }}>
                                <button onClick={() => printReceipt(order)} style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:'#f5f3ff', border:'1.5px solid #c4b5fd', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', color:'#6d28d9', fontFamily:"'Outfit',sans-serif" }}>
                                  <FiPrinter size={12}/> Generate Receipt
                                </button>
                                <button onClick={() => handleDelete(order)} style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', color:'#dc2626', fontFamily:"'Outfit',sans-serif" }}>
                                  <FiTrash2 size={12}/> Delete Order
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 18px', borderTop:'1px solid #f1f5f9' }}>
                <span style={{ fontSize:12, color:'#94a3b8' }}>Page {page} of {totalPages}</span>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{ padding:'6px 14px', borderRadius:8, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:600, cursor:page===1?'not-allowed':'pointer', color:page===1?'#94a3b8':'#374151', fontFamily:"'Outfit',sans-serif" }}>← Prev</button>
                  <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding:'6px 14px', borderRadius:8, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:600, cursor:page===totalPages?'not-allowed':'pointer', color:page===totalPages?'#94a3b8':'#374151', fontFamily:"'Outfit',sans-serif" }}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </AdminPage>
  );
};

export default AllOrders;
