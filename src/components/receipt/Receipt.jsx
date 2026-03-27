import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import styles from "./receipt.module.css";
import logo from "../../assets/logo.png"; // adjust path

const Receipt = () => {
  const receiptRef = useRef();

  const order = JSON.parse(localStorage.getItem("latest-order"));

  if (!order) return <p>No order found</p>;

  // 🔥 DOWNLOAD PDF
  const handleDownload = () => {
    const element = receiptRef.current;

    const opt = {
      margin: 0.5,
      filename: `${order.id}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* 📄 RECEIPT */}
        <div ref={receiptRef} className={styles.card}>
          
          {/* 🖼️ LOGO */}
          <div className={styles.header}>
            <img src={logo} alt="Juimart" className={styles.logo} />
            <h2>Receipt</h2>
          </div>

          {/* ORDER INFO */}
          <div className={styles.section}>
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>Date:</b> {order.date}</p>
          </div>

          {/* CUSTOMER */}
          <div className={styles.section}>
            <p><b>Name:</b> {order.customer.name}</p>
            <p><b>Phone:</b> {order.customer.phone}</p>
            <p><b>Address:</b> {order.customer.address}</p>
          </div>

          {/* ITEMS */}
          <div className={styles.items}>
            {order.items.map((item) => (
              <div key={item.id} className={styles.item}>
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className={styles.total}>
            <p>Subtotal: ₹{order.subtotal}</p>
            <p>Delivery: ₹{order.delivery}</p>
            <h3>Total: ₹{order.total}</h3>
          </div>

          <p className={styles.footer}>
            Thank you for shopping with Juimart ❤️
          </p>
        </div>

        {/* 📥 DOWNLOAD BUTTON */}
        <button className={styles.downloadBtn} onClick={handleDownload}>
          Download PDF
        </button>

      </div>
    </div>
  );
};

export default Receipt;