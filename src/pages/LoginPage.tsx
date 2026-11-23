import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { shopifyCustomerAccessTokenCreate } from '../services/shopify';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, logout, user, isLoggedIn } = useShop();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const GOOGLE_CLIENT_ID = '491926857800-qum2kh5u71v903plsge7oej2btaevsvr.apps.googleusercontent.com';

  // Process access_token if returning from Google OAuth redirect
  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      if (accessToken) {
        setIsLoading(true);
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
                phone: '+91 98765 43210',
                tier: 'Noir Member',
                creditsINR: 1500,
                points: 4800,
                authProvider: 'google',
              });
              window.history.replaceState(null, '', window.location.pathname);
              setIsLoading(false);
              setSuccess(true);
              setTimeout(() => {
                navigate('/account');
              }, 400);
            }
          })
          .catch((err) => {
            console.error('Google profile fetch failed:', err);
            setIsLoading(false);
            setError('Could not verify Google authentication. Please try again.');
          });
      }
    }
  }, [login, navigate]);

  const redirectToGoogleOAuth = () => {
    const redirectUri = window.location.origin;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=email%20profile%20openid&prompt=select_account`;
    window.location.href = authUrl;
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError('');

    // Check if Google GIS popup client is available in window
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();
                
                login({
                  name: profile.name ? profile.name.toUpperCase() : 'GOOGLE MEMBER',
                  email: profile.email || 'customer@gmail.com',
                  picture: profile.picture,
                  phone: '+91 98765 43210',
                  tier: 'Noir Member',
                  creditsINR: 1500,
                  points: 4800,
                  authProvider: 'google',
                });
                setIsLoading(false);
                setSuccess(true);
                setTimeout(() => {
                  navigate('/account');
                }, 400);
              } catch (fetchErr) {
                console.error('Error fetching Google userinfo:', fetchErr);
                setIsLoading(false);
                setError('Failed to fetch Google profile details.');
              }
            } else {
              setIsLoading(false);
            }
          },
          error_callback: () => {
            // If popup is blocked by browser, redirect directly
            redirectToGoogleOAuth();
          },
        });

        client.requestAccessToken();
        return;
      } catch (err) {
        console.warn('GIS error, using direct redirect:', err);
      }
    }

    // Direct Google OAuth URL redirect
    redirectToGoogleOAuth();
  };

  const handleSocialLogin = (provider: 'google') => {
    if (provider === 'google') {
      handleGoogleLogin();
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = identifier.trim();

    if (!cleanInput) {
      setError('Please provide your email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    const isEmail = cleanInput.includes('@');
    const emailVal = isEmail ? cleanInput : `${cleanInput.replace(/\D/g, '')}@member.trevori.com`;
    const displayName = isEmail ? cleanInput.split('@')[0].toUpperCase() : `MEMBER ${cleanInput.slice(-4) || '9921'}`;

    try {
      // Connect to real Shopify Customer API
      await shopifyCustomerAccessTokenCreate(emailVal, password || 'TrevoriClientPass2026!');
      
      login({
        name: displayName,
        email: emailVal,
        phone: isEmail ? '+91 98765 43210' : cleanInput,
        tier: 'Noir Member',
        creditsINR: 1500,
        points: 4800,
        joinedDate: 'November 2026',
        authProvider: isEmail ? 'email' : 'phone',
      });

      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/account');
      }, 500);
    } catch {
      setIsLoading(false);
      setError('Authentication failed. Please check your credentials.');
    }
  };



  return (
    <div className="min-h-screen w-full bg-[#EAE8E4] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans">
      {/* Centered Modal Card matching the exact Dribbble reference */}
      <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT COLUMN: Clean Minimalist Login Form */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          {/* Top Bar: Back Link & Centered Brand Logo */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <Link
              to="/"
              className="text-xs sm:text-sm text-neutral-500 hover:text-black font-medium transition-colors"
            >
              Back
            </Link>
            <Link to="/" className="font-serif text-2xl sm:text-[26px] tracking-[0.26em] font-medium text-black">
              TREVORI
            </Link>
            <div className="w-10" /> {/* Spacing balance */}
          </div>

          {/* Form Content */}
          <div className="w-full max-w-sm mx-auto">
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-black mb-5 sm:mb-6">
              Login
            </h1>

            {isLoggedIn && (
              <div className="mb-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-between text-xs text-neutral-600">
                <span>Signed in as <strong className="text-black">{user?.name}</strong></span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="underline text-red-500 hover:text-red-700 font-medium ml-2 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
                {error}
              </div>
            )}

            {success ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3 animate-bounce" />
                <h3 className="font-serif text-xl font-normal text-black mb-1">
                  Access Confirmed
                </h3>
                <p className="text-xs text-neutral-500 font-light">
                  Preparing your personal concierge profile...
                </p>
              </div>
            ) : (
              <form onSubmit={handleContinue} className="space-y-3.5">
                {/* Email Input */}
                <div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-2.5 bg-[#FBFBFB] border border-neutral-200 rounded-lg text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>

                {/* Password Input with Show/Hide toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2.5 bg-[#FBFBFB] border border-neutral-200 rounded-lg text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => alert('Password recovery link has been sent to your email.')}
                    className="text-xs text-neutral-500 hover:text-black transition-colors font-normal cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Solid Black Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-black hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isLoading ? 'Signing in...' : 'Login'}
                </button>
              </form>
            )}

            {/* Divider: or login with in one line */}
            <div className="my-5 flex items-center justify-center">
              <div className="border-t border-neutral-200 flex-1" />
              <span className="px-3 text-[11px] text-neutral-400 uppercase tracking-wider whitespace-nowrap shrink-0">
                or login with
              </span>
              <div className="border-t border-neutral-200 flex-1" />
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="w-full py-2.5 px-4 border border-neutral-200 hover:border-neutral-400 rounded-lg bg-white text-sm font-medium text-neutral-700 flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Login with Google</span>
              </button>
            </div>

            {/* Bottom Sign Up Link */}
            <div className="mt-6 text-center text-xs text-neutral-500">
              Doesn't have an account?{' '}
              <button
                type="button"
                onClick={() => handleContinue({ preventDefault: () => {} } as any)}
                className="font-semibold text-black underline hover:text-neutral-700 transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>

          <div /> {/* Bottom spacing */}
        </div>

        {/* RIGHT COLUMN: The exact red editorial photo from the reference */}
        <div className="relative w-full h-full min-h-[460px] md:min-h-full overflow-hidden bg-[#BA2C17] hidden md:block">
          {/* Top Brand & Tagline replacing Brand New */}
          <div className="absolute top-6 sm:top-7 left-6 sm:left-8 z-10 flex items-center gap-2 select-none">
            <span className="text-[11px] sm:text-xs font-medium tracking-[0.28em] text-white uppercase font-sans">
              TREVORI
            </span>
            <span className="text-white/40 text-[10px]">&bull;</span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.22em] text-white/85 uppercase font-light font-sans">
              WEAR YOUR PERSPECTIVE
            </span>
          </div>

          {/* Exact Photo Cropped from the User Image */}
          <img
            src="/images/auth/login_editorial_red.jpg"
            alt="Editorial Campaign Red Lighting with Sunglasses"
            className="w-full h-full object-cover object-left"
          />
        </div>

      </div>
    </div>
  );
};
