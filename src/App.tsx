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
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A1810] flex flex-col font-sans selection:bg-[#7BB8E8] selection:text-[#2A1810]">
      <ScrollToTop />

      {/* Top Banner (Free Pan-India Delivery over ₹1,999) */}
      <AnnouncementBar />

      {/* Navigation Bar with Category Links (Right click supported for new tabs) */}
      <Navbar />

      {/* Main Multi-Page Routed Content */}
      <main className="flex-1 bg-[#F9F6F0]">
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

          {/* Dedicated 3D Virtual Try-On Studio */}
          <Route path="/try-on" element={<VirtualTryOnPage />} />

          {/* About / Craftsmanship Philosophy */}
          <Route path="/about" element={<AboutPage />} />

          {/* Concierge & Support */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Global Interactive Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <SizingModal />

      {/* Luxury Footer with Indian D2C Trust Badges */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <MainStorefront />
      </ShopProvider>
    </BrowserRouter>
  );
}
