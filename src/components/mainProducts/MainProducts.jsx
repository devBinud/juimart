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
    <div style={{ maxWidth: 1200, margin: "16px auto 24px", padding: "0 16px", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .mp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media(min-width: 600px)  { .mp-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
        @media(min-width: 900px)  { .mp-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
        @media(min-width: 1100px) { .mp-grid { grid-template-columns: repeat(5, 1fr); gap: 18px; } }
        .mp-cat-pill {
          padding: 6px 14px;
          border-radius: 50px;
          border: none;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          font-family: 'Outfit', sans-serif;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        @media(min-width: 600px) { .mp-cat-pill { padding: 8px 18px; font-size: 13px; } }
      `}</style>

      <div style={{ background: "#fff", borderRadius: 18, padding: "16px 14px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>

        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.3px", margin: 0 }}>All Products</h2>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, marginBottom: 0 }}>
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* SORT DROPDOWN */}
          <div ref={sortRef} style={{ position: "relative", flexShrink: 0 }}>
            <button onClick={() => setSortOpen(o => !o)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 12px",
              background: sortBy !== "default" ? "#f0fdf4" : "#f8fafc",
              border: `1.5px solid ${sortBy !== "default" ? "#86efac" : "#e2e8f0"}`,
              borderRadius: 50, fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              color: sortBy !== "default" ? "#15803d" : "#374151",
              whiteSpace: "nowrap",
            }}>
              <FiSliders size={12} />
              {sortBy !== "default" ? activeLabel : "Sort"}
              <FiChevronDown size={12} style={{ transition: "transform 0.2s", transform: sortOpen ? "rotate(180deg)" : "none" }} />
            </button>

            <div style={{
              position: "absolute", top: "calc(100% + 6px)", right: 0,
              background: "#fff", borderRadius: 14,
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              border: "1px solid #f1f5f9", zIndex: 1000, minWidth: 190,
              overflow: "hidden",
              maxHeight: sortOpen ? 400 : 0,
              opacity: sortOpen ? 1 : 0,
              transform: sortOpen ? "translateY(0)" : "translateY(-6px)",
              transition: "max-height 0.25s ease, opacity 0.2s ease, transform 0.2s ease",
              pointerEvents: sortOpen ? "all" : "none",
            }}>
              {SORT_OPTIONS.map((opt, i) => (
                <div key={opt.value} onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", cursor: "pointer",
                    background: sortBy === opt.value ? "#f0fdf4" : "#fff",
                    fontSize: 13, fontWeight: sortBy === opt.value ? 700 : 500,
                    color: sortBy === opt.value ? "#15803d" : "#374151",
                    borderBottom: i < SORT_OPTIONS.length - 1 ? "1px solid #f8fafc" : "none",
                  }}
                  onMouseEnter={e => { if (sortBy !== opt.value) e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseLeave={e => { if (sortBy !== opt.value) e.currentTarget.style.background = "#fff"; }}>
                  {opt.label}
                  {sortBy === opt.value && <FiCheck size={13} color="#22c55e" strokeWidth={3} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CATEGORY PILLS */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 16, scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)}
              className="mp-cat-pill"
              style={{
                background: selectedCategory === cat.slug ? "#22c55e" : "#f1f5f9",
                color: selectedCategory === cat.slug ? "#fff" : "#64748b",
                boxShadow: selectedCategory === cat.slug ? "0 3px 10px rgba(34,197,94,0.3)" : "none",
                transform: selectedCategory === cat.slug ? "translateY(-1px)" : "none",
              }}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="mp-grid">
          {filtered.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainProducts;
