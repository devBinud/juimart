import React, { useEffect } from 'react';
import HeroSection from '../../components/herosection/HeroSection.jsx';
import QuickCategories from '../../components/quickcategories/QuickCategories.jsx';
import DealsStrip from '../../components/dealsstrip/DealsStrip.jsx';
import TrustBar from '../../components/trustbar/TrustBar.jsx';
import QuickPicks from '../../components/quickpicks/QuickPicks.jsx';
import MainProducts from '../../components/mainProducts/MainProducts.jsx';

const PublicHome = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Outfit', sans-serif" }}>
      <HeroSection />
      <TrustBar />
      <QuickCategories />
      <DealsStrip />
      <QuickPicks />
      <MainProducts />
    </div>
  );
};

export default PublicHome;
