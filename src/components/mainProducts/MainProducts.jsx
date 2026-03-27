import React, { useState, useMemo, useRef, useEffect } from "react";
import ProductCard from "./ProductCard";
import products from "../../data/products";
import { FiChevronDown, FiCheck, FiSliders } from "react-icons/fi";

const SORT_OPTIONS = [
  { value: "default",    label: "Default" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name_asc",   label: "Name: A → Z" },
  { value: "discount",   label: "Best Discount" },
];

const MainProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  const categories = useMemo(() => {
    const unique = [];
    products.forEach((p) => {
      if (!unique.find((c) => c.slug === p.categorySlug))
        unique.push({ name: p.category, slug: p.categorySlug });
    });
    return [{ name: "All", slug: "all" }, ...unique];
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      selectedCategory === "all" || p.categorySlug === selectedCategory
    );
    if (sortBy === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "name_asc")   list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "discount")   list = [...list].sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return list;
  }, [selectedCategory, sortBy]);

  const activeLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px", fontFamily: "'Outfit', sans-serif" }}>

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", margin: 0 }}>All Products</h2>
          <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 3, marginBottom: 0 }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* SORT DROPDOWN */}
        <div ref={sortRef} style={{ position: "relative" }}>
          <button
            onClick={() => setSortOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 16px",
              background: sortBy !== "default" ? "#f0fdf4" : "#fff",
              border: `1.5px solid ${sortBy !== "default" ? "#86efac" : "#e2e8f0"}`,
              borderRadius: 50, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              color: sortBy !== "default" ? "#15803d" : "#374151",
              transition: "all 0.2s", whiteSpace: "nowrap",
              boxShadow: sortOpen ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <FiSliders size={13} />
            {sortBy !== "default" ? activeLabel : "Sort By"}
            <FiChevronDown size={13} style={{ transition: "transform 0.25s", transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>

          {/* DROPDOWN */}
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            background: "#fff", borderRadius: 16,
            boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
            border: "1px solid #f1f5f9", zIndex: 1000, minWidth: 210,
            overflow: "hidden",
            maxHeight: sortOpen ? 400 : 0,
            opacity: sortOpen ? 1 : 0,
            transform: sortOpen ? "translateY(0)" : "translateY(-8px)",
            transition: "max-height 0.25s ease, opacity 0.2s ease, transform 0.2s ease",
            pointerEvents: sortOpen ? "all" : "none",
          }}>
            {SORT_OPTIONS.map((opt, i) => (
              <div key={opt.value}
                onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 16px", cursor: "pointer",
                  background: sortBy === opt.value ? "#f0fdf4" : "#fff",
                  fontSize: 13, fontWeight: sortBy === opt.value ? 700 : 500,
                  color: sortBy === opt.value ? "#15803d" : "#374151",
                  borderBottom: i < SORT_OPTIONS.length - 1 ? "1px solid #f8fafc" : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (sortBy !== opt.value) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (sortBy !== opt.value) e.currentTarget.style.background = "#fff"; }}
              >
                {opt.label}
                {sortBy === opt.value && <FiCheck size={14} color="#22c55e" strokeWidth={3} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 24, scrollbarWidth: "none" }}>
        {categories.map((cat) => (
          <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)}
            style={{
              padding: "8px 18px", borderRadius: 50, border: "none",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              whiteSpace: "nowrap", fontFamily: "'Outfit', sans-serif",
              flexShrink: 0, transition: "all 0.2s",
              background: selectedCategory === cat.slug ? "#22c55e" : "#f1f5f9",
              color: selectedCategory === cat.slug ? "#fff" : "#64748b",
              boxShadow: selectedCategory === cat.slug ? "0 4px 12px rgba(34,197,94,0.3)" : "none",
              transform: selectedCategory === cat.slug ? "translateY(-1px)" : "none",
            }}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="juimart-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 20 }}>
        {filtered.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .juimart-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
};

export default MainProducts;
