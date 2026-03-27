import React, { useEffect } from 'react';
// import Banner from '../../components/banner/Banners.jsx';
import HeroSection from '../../components/herosection/HeroSection.jsx';
// import About from '../../components/aboutus/About.jsx';
// import MeetTheFounder from '../../components/meetthefounder/MeetTheFounder.jsx';
import Categories from '../../components/categories/Categories.jsx';
import ProductSlider from '../../components/products/ProductSlider.jsx';
import CTAHome from '../../components/cta/CTAHome.jsx';
import ContactUs from '../../components/contactus/Contact.jsx';

// Public home is important , as per the clients requirement
// I want all the color should be follow the white background #fff or another beige type bg
// Proper and clean UI is what recommended by most of users

const PublicHome = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* <Banner /> */}
      <HeroSection/>
      {/* Trending Category should be added  ?  */}
      {/* Where it could be ?*/}
      {/* <About /> */}
      {/* <Categories /> */}
      {/* <ProductSlider /> */}
      {/* <CTAHome/> */}
      {/* <ContactUs/> */}
      {/* <MeetTheFounder /> */}
      
    </div>
  );
};

export default PublicHome;
