import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
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
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { AIStylistPage } from './pages/AIStylistPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';

// Trevori AI Personal Stylist Floating Widget
import { TrevoriAIWidget } from './components/ai/TrevoriAIWidget';

// Automatically scrolls to top whenever a new link/page is navigated to
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainStorefront() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { login } = useShop();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // Listen for Google OAuth callback access_token hash
  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      if (accessToken) {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then((profile) => {
            if (profile && profile.email) {
              login({
                name: profile.name ? profile.name.toUpperCase() : 'GOOGLE MEMBER',
                email: profile.email,
                picture: profile.picture,
                tier: 'Noir Member',
                creditsINR: 1500,
                points: 4800,
                authProvider: 'google',
              });
              window.history.replaceState(null, '', window.location.pathname);
              navigate('/account');
            }
          })
          .catch((err) => {
            console.error('Google token callback failed:', err);
          });
      }
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen w-full max-w-full bg-[#F4F1EA] text-[#171717] flex flex-col font-sans selection:bg-[#DDD8CE] selection:text-[#171717]">
      <ScrollToTop />

      {/* 1. Minimal Sticky Navigation */}
      {!isAuthPage && <Navbar />}

      {/* Main Multi-Page Routed Content */}
      <main className="flex-1 w-full max-w-full bg-[#F4F1EA]">
        <Routes>
          {/* Home Page: 12-Section Editorial Homepage */}
          <Route path="/" element={<HomePage />} />
          <Route path="/lookbook" element={<HomePage scrollTo="lookbook" />} />

          {/* Dedicated Collections Catalog Pages */}
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:category" element={<CollectionsPage />} />

          {/* Dedicated Product Detail Page (PDP) */}
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Dedicated Shopping Bag Page */}
          <Route path="/cart" element={<CartPage />} />

          {/* Razorpay Payment Confirmation */}
          <Route path="/order-confirmed" element={<OrderConfirmationPage />} />

          {/* Dedicated Saved Wishlist Page */}
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Brand Philosophy & Craftsmanship */}
          <Route path="/about" element={<AboutPage />} />

          {/* Atelier Concierge & Support */}
          <Route path="/contact" element={<ContactPage />} />

          {/* 3D Virtual Try-On Studio */}
          <Route path="/try-on" element={<VirtualTryOnPage />} />

          {/* Customer Login & Registration */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Customer Account Dashboard */}
          <Route path="/account" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Trevori AI Personal Shopping Stylist Studio */}
          <Route path="/ai-stylist" element={<AIStylistPage />} />

          {/* Fallback Catch-All */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* 12. Premium Footer */}
      {!isAuthPage && <Footer />}

      {/* Global Slide-Over Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <SizingModal />

      {/* Floating 24/7 AI Stylist Assistant (Across Website) */}
      {!isAuthPage && <TrevoriAIWidget />}
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
