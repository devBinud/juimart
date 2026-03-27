import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch, FiLogOut, FiGrid, FiX } from "react-icons/fi";
import { getDatabase, ref, onValue } from "firebase/database";
import styles from "./navbar.module.css";
import logo from "../assets/logo.png";
import { useCartStore } from "../store/useCartStore";
import localProducts from "../data/products";

const AdminTopbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminExpiry");
    navigate("/admin/login");
  };

  return (
    <header style={{
      width: "100%",
      background: "#0f172a",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{
        maxWidth: "100%",
        padding: "0 24px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* LEFT — Logo + label */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logo} alt="Juimart" style={{ height: 36 }} />
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FiGrid style={{ color: "#22c55e", fontSize: 14 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.3px" }}>
              Admin Panel
            </span>
          </div>
        </div>

        {/* RIGHT — Admin info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff",
            }}>A</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Admin</span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          >
            <FiLogOut style={{ fontSize: 14 }} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

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

  // Show clean admin topbar on all admin pages — AFTER all hooks
  if (isAdminRoute) return <AdminTopbar />;

  return (
    <header
      className={`${styles.navbarWrapper} ${isScrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.container}>
        <nav className={styles.navbar}>
          {/* LOGO */}
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="JMart" />
          </Link>

          {/* SEARCH */}
          <div className={styles.searchWrapper} ref={searchRef}>
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