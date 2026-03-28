import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch, FiX, FiMapPin, FiNavigation } from "react-icons/fi";
import { getDatabase, ref, onValue } from "firebase/database";
import styles from "./navbar.module.css";
import logo from "../assets/logo.png";
import { useCartStore } from "../store/useCartStore";
import localProducts from "../data/products";
import { useLocationStore } from "../store/useLocationStore";
import { detectAndSaveLocation, DELIVERY_RADIUS_KM } from "../utils/locationService";

const Navbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [firebaseProducts, setFirebaseProducts] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const { shortAddress, inZone, detecting, distanceKm, clearLocation } = useLocationStore();

  const handleDetectLocation = async () => {
    try {
      await detectAndSaveLocation();
    } catch (err) {
      console.warn("Location error:", err?.message);
    }
  };

  // Load Firebase products once
  useEffect(() => {
    const db = getDatabase();
    const unsub = onValue(ref(db, "products"), (snap) => {
      const data = snap.val();
      if (!data) return;
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val, source: "firebase" }));
      setFirebaseProducts(list);
    });
    return () => unsub();
  }, []);

  // 🔥 Zustand — always call hooks unconditionally
  const cart = useCartStore((state) => state.cart);
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);

  const FREE_DELIVERY = 100;
  const DELIVERY_FEE = 20;
  const subtotal = totalPrice;
  const isFreeDelivery = subtotal >= FREE_DELIVERY;
  const deliveryCharge = isFreeDelivery ? 0 : DELIVERY_FEE;
  const grandTotal = subtotal + deliveryCharge;
  const remaining = FREE_DELIVERY - subtotal;
  const progress = Math.min((subtotal / FREE_DELIVERY) * 100, 100);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search logic — merge Firebase + local products
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setShowDropdown(false); return; }

    const allProducts = [
      ...firebaseProducts,
      ...localProducts.map(p => ({ ...p, id: `local-${p.id}`, source: "local" })),
    ];

    const matched = allProducts
      .filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
      .slice(0, 6);

    setResults(matched);
    setShowDropdown(true); // always show — results or "no results" message
    setActiveIdx(-1);
  }, [query, firebaseProducts]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && results[activeIdx]) {
        handleSelect(results[activeIdx]);
      } else if (query.trim()) {
        navigate(`/all-products?search=${encodeURIComponent(query.trim())}`);
        setShowDropdown(false);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleSelect = (product) => {
    navigate(`/product-details/${product.id}`);
    setQuery("");
    setShowDropdown(false);
  };

  // Admin pages handle their own layout via AdminLayout.jsx
  if (isAdminRoute) return null;

  return (
    <header
      className={`${styles.navbarWrapper} ${isScrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.container}>
        <nav className={styles.navbar}>
          {/* LEFT GROUP: Logo + Location */}
          <div className={styles.navLeft}>
            <Link to="/" className={styles.logo}>
              <img src={logo} alt="Zui Quick Mart" />
            </Link>

            {/* LOCATION PILL */}
            <button
              onClick={shortAddress ? clearLocation : handleDetectLocation}
              title={shortAddress ? `${distanceKm} km from store — tap to reset` : "Detect your location"}
              className={styles.locationPill}
              style={{
                background: inZone === false ? "#fef2f2" : inZone === true ? "#f0fdf4" : "#f8fafc",
                border: `1.5px solid ${inZone === false ? "#fca5a5" : inZone === true ? "#86efac" : "#e2e8f0"}`,
              }}
            >
              {detecting
                ? <FiNavigation size={11} color="#22c55e" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />
                : <FiMapPin size={11} color={inZone === false ? "#ef4444" : inZone === true ? "#22c55e" : "#94a3b8"} style={{ flexShrink: 0 }} />
              }
              <span style={{ color: inZone === false ? "#dc2626" : inZone === true ? "#15803d" : "#64748b" }}>
                {detecting ? "Detecting..." : shortAddress || "Set location"}
              </span>
            </button>
          </div>

          {/* SEARCH — desktop only (inline in navbar row) */}
          <div className={`${styles.searchWrapper} ${styles.navSearchDesktop}`} ref={searchRef}>
            <FiSearch className={styles.searchIcon} />
            <input
              placeholder="Search groceries..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setShowDropdown(true)}
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setShowDropdown(false); }}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}
              >
                <FiX size={16} />
              </button>
            )}

            {/* DROPDOWN */}
            {showDropdown && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                zIndex: 2000,
                overflow: "hidden",
                border: "1px solid #f1f5f9",
              }}>
                {results.length === 0 ? (
                  <div style={{ padding: "24px 16px", textAlign: "center" }}>
                    <p style={{ fontSize: 28, margin: "0 0 8px" }}>🔍</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
                      No results for "{query}"
                    </p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                      Try searching "tomato", "milk" or "rice"
                    </p>
                  </div>
                ) : (
                  <>
                    {results.map((product, i) => (
                      <div
                        key={product.id}
                        onMouseDown={() => handleSelect(product)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 14px",
                          cursor: "pointer",
                          background: i === activeIdx ? "#f0fdf4" : "#fff",
                          borderBottom: i < results.length - 1 ? "1px solid #f8fafc" : "none",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={() => setActiveIdx(i)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0, background: "#f3f4f6" }}
                          onError={e => { e.target.style.display = "none"; }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
                            {product.name}
                          </p>
                          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{product.category}</p>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#22c55e", flexShrink: 0 }}>
                          ₹{product.price}
                        </span>
                      </div>
                    ))}
                    <div
                      onMouseDown={() => { navigate(`/all-products?search=${encodeURIComponent(query)}`); setShowDropdown(false); setQuery(""); }}
                      style={{
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "#22c55e",
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "center",
                        background: "#f8fafc",
                      }}
                    >
                      See all results for "{query}" →
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className={styles.actions}>
            {/* <Link
              to="/admin/login"
              className={styles.signIn}
            >
              <FiUser />
              <span>Sign In</span>
            </Link> */}

            <button
              className={styles.cart}
              onClick={openCart}
            >
              <FiShoppingCart />
              {totalItems > 0 && (
                <span className={styles.badge}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE SEARCH ROW — second row, hidden on desktop */}
      <div className={styles.searchRow} ref={searchRef}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            placeholder="Search groceries..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setShowDropdown(true)}
            autoComplete="off"
          />
          {query && (
            <button onClick={() => { setQuery(""); setShowDropdown(false); }}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
              <FiX size={14} />
            </button>
          )}
          {/* Mobile dropdown */}
          {showDropdown && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 2000, overflow: "hidden", border: "1px solid #f1f5f9" }}>
              {results.length === 0 ? (
                <div style={{ padding: "20px 16px", textAlign: "center" }}>
                  <p style={{ fontSize: 28, margin: "0 0 6px" }}>🔍</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" }}>No results for "{query}"</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Try "tomato", "milk" or "rice"</p>
                </div>
              ) : (
                <>
                  {results.map((product, i) => (
                    <div key={product.id} onMouseDown={() => handleSelect(product)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", background: i === activeIdx ? "#f0fdf4" : "#fff", borderBottom: i < results.length - 1 ? "1px solid #f8fafc" : "none" }}
                      onMouseEnter={() => setActiveIdx(i)}>
                      <img src={product.image} alt={product.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</p>
                        <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{product.category}</p>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", flexShrink: 0 }}>₹{product.price}</span>
                    </div>
                  ))}
                  <div onMouseDown={() => { navigate(`/all-products?search=${encodeURIComponent(query)}`); setShowDropdown(false); setQuery(""); }}
                    style={{ padding: "10px 14px", fontSize: 12, color: "#22c55e", fontWeight: 700, cursor: "pointer", textAlign: "center", background: "#f8fafc" }}>
                    See all results for "{query}" →
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* OUT OF ZONE BANNER */}
      {inZone === false && (
        <div style={{ background: "#fef2f2", borderTop: "1px solid #fecaca" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "6px 16px", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Outfit', sans-serif" }}>
            <FiMapPin size={12} color="#ef4444" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#dc2626", flex: 1, minWidth: 0 }}>
              {distanceKm} km away · Delivery within {DELIVERY_RADIUS_KM} km only
            </span>
            <button onClick={clearLocation} style={{ fontSize: 11, color: "#dc2626", background: "none", border: "1px solid #fca5a5", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 700, flexShrink: 0 }}>
              Change
            </button>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <>
          <div
            className={styles.overlay}
            onClick={closeCart}
          />

          <div className={styles.cartDrawer}>
            {/* HEADER */}
            <div className={styles.cartHeader}>
              <h3>Your Cart ({totalItems})</h3>
              <button onClick={closeCart}>✕</button>
            </div>

            {/* FREE DELIVERY */}
            <div className={styles.freeDelivery}>
              {isFreeDelivery ? (
                <p>🎉 Free Delivery Unlocked!</p>
              ) : (
                <p>
                  Add ₹{remaining} more for FREE delivery
                </p>
              )}

              <div className={styles.progressBar}>
                <div
                  className={styles.progress}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* BODY */}
            <div className={styles.cartBody}>
              {cart.length === 0 ? (
                <div className={styles.emptyCart}>
                  <h4>Cart is empty</h4>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className={styles.cartItem}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className={styles.itemInfo}>
                      <h4>{item.name}</h4>
                      <p>₹{item.price}</p>

                      <div className={styles.qtyBox}>
                        <button
                          onClick={() =>
                            decreaseQty(item.id)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            increaseQty(item.id)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className={styles.removeBtn}
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            {cart.length > 0 && (
              <div className={styles.cartFooter}>
                <div className={styles.priceDetails}>
                  <div className={styles.row}>
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className={styles.row}>
                    <span>Delivery</span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <span className={styles.free}>
                          FREE
                        </span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>

                  <div className={styles.divider}></div>

                  <div className={styles.rowTotal}>
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
                <button
                  className={styles.checkoutBtn}
                  onClick={() => {
                    closeCart();        // 👈 CLOSE CART
                    navigate("/checkout"); // 👈 GO TO PAGE
                  }}
                >
                  Checkout • ₹{grandTotal}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;