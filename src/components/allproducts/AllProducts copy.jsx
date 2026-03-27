import React, { useState, useEffect } from 'react';
import styles from './allproducts.module.css';

// Images (You can replace these with actual images)
import product1 from '../../assets/products/1.webp';
import product2 from '../../assets/products/1.webp';
import product3 from '../../assets/products/1.webp';
import product4 from '../../assets/products/1.webp';
import product5 from '../../assets/products/1.webp';

const allProducts = [
  {
    id: 1,
    name: 'Volumising Shampoo with Fenugreek',
    description: 'Imparts Volume & Thickness | Non-drying',
    mrp: "₹799",
    price: "₹599",
    category: 'Shampoo',
    image: product2,
  },
  {
    id: 2,
    name: 'Clarifying Mask with Neem & Tulsi',
    description: 'Removes Impurities | Controls Oiliness',
    mrp: "₹899",
    price: "₹699",
    category: 'Mask',
    image: product5,
  },
  {
    id: 3,
    name: 'Strengthening Protein Hair Mask',
    description: 'Reinforces Roots | Adds Natural Shine',
    mrp: "₹899",
    price: "₹699",
    category: 'Mask',
    image: product2,
  },
  {
    id: 4,
    name: 'Ayurvedic Hibiscus & Brahmi Hair Oil',
    description: 'Reduces Breakage | Nourishes Deeply',
    mrp: "₹849",
    price: "₹649",
    category: 'Hair Oil',
    image: product3,
  },
  {
    id: 5,
    name: 'Nourishing Conditioner with Coconut Milk',
    description: 'Softens Hair | Adds Luster & Smoothness',
    mrp: "₹799",
    price: "₹599",
    category: 'Conditioner',
    image: product4,
  },
  {
    id: 6,
    name: 'Moisturising Shampoo with Aloe Vera',
    description: 'Revives Dry Hair | Gentle & Non-drying',
    mrp: "₹799",
    price: "₹599",
    category: 'Shampoo',
    image: product3,
  },
  {
    id: 7,
    name: 'Herbal Scalp Therapy Hair Mask',
    description: 'Detoxifies Scalp | Boosts Hair Health',
    mrp: "₹899",
    price: "₹699",
    category: 'Mask',
    image: product1,
  },
  {
    id: 8,
    name: 'Indian White Waterlily Conditioner',
    description: 'Smoothens & Nourishes | Reduces Frizz',
    mrp: "₹799",
    price: "₹599",
    category: 'Conditioner',
    image: product5,
  },
  {
    id: 9,
    name: 'Anti-Dandruff Shampoo with Hibiscus',
    description: 'Controls Flakes | Herbal & Non-drying',
    mrp: "₹799",
    price: "₹599",
    category: 'Shampoo',
    image: product4,
  },
  {
    id: 10,
    name: 'Rosemary Hair Oil New For Hair Loss',
    description: 'Improves Scalp Health | Reduces Hair Loss',
    mrp: "₹799",
    price: "₹599",
    category: 'Hair Oil',
    image: product1,
  },
];



const categories = ['All', 'Mask', 'Shampoo', 'Conditioner', 'Hair Oil'];

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts =
    selectedCategory === 'All'
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);

  return (
    <>
      <h2 className={styles.headingText}>
        Explore the Essence of Ayurvedic Hair Care
      </h2>

      <div className={styles.shopContainer}>
        <div className={styles.sidebar}>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              className={`
                ${styles.categoryPill}
                ${selectedCategory === cat ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.productImage}
              />
              <h4 className={styles.productTitle}>{product.name}</h4>
              <p className={styles.description}>{product.description}</p>
              <div className={styles.priceBox}>
                <span className={styles.discountedPrice}>MRP {product.price}</span>
                <span className={styles.originalPrice}>MRP {product.mrp}</span>
              </div>
              <a
                href={`https://wa.me/919101038129?text=${encodeURIComponent(
                  `*Hello Team Mrittika Naturals,*\n\n_I’m interested in exploring one of your natural beauty products:_\n\n✨ Product: ${product.name}\n💰 Price: ₹${product.price}\n\n_Could you please share more details about this product, including availability and booking steps?_\n\n*Looking forward to your response.*`
                )}`}
                className={styles.whatsappBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book via WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllProducts;
