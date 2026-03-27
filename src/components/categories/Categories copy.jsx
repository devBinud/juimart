import React from "react";
import styles from "./categories.module.css";

import product1 from "../../assets/categories/1.jpg";
import product2 from "../../assets/categories/1.jpg";
import product3 from "../../assets/categories/1.jpg";
import product4 from "../../assets/categories/1.jpg";
import product5 from "../../assets/categories/1.jpg";

const categories = [
  { id: 1, title: "Natural Makeup", image: product1, link: "/category/makeup" },
  { id: 2, title: "Hair Care", image: product2, link: "/category/hair" },
  { id: 3, title: "Skincare", image: product3, link: "/category/skincare" },
  { id: 4, title: "Bath & Body", image: product4, link: "/category/bath" },
  { id: 5, title: "Batssh & Body", image: product5, link: "/category/baths" },
];

const Categories = () => {
  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>Shop by Category</h2>
      <div className={styles.grid}>
        {categories.map((category) => (
          <a
            key={category.id}
            href={category.link}
            className={styles.card}
            style={{ backgroundImage: `url(${category.image})` }}
          >
          </a>
        ))}
      </div>
    </section>
  );
};

export default Categories;
