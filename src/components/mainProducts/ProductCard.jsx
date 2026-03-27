import React, { useState } from "react";
import styles from "./productCard.module.css";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useCartStore } from "../../store/useCartStore";
import defaultImage from "../../assets/images/default_image.png";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cart } = useCartStore();

  const [imgLoaded, setImgLoaded] = useState(false);

  const item = cart.find((i) => i.id === product.id);
  const quantity = item ? item.quantity : 0;

  return (
    <div className={styles.card}>
      
      {/* IMAGE */}
      <div className={styles.imageWrapper}>
        {product.discount && (
          <span className={styles.badge}>
            {product.discount}% OFF
          </span>
        )}

        {/* 🔥 SHIMMER WHILE IMAGE LOADS */}
        {!imgLoaded && <div className={styles.imageSkeleton}></div>}

        <img
          src={product.image || defaultImage}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.src = defaultImage;
            setImgLoaded(true);
          }}
          className={`${styles.image} ${
            imgLoaded ? styles.showImage : styles.hideImage
          }`}
        />
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        <span className={styles.category}>
          {product.category}
        </span>

        <h3 className={styles.title}>
          {product.name}
        </h3>

        <p className={styles.weight}>
          {product.weight}
        </p>

        {/* PRICE + CART */}
        <div className={styles.bottom}>
          <div>
            <span className={styles.price}>
              ₹{product.price}
            </span>

            {product.oldPrice && (
              <span className={styles.oldPrice}>
                ₹{product.oldPrice}
              </span>
            )}
          </div>

          {/* 🔥 STEPPER */}
          {quantity > 0 ? (
            <div className={styles.stepper}>
              <button onClick={() => removeFromCart(product)}>
                <FiMinus />
              </button>
              <span>{quantity}</span>
              <button onClick={() => addToCart(product)}>
                <FiPlus />
              </button>
            </div>
          ) : (
            <button
              className={styles.addBtn}
              onClick={() => addToCart(product)}
            >
              <FiPlus />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;