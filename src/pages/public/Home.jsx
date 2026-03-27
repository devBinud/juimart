import React, { useEffect } from 'react';
import HeroSection from '../../components/herosection/HeroSection.jsx';
import MainProducts from '../../components/mainProducts/MainProducts.jsx';

// Public home is important , as per the clients requirement
// I want all the color should be follow the white background #fff or another beige type bg
// Proper and clean UI is what recommended by most of users

const PublicHome = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection/>
      <MainProducts/>
    </div>
  );
};

export default PublicHome;
