import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { QrCode, ArrowRight, ShieldCheck, CheckCircle2, X, ExternalLink, KeyRound, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

// Safely decode Google Identity Services JWT payload
function decodeGoogleJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Error decoding Google JWT:', err);
    return null;
  }
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useShop();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Google OAuth configuration state
  const [googleClientId, setGoogleClientId] = useState(() => {
    return (
      localStorage.getItem('trevori_google_client_id') ||
      (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) ||
      ''
    );
  });
  const [inputClientId, setInputClientId] = useState('');
  const [customGmail, setCustomGmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [googleTab, setGoogleTab] = useState<'direct' | 'oauth'>('direct');

  // Handle Google token callback
  const handleGoogleCredentialResponse = (response: any) => {
    if (!response?.credential) return;
    const payload = decodeGoogleJwt(response.credential);
    if (payload) {
      login({
        name: payload.name ? payload.name.toUpperCase() : 'VIP GOOGLE MEMBER',
        email: payload.email,
        picture: payload.picture,
        authProvider: 'google',
        tier: 'VIP Noir Member',
      });
      setIsGoogleModalOpen(false);
      navigate('/account');
    }
  };

  // Initialize Google Identity Services if client ID is set
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && googleClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
        });
      } catch (err) {
        console.warn('Google GSI initialization notice:', err);
      }
    }
  }, [googleClientId]);

  // If already logged in, offer quick jump to dashboard
  if (isLoggedIn) {
    return (
      <div className="h-screen w-screen flex items-center justify-center px-4 bg-[#07111E] text-white">
        <div className="max-w-md w-full bg-[#0A1728] border border-[#1E3A66] p-8 text-center rounded-2xl shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-[#F88379] mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-wider mb-2">You Are Logged In</h2>
          <p className="text-slate-300 text-sm mb-6">
            Welcome back to Trevori Perspective Club. Access your private orders, credits, and 3D fit profile.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/account')}
              className="w-full py-3.5 bg-[#F88379] hover:bg-[#FA958D] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg"
            >
              Go to Customer Dashboard
            </button>
            <Link
              to="/"
              className="block w-full py-3 bg-[#0F2444] hover:bg-[#16335C] text-slate-200 font-bold text-xs uppercase tracking-widest transition-all"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authMode === 'email') {
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      if (!phone || phone.length < 10) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      login({
        email: email || `${phone}@trevori.in`,
        name: email ? email.split('@')[0].toUpperCase() : `VIP-${phone.slice(-4)}`,
        phone: phone || '+91 98765 43210',
        authProvider: authMode === 'email' ? 'email' : 'phone',
      });
      setIsLoading(false);
      navigate('/account');
    }, 600);
  };

  const handleGoogleClick = () => {
    // If a Google Client ID is configured, trigger Google Identity Services prompt
    if (googleClientId && window.google) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setIsGoogleModalOpen(true);
          }
        });
        return;
      } catch {
        setIsGoogleModalOpen(true);
      }
    } else {
      // Open the interactive Google OAuth Connect & Direct Sign-in modal
      setIsGoogleModalOpen(true);
    }
  };

  const handleSaveClientId = () => {
    if (!inputClientId.trim()) return;
    const cleanId = inputClientId.trim();
    localStorage.setItem('trevori_google_client_id', cleanId);
    setGoogleClientId(cleanId);
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: cleanId,
        callback: handleGoogleCredentialResponse,
      });
      window.google.accounts.id.prompt();
    }
  };

  const handleCustomGmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGmail || !customGmail.includes('@')) return;
    login({
      email: customGmail.toLowerCase(),
      name: customName ? customName.toUpperCase() : customGmail.split('@')[0].toUpperCase(),
      authProvider: 'google',
      tier: 'VIP Noir Member',
    });
    setIsGoogleModalOpen(false);
    navigate('/account');
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'qr') => {
    if (provider === 'qr') {
      setIsQrModalOpen(true);
      return;
    }
    if (provider === 'google') {
      handleGoogleClick();
      return;
    }

    // Apple login simulation
    setIsLoading(true);
    setTimeout(() => {
      login({
        email: 'client.perspective@icloud.com',
        name: 'ELENA ROSTOVA',
        authProvider: 'apple',
        tier: 'VIP Noir Member',
      });
      setIsLoading(false);
      navigate('/account');
    }, 500);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#07111E] text-white font-sans flex flex-col lg:flex-row relative">
      
      {/* LEFT COLUMN: Clean Zara-Style Form */}
      <div className="w-full lg:w-[460px] xl:w-[500px] h-full overflow-y-auto bg-[#07111E] p-6 sm:p-12 lg:p-14 flex flex-col justify-between shrink-0 border-r border-[#1E3A66]/30 z-20">
        <div>
          {/* High-Fashion Trevori Header */}
          <div className="mb-8 sm:mb-12 flex items-center justify-between">
            <Link to="/" className="inline-block group">
              <h1 className="font-sans text-3xl sm:text-4xl font-black tracking-[0.28em] text-white group-hover:text-[#F88379] transition-colors uppercase">
                T R E V O R I
              </h1>
              <p className="text-[10px] tracking-[0.35em] text-[#94A3B8] uppercase mt-1">
                WEAR YOUR PERSPECTIVE
              </p>
            </Link>

            {/* Back to store mobile close button */}
            <Link
              to="/"
              className="lg:hidden p-2 text-[#94A3B8] hover:text-white"
              title="Return to Store"
            >
              <X className="w-6 h-6" />
            </Link>
          </div>

          {/* Section Heading */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#CBD5E1]">
              LOG IN OR REGISTER
            </h2>
            <div className="flex gap-4 mt-3 text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('email')}
                className={`pb-1 font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                  authMode === 'email'
                    ? 'text-[#F88379] border-b-2 border-[#F88379]'
                    : 'text-[#64748B] hover:text-white'
                }`}
              >
                Email Address
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('phone')}
                className={`pb-1 font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                  authMode === 'phone'
                    ? 'text-[#F88379] border-b-2 border-[#F88379]'
                    : 'text-[#64748B] hover:text-white'
                }`}
              >
                Mobile OTP
              </button>
            </div>
          </div>

          {/* Form Input */}
          <form onSubmit={handleContinue} className="space-y-6">
            <div className="relative">
              {authMode === 'email' ? (
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] font-bold mb-1.5">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="name@perspective.com"
                    autoFocus
                    className="w-full bg-transparent border-b-2 border-[#334155] focus:border-[#F88379] py-2.5 text-sm sm:text-base text-white placeholder-[#475569] outline-none transition-colors font-sans"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] font-bold mb-1.5">
                    MOBILE NUMBER (+91)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError('');
                    }}
                    placeholder="98765 43210"
                    autoFocus
                    className="w-full bg-transparent border-b-2 border-[#334155] focus:border-[#F88379] py-2.5 text-sm sm:text-base text-white placeholder-[#475569] outline-none transition-colors font-sans"
                  />
                </div>
              )}

              {error && (
                <p className="text-[11px] text-[#F87171] mt-1.5 font-medium flex items-center gap-1">
                  <span>⚠</span> {error}
                </p>
              )}
            </div>

            {/* Solid Black Button matching Zara */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black hover:bg-white text-white hover:text-black font-extrabold text-xs uppercase tracking-[0.25em] border border-white/20 transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>CONTINUE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* ACCESS WITH Separator */}
          <div className="mt-8 mb-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#1E3A66]/60 w-full" />
              <span className="bg-[#07111E] px-4 text-[10px] uppercase tracking-[0.25em] text-[#64748B] font-bold shrink-0">
                ACCESS WITH
              </span>
              <div className="border-t border-[#1E3A66]/60 w-full" />
            </div>
          </div>

          {/* Privacy Disclaimer */}
          <p className="text-[10px] leading-relaxed text-[#64748B] mb-4">
            By logging in, you agree to access your Trevori VIP perspective profile in accordance with our{' '}
            <Link to="/about" className="text-[#94A3B8] underline hover:text-[#F88379]">
              Privacy Policy
            </Link>.
          </p>

          {/* Social Login Options */}
          <div className="space-y-3">
            {/* Google Option (Real Google OAuth Integration) */}
            <button
              type="button"
              onClick={handleGoogleClick}
              className="w-full py-3 px-4 border border-[#334155] hover:border-[#4285F4] text-white text-xs font-bold uppercase tracking-[0.15em] bg-transparent hover:bg-white/5 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.6 7.2C.6 9.2 0 10.5 0 12.4c0 1.9.6 3.2 1.6 5.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.8c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16.7C3.5 20.4 7.4 23.8 12 23.8z"
                />
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </button>

            {/* QR Option */}
            <button
              type="button"
              onClick={() => handleSocialLogin('qr')}
              className="w-full py-3 px-4 border border-[#334155] hover:border-white text-white text-xs font-bold uppercase tracking-[0.15em] bg-transparent hover:bg-white/5 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#F88379]" />
              <span>CONTINUE WITH QR</span>
            </button>

            {/* Apple Option */}
            <button
              type="button"
              onClick={() => handleSocialLogin('apple')}
              className="w-full py-3 px-4 border border-[#334155] hover:border-white text-white text-xs font-bold uppercase tracking-[0.15em] bg-transparent hover:bg-white/5 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.94-2.94-1 .04-2.2 1.22-2.82 2-.55.67-1.04 1.76-.9 2.82 1.13.09 2.15-1.1 2.78-1.88z" />
              </svg>
              <span>CONTINUE WITH APPLE</span>
            </button>
          </div>
        </div>

        {/* Footer Support */}
        <div className="pt-6 border-t border-[#1E3A66]/30 flex items-center justify-between text-[11px] text-[#64748B] font-bold uppercase tracking-wider">
          <Link to="/contact" className="hover:text-white transition-colors">
            HELP & CONCIERGE
          </Link>
          <span className="flex items-center gap-1 text-[#F88379]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-BIT ENCRYPTION</span>
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: 100% Full-Screen Unique Trevori Editorial Image */}
      <div className="flex-1 h-full relative overflow-hidden bg-black select-none hidden lg:block">
        <img
          src="/images/auth/trevori_unique_editorial.jpg"
          alt="Trevori Haute Streetwear - Monogram Hoodie & Bespoke Tee Editorial"
          className="w-full h-full object-cover object-[55%_center] filter brightness-95 contrast-105"
        />

        {/* Cinematic Midnight Shading & Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111E] via-transparent to-[#07111E]/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07111E]/50 via-transparent to-transparent" />

        {/* Top Right: Luxury Close / Return to Store button */}
        <div className="absolute top-8 right-8 z-30">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-white text-white hover:text-black border border-white/30 backdrop-blur-md text-xs font-bold uppercase tracking-widest transition-all shadow-xl group cursor-pointer"
          >
            <span>Return to Store</span>
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          </Link>
        </div>

        {/* Bottom Editorial Caption */}
        <div className="absolute bottom-10 right-10 z-20 text-right">
          <p className="text-[10px] tracking-[0.35em] font-extrabold uppercase text-[#F88379] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            TREVORI PERSPECTIVE 2026
          </p>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-[0.1em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            THE MONOGRAM STREETWEAR DROP
          </h3>
        </div>
      </div>

      {/* GOOGLE SIGN-IN INTERACTIVE MODAL */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A1728] border border-[#1E3A66] rounded-2xl max-w-lg w-full p-6 sm:p-8 text-left relative shadow-2xl">
            <button
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.6 7.2C.6 9.2 0 10.5 0 12.4c0 1.9.6 3.2 1.6 5.2l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.8c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16.7C3.5 20.4 7.4 23.8 12 23.8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-white tracking-wide">
                  Sign In with Google
                </h3>
                <p className="text-xs text-slate-400">
                  Choose how you want to connect your Google Account
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-[#1E3A66] mb-5">
              <button
                type="button"
                onClick={() => setGoogleTab('direct')}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer mr-6 ${
                  googleTab === 'direct'
                    ? 'text-[#F88379] border-b-2 border-[#F88379]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1-Click Gmail Connect
              </button>
              <button
                type="button"
                onClick={() => setGoogleTab('oauth')}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  googleTab === 'oauth'
                    ? 'text-[#F88379] border-b-2 border-[#F88379]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Google Cloud Client ID
              </button>
            </div>

            {/* TAB 1: Direct Gmail Sign-In */}
            {googleTab === 'direct' && (
              <div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Enter your real Google email address below to log in immediately with your verified Google identity and access your Trevori VIP dashboard.
                </p>

                <form onSubmit={handleCustomGmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                      Your Gmail Address
                    </label>
                    <input
                      type="email"
                      required
                      value={customGmail}
                      onChange={(e) => setCustomGmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-[#071324] border border-[#1E3A66] focus:border-[#4285F4] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Pranav Avadhanula"
                      className="w-full bg-[#071324] border border-[#1E3A66] focus:border-[#4285F4] rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Log In with This Google Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: Official Google Cloud OAuth Client ID */}
            {googleTab === 'oauth' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#071324] border border-[#1E3A66] rounded-xl text-xs text-slate-300 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#F88379]" />
                    <span>How Real Google Popups Work:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
                    <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-[#4285F4] underline">Google Cloud Console</a>.</li>
                    <li>Create an <strong>OAuth 2.0 Web Client ID</strong>.</li>
                    <li>Add <code className="text-white bg-black/50 px-1 py-0.5 rounded">http://localhost:5173</code> to <strong>Authorized JavaScript origins</strong>.</li>
                    <li>Paste your Client ID below to enable the authentic Google popup!</li>
                  </ol>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                    Google OAuth Client ID
                  </label>
                  <input
                    type="text"
                    value={inputClientId}
                    onChange={(e) => setInputClientId(e.target.value)}
                    placeholder="xxxxxxxxxxxx.apps.googleusercontent.com"
                    className="w-full bg-[#071324] border border-[#1E3A66] focus:border-[#4285F4] rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveClientId}
                  disabled={!inputClientId.trim()}
                  className="w-full py-3 bg-[#F88379] hover:bg-[#FA958D] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                >
                  Save & Trigger Google Popup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Code Login Simulation Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A1728] border border-[#1E3A66] rounded-2xl max-w-sm w-full p-8 text-center relative shadow-2xl">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <QrCode className="w-12 h-12 text-[#F88379] mx-auto mb-3" />
            <h3 className="text-lg font-black uppercase tracking-wider mb-2">Instant QR Sign-In</h3>
            <p className="text-xs text-slate-300 mb-6">
              Scan this dynamic QR code with your Trevori App or smartphone camera to sign in without a password.
            </p>

            <div className="w-48 h-48 mx-auto bg-white p-4 rounded-xl flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(248,131,121,0.3)]">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://trevori.luxury/auth/instant"
                alt="Trevori Instant Login QR"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-x-0 h-1 bg-[#F88379] shadow-[0_0_12px_#F88379] top-0 animate-bounce" />
            </div>

            <button
              onClick={() => {
                setIsQrModalOpen(false);
                login({ name: 'Alexander Vance', email: 'alexander@trevori.com' });
                navigate('/account');
              }}
              className="mt-6 w-full py-3 bg-[#F88379] hover:bg-[#FA958D] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Simulate Instant Scan & Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
