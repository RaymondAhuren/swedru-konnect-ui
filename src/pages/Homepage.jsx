import React from "react";
import Header from "../components/homepage/Header";
import HeroSection from "../components/homepage/HeroSection";
import ProductGrid from "../components/homepage/ProductGrid";
import Footer from "../components/homepage/Footer";
import { ProductProvider } from "../context/productContext";

function Homepage() {
  return (
      <ProductProvider>
    <div className="relative">
{/* Sticky Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="text-white">
        <HeroSection />
      </div>

      <ProductGrid />
      <Footer />

      
      
    </div>
      </ProductProvider>
  );
}

export default Homepage;
