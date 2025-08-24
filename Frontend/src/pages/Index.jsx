import React from 'react';
import Hero from './Hero';
import Services from './Services';
import Deals from './Deals';
import Gallery from './Gallery';
import Availability from './Availability';
import Contact from './Contact';
import Footer from '../components/Footer';
import Navbar from '@/components/Navbar';
import Dashboard from './Dashboard';

const Index = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Deals />
      <Gallery />
      <Availability />
      <Contact />
      <Footer />
      {/* <Dashboard /> */}
    </>
  );
};

export default Index;
