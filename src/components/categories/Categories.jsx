import React, { useEffect } from 'react';
import TrendingProducts from '../../components/trendingproducts/TrendingProducts.jsx';

const Categories = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <TrendingProducts />
    </div>
  );
};

export default Categories;
