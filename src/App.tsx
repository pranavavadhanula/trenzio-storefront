import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Global Drawers & Modals
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { SizingModal } from './components/SizingModal';

// Multi-Page Views with Distinct Shareable URLs & Separate Tabs
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { VirtualTryOnPage } from './pages/VirtualTryOnPage';

// Automatically scrolls to top whenever a new link/page is navigated to
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainStorefront() {
  return (
    <div className="min-h-screen bg-[#060C1A] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
      <ScrollToTop />

      {/* Top Banner (Pure Black Glossy) */}
      <AnnouncementBar />

      {/* Navigation Bar (Pure Black Glossy with Haute Obsidian Glass Finish) */}
      <Navbar />

      {/* Main Multi-Page Routed Content (The Other Thing: Blue Only) */}
      <main className="flex-1 bg-[#060C1A]">
        <Routes>
          {/* Home Page: Hero, Heavyweight Drops, Fabric Promise */}
          <Route path="/" element={<HomePage />} />

          {/* Dedicated Collections Catalog Pages */}
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:category" element={<CollectionsPage />} />

          {/* Dedicated Product Detail Page (PDP) */}
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Dedicated Shopping Bag Page */}
          <Route path="/cart" element={<CartPage />} />

          {/* Dedicated Saved Wishlist Page */}
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Brand Philosophy & 350 GSM Craftsmanship */}
          <Route path="/about" element={<AboutPage />} />

          {/* WhatsApp Direct Concierge & Support */}
          <Route path="/contact" element={<ContactPage />} />

          {/* 3D Virtual Try-On Studio */}
          <Route path="/try-on" element={<VirtualTryOnPage />} />

          {/* Fallback Catch-All */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer in Deep Midnight Sapphire */}
      <Footer />

      {/* Global Slide-Over Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <SizingModal />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <MainStorefront />
      </ShopProvider>
    </BrowserRouter>
  );
}

export default App;