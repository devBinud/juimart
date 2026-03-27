import React, { useState, useEffect } from "react";
import styles from "./productdetails.module.css";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { FaRegSmileBeam, FaWhatsapp } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      const db = getDatabase();
      const productRef = ref(db, `products/${id}`);
      try {
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setProduct(data);
          setMainImage(data.image || "");
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center">Loading product details...</p>;
  if (!product) return <p className="text-center text-danger">Product not found.</p>;

  return (
    <div className={`container ${styles.productContainer}`}>
      <div className="row">
        {/* Left Section */}
        <div className="col-lg-6 col-md-12">
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              <img
                src={mainImage}
                alt={product.name}
                className={styles.mainImage}
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-lg-6 col-md-12">
          <div className={styles.details}>
            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.rating}>
              <span>⭐ 5.0</span>
              <span className="text-success ms-2">✅</span>
              <span className="text-muted ms-2">(3 reviews)</span>
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.newPrice}>₹{product.price}</span>
              <span className={styles.oldPrice}>₹{product.mrp}</span>
            </div>

            <div className={styles.features}>
              <p>{product.features || "Feature details not available."}</p>
            </div>

            <div className={styles.featuresTag}>
              <FaRegSmileBeam style={{ marginRight: "8px", fontSize: "1rem" }} />
              <p>Products from our Care line bring out your inner radiance</p>
            </div>

            <div className={styles.icons}>
              <div>
                <img src="https://img.icons8.com/ios-filled/50/clock.png" alt="8 Hours" />
                <span>8 Hours of Stay</span>
              </div>
              <div>
                <img src="https://img.icons8.com/ios-filled/50/water.png" alt="Hydrating" />
                <span>Hydrates the Skin</span>
              </div>
              <div>
                <img src="https://img.icons8.com/ios-filled/50/feather.png" alt="Lightweight" />
                <span>Light-weight</span>
              </div>
            </div>

            <div className={styles.description}>
              <p>{product.description}</p>
            </div>

            <a
              href={`https://wa.me/919101038129?text=${encodeURIComponent(
                `*Hello Team Mrittika Naturals,*\n\n_I’m interested in this product:_\n\n✨ *${product.name}*\n💰 *Price:* ₹${product.price}\n\nCould you please share more details?\n\nThank you!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <FaWhatsapp style={{ marginRight: "8px", fontSize: "20px" }} />
              Enquire / Book via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
