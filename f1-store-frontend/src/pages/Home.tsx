import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import LatestItems from '../components/sections/LatestItems';

const Home: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <LatestItems />
    </main>
  );
};

export default Home;
