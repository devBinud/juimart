import React, { useEffect, useState } from "react";
import styles from "./productSlider.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../firebase/config";

const db = getDatabase(app);

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.entries(data)
          .map(([id, item]) => ({ id, ...item }))
          .filter((item) => item.category?.toLowerCase() !== "hair");
        setProducts(productList);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const scroll = (dir) => {
    const slider = document.getElementById("productSliderScroll");
    if (slider) {
      slider.scrollBy({
        left: dir === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.sliderContainer}>
      {/* <div className={styles.titleWrapper}>
        <h3 className={styles.title}>Shop Our Products</h3>
        <p className={styles.productinstruction}>
          Swipe Right to see products{" "}
          <span className={styles.arrow}>
            <FaArrowRight />
          </span>
        </p>
      </div> */}

      <div className={styles.sliderWrapper}>
        <button
          className={styles.arrowLeft}
          onClick={() => scroll("left")}
          aria-label="Scroll Left"
        >
          <FaChevronLeft />
        </button>

        <div id="productSliderScroll" className={styles.slider}>
          {loading ? (
            <p className={styles.loading}>Loading products...</p>
          ) : products.length === 0 ? (
            <p className={styles.noProducts}>No products available</p>
          ) : (
            products.map((item) => (
              <div key={item.id} className={styles.card}>
                <Link
                  to={`/product-details/${item.id}`}
                  className={styles.clickableBox}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.image}
                    loading="lazy"
                  />
                  <div className={styles.cardBody}>
                    <h4 className={styles.productName}>{item.name}</h4>
                    <p className={styles.description}>
                      {item.description.length > 35
                        ? `${item.description.slice(0, 62)}...`
                        : item.description}
                    </p>

                    <div className={styles.priceBox}>
                      <span className={styles.discountedPrice}>
                        ${item.price}
                      </span>
                      <span className={styles.originalPrice}>
                        ${item.mrp}
                      </span>
                    </div>
                  </div>
                </Link>

                <a
                  href={`https://wa.me/919101038129?text=${encodeURIComponent(
                    `*Hello Team Mrittika Naturals,*\n\n_I’m interested in exploring one of your natural beauty products:_\n\n✨ Product: ${item.name}\n💰 Price: ₹${item.price}\n\n_Could you please share more details about this product, including availability and booking steps?_\n\n*Looking forward to your response.*`
                  )}`}
                  className={styles.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book via WhatsApp
                </a>
              </div>
            ))
          )}
        </div>

        <button
          className={styles.arrowRight}
          onClick={() => scroll("right")}
          aria-label="Scroll Right"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ProductSlider;
