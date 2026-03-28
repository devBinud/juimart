import { useState, useEffect } from "react";
import styles from "./checkout.module.css";
import { useCartStore } from "../../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { saveOrder, listenOrder } from "../../firebase/orderService";
import { FiMapPin, FiNavigation, FiLoader, FiUser, FiHome } from "react-icons/fi";
import upiQR from "../../assets/qr.jpeg";
import { useLocationStore } from "../../store/useLocationStore";
import { detectAndSaveLocation, STORE_LOCATION, DELIVERY_RADIUS_KM } from "../../utils/locationService";

/* ── helpers ── */
const isValidIndianPhone = (p) => /^[6-9]\d{9}$/.test(p.replace(/\s/g, ""));

const Checkout = () => {
  const cart = useCartStore((s) => s.cart);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  // Pull saved location from store
  const savedAddress = useLocationStore((s) => s.address);
  const savedInZone  = useLocationStore((s) => s.inZone);
  const savedDist    = useLocationStore((s) => s.distanceKm);

  const FREE_DELIVERY_THRESHOLD = 100;
  const DELIVERY_FEE = 25;
  const subtotal = totalPrice;
  const hasItems = cart.length > 0;
  const isFreeDelivery = hasItems && subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryCharge = !hasItems || isFreeDelivery ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryCharge;

  const [form, setForm] = useState({
    name: "", phone: "", address: "",
    payment: "cod", paid: false, proof: null,
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const [outOfZone, setOutOfZone] = useState(savedInZone === false);
  const [distanceKm, setDistanceKm] = useState(savedDist);

  const [onlineStatus, setOnlineStatus] = useState("idle");
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [waitTimer, setWaitTimer] = useState(60);

  // Auto-fill address from saved location store
  useEffect(() => {
    if (savedAddress && !form.address) {
      setForm(f => ({ ...f, address: savedAddress }));
      setOutOfZone(savedInZone === false);
      setDistanceKm(savedDist);
    }
  }, [savedAddress]); // eslint-disable-line

  useEffect(() => { if (cart.length === 0) navigate("/"); }, [cart, navigate]);

  useEffect(() => {
    if (!pendingOrderId) return;
    const unsub = listenOrder(pendingOrderId, (order) => {
      if (!order) return;
      if (order.paymentStatus === "verified") setOnlineStatus("verified");
      else if (order.paymentStatus === "rejected") setOnlineStatus("rejected");
    });
    return () => unsub();
  }, [pendingOrderId]);

  useEffect(() => {
    if (onlineStatus !== "submitted") return;
    setWaitTimer(60);
    const iv = setInterval(() => setWaitTimer((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [onlineStatus]);

  /* ── Location detect — uses shared service + saves to store ── */
  const handleDetectLocation = async () => {
    setLocError("");
    setLocLoading(true);
    try {
      const result = await detectAndSaveLocation();
      setOutOfZone(!result.inZone);
      setDistanceKm(result.distanceKm);
      if (result.inZone) {
        setForm(f => ({ ...f, address: result.address }));
        setErrors(e => ({ ...e, address: "" }));
      }
    } catch (err) {
      if (err.code === 1) setLocError("Location permission denied. Please type your address.");
      else if (err.code === 2) setLocError("Location unavailable. Please type your address.");
      else if (err.code === 3) setLocError("Location timed out. Please try again.");
      else setLocError("Could not get location. Please type your address.");
    } finally {
      setLocLoading(false);
    }
  };

  /* ── Validation ── */
  const validate = () => {
    const err = {};
    const name = form.name.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (!name) err.name = "Full name is required";
    else if (name.length < 2) err.name = "Enter a valid name";

    if (!phone) err.phone = "Phone number is required";
    else if (!isValidIndianPhone(phone)) err.phone = "Enter a valid 10-digit Indian mobile number";

    if (!address) err.address = "Delivery address is required";
    else if (address.length < 10) err.address = "Please enter a complete address (min 10 chars)";

    if (outOfZone) err.address = `Sorry, we only deliver within ${DELIVERY_RADIUS_KM} km of ${STORE_LOCATION.name}.`;

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const buildOrder = (extra = {}) => ({
    id: "ORD" + Date.now(),
    items: cart,
    subtotal,
    delivery: deliveryCharge,
    total,
    customer: {
      name: form.name.trim(),
      phone: "+91" + form.phone.trim(),
      address: form.address.trim(),
    },
    date: new Date().toLocaleString(),
    createdAt: Date.now(),
    ...extra,
  });

  const handlePlaceOrder = async () => {
    if (placing) return;
    if (!validate()) return;
    setPlacing(true);
    const orderData = buildOrder({
      paymentMethod: form.payment === "cod" ? "cod" : "online",
      paymentStatus: form.payment === "cod" ? "cod" : "verified",
      orderStatus: "confirmed",
    });
    try {
      const key = await saveOrder(orderData);
      localStorage.setItem("latest-order", JSON.stringify({ ...orderData, firebaseKey: key }));
    } catch {
      localStorage.setItem("latest-order", JSON.stringify(orderData));
    }
    clearCart();
    navigate("/order-success");
  };

  const handleRetryPayment = () => {
    setOnlineStatus("idle");
    setPendingOrderId(null);
    setForm((f) => ({ ...f, paid: false, proof: null }));
  };

  const timerColor = waitTimer > 30 ? "#22c55e" : waitTimer > 10 ? "#f59e0b" : "#ef4444";

  const [shake, setShake] = useState(false);
  const [validationToast, setValidationToast] = useState("");

  const triggerShake = (errorObj) => {
    // Build a short summary message
    const msgs = Object.values(errorObj);
    setValidationToast(msgs[0]); // show first error
    setShake(true);
    setTimeout(() => setShake(false), 600);
    setTimeout(() => setValidationToast(""), 3000);
  };

  const handlePlaceOrderWithFeedback = async () => {
    if (placing) return;
    const valid = validate();
    if (!valid) {
      triggerShake(errors);
      const firstErr = document.querySelector('[data-error="true"]');
      if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    await handlePlaceOrder();
  };

  const renderButton = () => {
    if (form.payment === "cod") return (
      <button className={styles.btn} onClick={handlePlaceOrderWithFeedback} disabled={placing}
        style={{ opacity: placing ? 0.6 : 1, animation: shake ? "btnShake 0.5s ease" : "none" }}>
        {placing ? "Placing Order..." : "Place Order"}
      </button>
    );
    if (onlineStatus === "idle") return (
      <button className={styles.btn} disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
        Complete Payment Steps Above
      </button>
    );
    if (onlineStatus === "submitted") return (
      <button className={styles.btn} disabled style={{ opacity: 0.6, background: "#94a3b8" }}>
        ⏳ Awaiting Admin Verification...
      </button>
    );
    if (onlineStatus === "verified") return (
      <button className={styles.btn} onClick={handlePlaceOrderWithFeedback} disabled={placing}
        style={{ background: "#22c55e", opacity: placing ? 0.6 : 1, animation: shake ? "btnShake 0.5s ease" : "none" }}>
        {placing ? "Placing Order..." : "✅ Payment Verified — Place Order"}
      </button>
    );
    if (onlineStatus === "rejected") return (
      <button className={styles.btn} onClick={handleRetryPayment} style={{ background: "#ef4444" }}>
        🔄 Retry Payment
      </button>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Checkout</h2>
        <div className={styles.layout}>

          {/* ── LEFT ── */}
          <div className={styles.left}>

            {/* DELIVERY DETAILS */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📦 Delivery Details</h3>

              {/* Name */}
              <div className={styles.field}>
                <label>Full Name</label>
                <div style={inputWrap}>
                  <FiUser style={inputIcon} />
                  <input
                    data-error={!!errors.name}
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    style={{ paddingLeft: 38 }}
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                  />
                </div>
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>

              {/* Phone with +91 */}
              <div className={styles.field}>
                <label>Phone Number</label>
                <div style={inputWrap}>
                  <div style={prefixBox}>
                    <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1 }}>🇮🇳</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>+91</span>
                  </div>
                  <input
                    className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                    style={{ paddingLeft: 72, borderRadius: 10 }}
                    placeholder="98765 43210"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setForm({ ...form, phone: val });
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                  />
                </div>
                {errors.phone
                  ? <span className={styles.error}>{errors.phone}</span>
                  : form.phone.length === 10 && isValidIndianPhone(form.phone)
                    ? <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>✓ Valid number</span>
                    : form.phone.length > 0
                      ? <span style={{ fontSize: 12, color: "#94a3b8" }}>{10 - form.phone.length} digits remaining</span>
                      : null
                }
              </div>

              {/* Address with location detect */}
              <div className={styles.field}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>Delivery Address</label>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locLoading}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: locLoading ? "#f1f5f9" : "#f0fdf4",
                      border: "1.5px solid #bbf7d0",
                      color: "#16a34a", borderRadius: 8,
                      padding: "5px 10px", fontSize: 12, fontWeight: 700,
                      cursor: locLoading ? "not-allowed" : "pointer",
                      fontFamily: "'Outfit', sans-serif",
                      transition: "all 0.2s",
                    }}
                  >
                    {locLoading
                      ? <><FiLoader size={12} style={{ animation: "spin 1s linear infinite" }} /> Detecting...</>
                      : <><FiNavigation size={12} /> Use My Location</>
                    }
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <FiHome style={{ ...inputIcon, top: 14, transform: "none" }} />
                  <textarea
                    className={`${styles.input} ${errors.address ? styles.inputError : ""}`}
                    style={{ paddingLeft: 38, minHeight: 90, resize: "vertical" }}
                    placeholder="House No, Street, Landmark, City, Pincode"
                    value={form.address}
                    onChange={(e) => {
                      setForm({ ...form, address: e.target.value });
                      if (errors.address) setErrors({ ...errors, address: "" });
                      if (locError) setLocError("");
                    }}
                  />
                </div>
                {locError && (
                  <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                    <FiMapPin size={11} /> {locError}
                  </span>
                )}
                {errors.address && <span className={styles.error}>{errors.address}</span>}
                {!errors.address && !outOfZone && form.address.length > 0 && (
                  <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
                    ✓ Address looks good
                  </span>
                )}

                {/* ── OUT OF ZONE BANNER ── */}
                {outOfZone && (
                  <div style={{
                    marginTop: 10, padding: "14px 16px",
                    background: "#fef2f2", border: "1.5px solid #fecaca",
                    borderRadius: 12, fontFamily: "'Outfit', sans-serif",
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#dc2626", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 6 }}>
                      🚫 Outside Delivery Zone
                    </p>
                    <p style={{ fontSize: 13, color: "#7f1d1d", margin: "0 0 8px", lineHeight: 1.5 }}>
                      You're <strong>{distanceKm} km</strong> away. We currently deliver within <strong>{DELIVERY_RADIUS_KM} km</strong> of {STORE_LOCATION.name}.
                    </p>
                    <p style={{ fontSize: 12, color: "#b91c1c", margin: 0 }}>
                      📞 Call us to check if we can arrange delivery: <strong>+918638240878</strong>
                    </p>
                    <button
                      onClick={() => { setOutOfZone(false); setDistanceKm(null); setForm(f => ({ ...f, address: "" })); }}
                      style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: "#dc2626", background: "none", border: "1px solid #fca5a5", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
                      Enter address manually
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>💳 Payment Method</h3>

              <div
                className={`${styles.payOption} ${form.payment === "online" ? styles.active : ""}`}
                onClick={() => { if (onlineStatus === "idle") setForm({ ...form, payment: "online" }); }}
              >
                <div className={styles.radio}></div>
                <div>
                  <p>Pay Online (UPI / Card)</p>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Scan QR & upload screenshot</span>
                </div>
              </div>

              <div
                className={`${styles.payOption} ${form.payment === "cod" ? styles.active : ""}`}
                onClick={() => { if (onlineStatus === "idle") setForm({ ...form, payment: "cod", paid: false, proof: null }); }}
              >
                <div className={styles.radio}></div>
                <div>
                  <p>Cash on Delivery</p>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Pay when you receive</span>
                </div>
              </div>

              {/* ONLINE: QR + Upload */}
              {form.payment === "online" && onlineStatus === "idle" && (
                <div style={{ marginTop: 20, background: "#f8fafc", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  {/* Header */}
                  <div style={{ padding: "14px 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>📱</span>
                    <p style={{ fontWeight: 800, color: "#0f172a", margin: 0, fontSize: 15 }}>Scan & Pay</p>
                  </div>

                  {/* QR + Info side by side */}
                  <div style={{ display: "flex", gap: 16, padding: "14px 16px", alignItems: "flex-start" }}>
                    {/* QR image with shimmer loader */}
                    <div style={{ flexShrink: 0, position: "relative" }}>
                      <div style={{
                        width: 180, height: 180, borderRadius: 12,
                        border: "2px solid #e2e8f0", overflow: "hidden",
                        background: "#f1f5f9",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}>
                        <img
                          src={upiQR}
                          alt="UPI QR Code"
                          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                        />
                      </div>
                      <p style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", marginTop: 5, fontWeight: 600 }}>Scan with any UPI app</p>
                    </div>

                    {/* UPI details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ background: "#fff", borderRadius: 10, padding: "10px 12px", border: "1px solid #f1f5f9", marginBottom: 10 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>UPI ID</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", margin: 0, wordBreak: "break-all" }}>zuiquickmartcc@ucobank</p>
                      </div>
                      <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 12px", border: "1px solid #86efac" }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>Amount to Pay</p>
                        <p style={{ fontSize: 22, fontWeight: 800, color: "#15803d", margin: 0, letterSpacing: "-0.5px" }}>₹{total}</p>
                      </div>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: "8px 0 0", lineHeight: 1.4 }}>
                        Pay exactly ₹{total} and upload the screenshot below
                      </p>
                    </div>
                  </div>

                  {/* Upload section */}
                  <div style={{ padding: "0 16px 16px" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                      Upload Payment Screenshot <span style={{ color: "#ef4444" }}>*</span>
                    </p>

                    {/* Custom file upload */}
                    <label style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 14px", borderRadius: 10,
                      border: `2px dashed ${form.proof ? "#22c55e" : "#d1d5db"}`,
                      background: form.proof ? "#f0fdf4" : "#fff",
                      cursor: "pointer", transition: "all 0.2s",
                    }}>
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setUploading(true);
                          const reader = new FileReader();
                          reader.onloadend = () => { setForm((p) => ({ ...p, proof: reader.result })); setUploading(false); };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {uploading ? (
                        <span style={{ fontSize: 13, color: "#64748b" }}>⏳ Processing...</span>
                      ) : form.proof ? (
                        <>
                          <img src={form.proof} alt="proof" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "2px solid #22c55e", flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: 13, color: "#15803d", fontWeight: 700, margin: 0 }}>✅ Screenshot uploaded</p>
                            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Tap to change</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📸</div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: 0 }}>Tap to upload screenshot</p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>JPG, PNG supported</p>
                          </div>
                        </>
                      )}
                    </label>

                    <label style={{
                      display: "flex", alignItems: "center", gap: 8,
                      marginTop: 12, padding: 12, borderRadius: 10,
                      background: form.proof ? "#f0fdf4" : "#f8fafc",
                      border: `1px solid ${form.proof ? "#86efac" : "#e2e8f0"}`,
                      opacity: form.proof ? 1 : 0.5,
                      cursor: form.proof ? "pointer" : "not-allowed",
                    }}>
                      <input type="checkbox" checked={form.paid} disabled={!form.proof}
                        style={{ width: 16, height: 16, accentColor: "#22c55e" }}
                        onChange={async (e) => {
                          const checked = e.target.checked;
                          setForm({ ...form, paid: checked });
                          if (checked) {
                            if (!validate()) return;
                            const orderData = buildOrder({
                              paymentMethod: "online",
                              paymentStatus: "pending_verification",
                              paymentProof: form.proof,
                              orderStatus: "pending",
                            });
                            try {
                              const key = await saveOrder(orderData);
                              localStorage.setItem("latest-order", JSON.stringify({ ...orderData, firebaseKey: key }));
                              setPendingOrderId(key);
                            } catch {
                              localStorage.setItem("latest-order", JSON.stringify(orderData));
                            }
                            setOnlineStatus("submitted");
                          }
                        }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>I have completed the payment</span>
                      {!form.proof && <span style={{ fontSize: 11, color: "#ef4444" }}>(upload screenshot first)</span>}
                    </label>
                  </div>
                </div>
              )}

              {/* WAITING */}
              {form.payment === "online" && onlineStatus === "submitted" && (
                <div style={{ marginTop: 20, textAlign: "center", padding: "24px 20px", background: "#fffbeb", borderRadius: 12, border: "1px solid #fcd34d" }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>⏳</p>
                  <p style={{ fontWeight: 700, fontSize: 16, color: "#92400e" }}>Waiting for admin verification</p>
                  <p style={{ fontSize: 13, color: "#b45309", marginTop: 4, marginBottom: 20 }}>Your screenshot has been submitted.</p>
                  <div style={{ fontSize: 48, fontWeight: 800, color: timerColor, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{waitTimer}</div>
                  <p style={{ fontSize: 12, color: "#92400e", marginBottom: 12 }}>seconds remaining</p>
                  <div style={{ height: 8, background: "#fde68a", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ width: `${(waitTimer / 60) * 100}%`, height: "100%", background: timerColor, borderRadius: 10, transition: "width 1s linear, background 0.5s" }} />
                  </div>
                  {waitTimer === 0 && <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 600 }}>📞 Contact: <b>+91 9101038129</b></p>}
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 10 }}>This page updates automatically</p>
                </div>
              )}

              {/* VERIFIED */}
              {form.payment === "online" && onlineStatus === "verified" && (
                <div style={{ marginTop: 20, textAlign: "center", padding: 20, background: "#f0fdf4", borderRadius: 12, border: "1px solid #86efac" }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>✅</p>
                  <p style={{ fontWeight: 700, fontSize: 16, color: "#15803d" }}>Payment Verified!</p>
                  <p style={{ fontSize: 13, color: "#166534", marginTop: 4 }}>Admin confirmed your payment. Click below to place your order.</p>
                </div>
              )}

              {/* REJECTED */}
              {form.payment === "online" && onlineStatus === "rejected" && (
                <div style={{ marginTop: 20, textAlign: "center", padding: 20, background: "#fef2f2", borderRadius: 12, border: "1px solid #fecaca" }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>❌</p>
                  <p style={{ fontWeight: 700, fontSize: 16, color: "#dc2626" }}>Payment Rejected</p>
                  <p style={{ fontSize: 13, color: "#b91c1c", marginTop: 4, marginBottom: 12 }}>Please retry with a clear screenshot.</p>
                  <p style={{ fontSize: 13, color: "#6b7280" }}>Need help? Call: <b style={{ color: "#0f172a" }}>+91 8638240878</b></p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT — ORDER SUMMARY ── */}
          <div className={styles.right}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🧾 Order Summary</h3>
              {cart.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemLeft}>
                    <img src={item.image} alt={item.name} className={styles.itemImg} />
                    <div>
                      <p>{item.name}</p>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <p>₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className={styles.divider}></div>
              <div className={styles.row}><span>Subtotal</span><span>₹{subtotal}</span></div>
              {hasItems && (
                <div className={styles.row}>
                  <span>Delivery Fee</span>
                  <span>{isFreeDelivery ? <span style={{ color: "#22c55e", fontWeight: 600 }}>FREE</span> : `₹${DELIVERY_FEE}`}</span>
                </div>
              )}
              <div className={styles.total}><span>Total to Pay</span><span>₹{total}</span></div>
              {renderButton()}
              <p className={styles.secure}>🔒 Secure checkout by Zui Quick Mart</p>
            </div>
          </div>

        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes btnShake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-8px); }
          30%      { transform: translateX(8px); }
          45%      { transform: translateX(-6px); }
          60%      { transform: translateX(6px); }
          75%      { transform: translateX(-3px); }
          90%      { transform: translateX(3px); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Validation toast */}
      {validationToast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1e293b", color: "#fff",
          padding: "12px 20px", borderRadius: 14,
          fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          zIndex: 99999, whiteSpace: "nowrap",
          animation: "toastIn 0.3s ease",
          display: "flex", alignItems: "center", gap: 8,
          borderLeft: "4px solid #ef4444",
        }}>
          ⚠️ {validationToast}
        </div>
      )}
    </div>
  );
};

/* ── inline style helpers ── */
const inputWrap = { position: "relative" };
const inputIcon = {
  position: "absolute", left: 12, top: "50%",
  transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none",
};
const prefixBox = {
  position: "absolute", left: 0, top: 0, bottom: 0,
  width: 64, display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  borderRight: "1.5px solid #e2e8f0", gap: 1,
  pointerEvents: "none",
};

export default Checkout;
