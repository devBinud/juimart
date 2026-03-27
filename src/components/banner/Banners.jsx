import React from 'react';
import styles from './banners.module.css';

import banner1 from '../../assets/banners/banner.jpg';
import banner2 from '../../assets/banners/1.jpg';

const Banners = () => {
  return (
    <div
      id="carouselExampleControls"
      className={`carousel slide ${styles.carouselWrapper}`}
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={banner2} className={`d-block w-100 ${styles.bannerImage}`} alt="Banner 1" />
        </div>
        <div className="carousel-item">
          <img src={banner1} className={`d-block w-100 ${styles.bannerImage}`} alt="Banner 2" />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Banners;
