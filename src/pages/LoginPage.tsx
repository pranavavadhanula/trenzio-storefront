import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, user } = useShop();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If already logged in, redirect to account after 1 second
  useEffect(() => {
    if (isLoggedIn && !success) {
      navigate('/account');
    }
  }, [isLoggedIn, navigate, success]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = identifier.trim();

    if (!cleanInput) {
      setError('Please enter your mobile number or email address');
      return;
    }

    setIsLoading(true);
    setError('');

    // Detect if input is email or phone
    const isEmail = cleanInput.includes('@');
    const emailVal = isEmail ? cleanInput : `${cleanInput.replace(/\D/g, '')}@trevori-member.in`;
    const phoneVal = isEmail ? '+91 98765 43210' : (cleanInput.startsWith('+91') ? cleanInput : `+91 ${cleanInput}`);
    const displayName = isEmail ? cleanInput.split('@')[0].toUpperCase() : `VIP MEMBER ${cleanInput.slice(-4) || '9921'}`;

    setTimeout(() => {
      login({
        name: displayName,
        email: emailVal,
        phone: phoneVal,
        tier: 'VIP Noir Member',
        creditsINR: 1200,
        points: 4200,
        joinedDate: 'November 2026',
        authProvider: isEmail ? 'email' : 'phone',
      });
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/account');
      }, 500);
    }, 400);
  };

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    setTimeout(() => {
      login({
        name: provider === 'google' ? 'PRANAV AVADHANULA' : provider === 'apple' ? 'ELENA ROSTOVA' : 'TREVORI MEMBER',
        email: provider === 'google' ? 'pranav@gmail.com' : provider === 'apple' ? 'elena@icloud.com' : 'member@facebook.com',
        phone: '+91 98765 43210',
        tier: 'VIP Noir Member',
        creditsINR: 1200,
        points: 4200,
        authProvider: provider,
      });
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/account');
      }, 500);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-slate-900 font-sans flex flex-col justify-between">
      {/* Minimal Top Brand Bar (Bewakoof Style) */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-20 w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3">
          <Link to="/" className="group shrink-0" title="Trevori Home">
            <span className="font-serif text-xl sm:text-3xl font-black tracking-[0.25em] text-[#07111E] group-hover:text-[#F88379] transition-colors">
              TREVORI
            </span>
          </Link>
          <nav className="flex items-center space-x-3 sm:space-x-8 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700">
            <Link to="/collections/men" className="hover:text-[#F88379] transition-colors">
              MEN
            </Link>
            <Link to="/collections/women" className="hover:text-[#F88379] transition-colors">
              WOMEN
            </Link>
            <Link to="/collections/accessories" className="hidden sm:inline hover:text-[#F88379] transition-colors">
              ACCESSORIES
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Split Section: Uncrowded, Bewakoof-Style Clean Layout */}
      <main className="flex-1 w-full max-w-full flex items-center justify-center py-6 sm:py-14 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          
          {/* LEFT: Trevori Editorial Photo with Overlaid Brand Name & Slogan */}
          <div className="relative w-full aspect-[4/4.5] sm:aspect-[4/4.5] lg:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 shadow-xl border border-slate-200/60">
            <img
              src="/images/auth/trevori_unique_editorial.jpg"
              alt="Trevori Runway Editorial - Wear Your Perspective"
              className="w-full h-full object-cover object-[55%_center] filter brightness-[0.92] contrast-[1.05]"
            />

            {/* Subtle Gradient Overlays for High-Contrast Text Legibility */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />

            {/* Overlaid Brand Badge on Photo (Bewakoof Style) */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10 flex flex-col gap-2 sm:gap-3">
              {/* Brand Logo Badge */}
              <div className="bg-[#07111E] text-white px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-[#F88379] shadow-2xl rounded-sm self-start">
                <span className="font-serif text-base sm:text-2xl font-black tracking-[0.25em] pl-[0.25em] block">
                  TREVORI
                </span>
              </div>
              {/* Slogan Beside/Below Brand Name */}
              <div className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                <p className="text-base sm:text-2xl font-black tracking-tight uppercase leading-none font-sans">
                  ALL EYES <span className="text-[#F88379]">ON YOU</span>
                </p>
                <p className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.25em] text-slate-300 font-medium mt-0.5">
                  Wear Your Perspective
                </p>
              </div>
            </div>

            {/* Bottom Caption on Photo */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-10 text-white">
              <span className="inline-block bg-[#F88379] text-[#07111E] text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-sm shadow-md mb-1.5">
                NEW 2026 DROP
              </span>
              <h3 className="font-serif text-lg sm:text-2xl font-bold tracking-wide">
                Architectural Streetwear
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-200 font-medium mt-0.5">
                100% Bio-Wash Combed Cotton
              </p>
            </div>
          </div>

          {/* RIGHT: Clean, Uncrowded Login / Signup Form */}
          <div className="w-full max-w-md mx-auto lg:max-w-none px-2 sm:px-6">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                Login / Signup
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
                Join us now to be a part of Trevori family.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            {/* Success Feedback */}
            {success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Signed in successfully! Redirecting to your perspective profile...</span>
              </div>
            )}

            {/* Single Streamlined Input Form */}
            <form onSubmit={handleContinue} className="space-y-4">
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:border-[#F88379] focus-within:ring-2 focus-within:ring-[#F88379]/20 transition-all bg-white shadow-sm">
                <div className="px-3.5 py-3.5 bg-slate-50 border-r border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 select-none shrink-0">
                  <span className="text-sm">🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter Mobile Number or Email"
                  autoFocus
                  className="w-full px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-sans"
                />
              </div>

              {/* Password field if user chooses */}
              {showPasswordField && (
                <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:border-[#F88379] focus-within:ring-2 focus-within:ring-[#F88379]/20 transition-all bg-white shadow-sm">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password (optional)"
                    className="w-full px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-sans"
                  />
                </div>
              )}

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#F88379] hover:bg-[#FA958D] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-[0_4px_16px_rgba(248,131,121,0.35)] hover:shadow-[0_6px_22px_rgba(248,131,121,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block animate-pulse">PROCESSING...</span>
                ) : (
                  <>
                    <span>CONTINUE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* OR Divider Line */}
            <div className="relative my-7 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Social Logins Side-by-Side (Google and Facebook/Apple like Bewakoof) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2.5 py-3 px-3 sm:px-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Facebook Button (matching Bewakoof) */}
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="flex items-center justify-center gap-2.5 py-3 px-3 sm:px-4 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* Terms and Privacy Policy (matching Bewakoof exactly) */}
            <p className="text-[11px] text-slate-400 text-center mt-7 sm:mt-8 leading-relaxed font-sans">
              By creating an account or logging in, you agree with Trevori's{' '}
              <Link to="/legal" className="text-[#F88379] font-bold hover:underline">
                T&amp;C
              </Link>{' '}
              and{' '}
              <Link to="/legal" className="text-[#F88379] font-bold hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Clean Bottom Footer */}
      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400 bg-white">
        &copy; 2026 TREVORI INDIA &bull; All Rights Reserved
      </footer>
    </div>
  );
};
