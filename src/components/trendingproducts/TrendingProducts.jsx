import React, { useEffect, useState } from "react";
import styles from "./trendingproducts.module.css";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { FaWhatsapp } from "react-icons/fa";

const TrendingProducts = () => {
  const [hairProducts, setHairProducts] = useState([]);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const productsRef = ref(db, "products");

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        const filtered = productsArray.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase().includes("trending")
        );
        setHairProducts(filtered);
      } else {
        setHairProducts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // ✅ If no trending products, render nothing
  if (hairProducts.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Trending Products</h2>
      <div className={styles.cardGrid}>
        {hairProducts.slice(0, isMobile ? 6 : 5).map((item) => {
          const whatsappLink = `https://wa.me/919706393924?text=${encodeURIComponent(
            `Hello, I'm interested in the following product:\n\n*${item.name}*\n${item.description}\n\nImage: ${item.image}`
          )}`;

          return (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => navigate(`/product-details/${item.id}`)}
            >
              <div className={styles.trendingTag}>Trending</div>
              <img src={item.image} alt={item.name} className={styles.image} />
              <h3 className={styles.name}>
                {item.name.length > (isMobile ? 17 : 20)
                  ? item.name.slice(0, isMobile ? 17 : 20) + "..."
                  : item.name}
              </h3>

              <p className={styles.description}>
                {item.description.length > (isMobile ? 45 : 50)
                  ? item.description.slice(0, isMobile ? 45 : 50) + "..."
                  : item.description}
              </p>

              <div className={styles.priceBox}>
                <span className={styles.price}>MRP ${item.price}</span>
                <span className={styles.mrp}>MRP ${item.mrp}</span>
              </div>

              <a
                href={whatsappLink}
                className={styles.whatsappButton}
                onClick={(e) => e.stopPropagation()} // prevent card click
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className={styles.icon} />
                Book Now
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingProducts;
