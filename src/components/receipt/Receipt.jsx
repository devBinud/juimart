import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Receipt = () => {
  const receiptRef = useRef();
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem("latest-order"));

  if (!order) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <p style={{ fontSize:36, marginBottom:12 }}>📭</p>
        <p style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>No order found</p>
        <button onClick={() => navigate("/")} style={{ marginTop:16, padding:"10px 24px", background:"#22c55e", color:"#fff", border:"none", borderRadius:50, fontWeight:700, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>Go Home</button>
      </div>
    </div>
  );

  const handleDownload = () => {
    html2pdf().set({
      margin: [8, 8, 8, 8],
      filename: `receipt-${order.id?.slice(-10)}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a5", orientation: "portrait" },
    }).from(receiptRef.current).save();
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", padding:"24px 16px", fontFamily:"'Outfit',sans-serif" }}>
      <div style={{ maxWidth:480, margin:"0 auto" }}>

        {/* Receipt card */}
        <div ref={receiptRef} style={{ background:"#fff", borderRadius:20, padding:"28px 24px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <img src={logo} alt="Zui Quick Mart" style={{ width:90, height:"auto", marginBottom:10 }} />
            <h2 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a", letterSpacing:"-0.4px" }}>Zui Quick Mart</h2>
            <p style={{ margin:"4px 0 2px", fontSize:13, color:"#64748b", fontWeight:600 }}>Order Receipt</p>
            <p style={{ margin:0, fontSize:11, color:"#94a3b8" }}>{order.date}</p>
          </div>

          {/* Order + Customer */}
          <div style={{ background:"#f8fafc", borderRadius:12, padding:"14px 16px", marginBottom:16, fontSize:12, lineHeight:1.9 }}>
            {[
              ["ORDER ID", order.id?.slice(-12) || order.id],
              ["CUSTOMER", order.customer?.name],
              ["PHONE", order.customer?.phone],
              ["ADDRESS", order.customer?.address],
              ["PAYMENT", order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (UPI)"],
            ].map(([label, value]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
                <span style={{ color:"#94a3b8", fontWeight:700, flexShrink:0 }}>{label}</span>
                <span style={{ color:"#0f172a", textAlign:"right" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, marginBottom:16 }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #e2e8f0" }}>
                {["Item","Qty","Price"].map((h,i) => (
                  <th key={h} style={{ padding:"8px 0", color:"#64748b", fontWeight:700, textTransform:"uppercase", fontSize:10, letterSpacing:"0.5px", textAlign: i===0?"left":i===1?"center":"right" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} style={{ borderBottom:"1px solid #f1f5f9" }}>
                  <td style={{ padding:"8px 0", color:"#0f172a" }}>{item.name}</td>
                  <td style={{ padding:"8px 0", textAlign:"center", color:"#64748b" }}>×{item.quantity}</td>
                  <td style={{ padding:"8px 0", textAlign:"right", color:"#0f172a", fontWeight:600 }}>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ background:"#f8fafc", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#64748b", marginBottom:6 }}><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#64748b", marginBottom:10 }}><span>Delivery</span><span>{order.delivery === 0 ? "FREE" : `₹${order.delivery}`}</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:800, color:"#0f172a", borderTop:"1px solid #e2e8f0", paddingTop:10 }}>
              <span>Total</span>
              <span style={{ color:"#22c55e" }}>₹{order.total}</span>
            </div>
          </div>

          {/* Footer */}
          <p style={{ textAlign:"center", fontSize:11, color:"#94a3b8", margin:0 }}>Thank you for shopping with Zui Quick Mart! ❤️</p>
          <p style={{ textAlign:"center", fontSize:10, color:"#cbd5e1", margin:"4px 0 0" }}>Support: +91 9101038129</p>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10, marginTop:16 }}>
          <button onClick={handleDownload} style={{ flex:1, padding:"13px", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", border:"none", borderRadius:14, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'Outfit',sans-serif", boxShadow:"0 4px 14px rgba(34,197,94,0.3)" }}>
            📥 Download PDF
          </button>
          <button onClick={() => navigate("/")} style={{ padding:"13px 18px", background:"#f1f5f9", color:"#374151", border:"none", borderRadius:14, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
