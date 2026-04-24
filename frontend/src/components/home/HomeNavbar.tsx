import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import './HomeNavbar.css';

// ─── Data ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Explore',       href: '/app/dashboard',  icon: '✦' },
  { label: 'Flights',       href: '/app/flights',     icon: null },
  { label: 'Hotels & Stays',href: '/app/hotels',      icon: null },
  { label: 'Things To Do',  href: '/app/activities',  icon: null },
  { label: 'Travel Guides', href: '/app/guide-booking',icon: null },
];

const COUNTRIES = [
  { code: 'IN', name: 'India',          flag: '🇮🇳', currency: 'INR', symbol: '₹'  },
  { code: 'US', name: 'United States',  flag: '🇺🇸', currency: 'USD', symbol: '$'  },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£'  },
  { code: 'AE', name: 'UAE',            flag: '🇦🇪', currency: 'AED', symbol: 'د.إ'},
  { code: 'SG', name: 'Singapore',      flag: '🇸🇬', currency: 'SGD', symbol: 'S$' },
  { code: 'JP', name: 'Japan',          flag: '🇯🇵', currency: 'JPY', symbol: '¥'  },
  { code: 'EU', name: 'Europe',         flag: '🇪🇺', currency: 'EUR', symbol: '€'  },
  { code: 'AU', name: 'Australia',      flag: '🇦🇺', currency: 'AUD', symbol: 'A$' },
];

const CURRENCIES = [
  { code: 'INR', symbol: '₹',   name: 'Indian Rupee'   },
  { code: 'USD', symbol: '$',   name: 'US Dollar'       },
  { code: 'EUR', symbol: '€',   name: 'Euro'            },
  { code: 'GBP', symbol: '£',   name: 'British Pound'   },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham'      },
  { code: 'SGD', symbol: 'S$',  name: 'Singapore Dollar'},
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen'    },
  { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar'},
];

// ─── Logo SVG ─────────────────────────────────────────────────────────────────
// A compass-rose inspired mark: thin concentric ring with a stylised T formed
// by two crossing lines and four cardinal tick marks. Pure SVG, no images.

const TravouraLogoMark: React.FC<{ scrolled: boolean }> = ({ scrolled }) => {
  const accent = '#C9A84C';
  const fill   = scrolled ? '#1A1A1A' : '#FDFCFA';
  return (
    <svg
      className="tnav-logo-icon"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Travoura logo mark"
    >
      {/* Outer ring */}
      <circle cx="16" cy="16" r="14.5" stroke={accent} strokeWidth="1" opacity="0.6" />
      {/* Inner ring */}
      <circle cx="16" cy="16" r="10" stroke={fill} strokeWidth="0.75" opacity="0.3" />
      {/* Cardinal tick marks (N S E W) */}
      <line x1="16" y1="1"  x2="16" y2="5"  stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="27" x2="16" y2="31" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1"  y1="16" x2="5"  y2="16" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27" y1="16" x2="31" y2="16" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      {/* Diagonal ticks */}
      <line x1="5.5"  y1="5.5"  x2="7.7"  y2="7.7"  stroke={fill} strokeWidth="0.75" strokeLinecap="round" opacity="0.4" />
      <line x1="24.3" y1="24.3" x2="26.5" y2="26.5" stroke={fill} strokeWidth="0.75" strokeLinecap="round" opacity="0.4" />
      <line x1="26.5" y1="5.5"  x2="24.3" y2="7.7"  stroke={fill} strokeWidth="0.75" strokeLinecap="round" opacity="0.4" />
      <line x1="7.7"  y1="24.3" x2="5.5"  y2="26.5" stroke={fill} strokeWidth="0.75" strokeLinecap="round" opacity="0.4" />
      {/* Centre diamond (the "north star" focal point) */}
      <path
        d="M16 11 L18 16 L16 21 L14 16 Z"
        fill={accent}
        opacity="0.9"
      />
      <circle cx="16" cy="16" r="2" fill={fill} />
    </svg>
  );
};

// ─── Chevron Icon ─────────────────────────────────────────────────────────────

const ChevronDown: React.FC<{ open?: boolean; size?: number }> = ({ open, size = 12 }) => (
  <svg
    className={`tnav-chevron${open ? ' open' : ''}`}
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="2,4 6,8 10,4" />
  </svg>
);

// ─── Bell Icon ────────────────────────────────────────────────────────────────

const BellIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

// ─── Hook: close on outside click ────────────────────────────────────────────

function useOutsideClick(
  refs: React.RefObject<HTMLElement>[],
  callback: () => void
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (refs.every(r => r.current && !r.current.contains(e.target as Node))) {
        callback();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [refs, callback]);
}

// ─── Main Component ───────────────────────────────────────────────────────────

const HomeNavbar: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, signOut } = useAuth();

  // ── Scroll state ──
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Dropdown open states ──
  const [avatarOpen,   setAvatarOpen]   = useState(false);
  const [countryOpen,  setCountryOpen]  = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  // ── Selector values ──
  const [selectedCountry,  setSelectedCountry]  = useState(COUNTRIES[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);

  // ── Refs for outside click detection ──
  const avatarRef   = useRef<HTMLDivElement>(null);
  const countryRef  = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const closeAll = useCallback(() => {
    setAvatarOpen(false);
    setCountryOpen(false);
    setCurrencyOpen(false);
  }, []);

  useOutsideClick([avatarRef], () => setAvatarOpen(false));
  useOutsideClick([countryRef], () => setCountryOpen(false));
  useOutsideClick([currencyRef], () => setCurrencyOpen(false));

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // ── User info ──
  const userName  = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveller';
  const userEmail = user?.email || '';
  const initials  = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const wrapperClass = `tnav-wrapper ${scrolled ? 'frosted' : 'transparent'}`;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <nav className={wrapperClass} role="navigation" aria-label="Main navigation">

        {/* ══ LAYER 1: Utility strip (hidden when scrolled) ══ */}
        <div className={`tnav-strip ${scrolled ? 'hidden-strip' : ''}`}>

          {/* Country selector */}
          <div ref={countryRef} style={{ position: 'relative' }}>
            <button
              className="tnav-selector"
              onClick={() => { setCountryOpen(o => !o); setCurrencyOpen(false); setAvatarOpen(false); }}
              aria-expanded={countryOpen}
              aria-haspopup="listbox"
              title="Select country"
            >
              {/* Flag circle */}
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, lineHeight: 1, flexShrink: 0,
                overflow: 'hidden', border: '1px solid rgba(232,220,200,0.3)',
              }}>
                {selectedCountry.flag}
              </span>
              <span>{selectedCountry.name}</span>
              <ChevronDown open={countryOpen} />
            </button>

            {countryOpen && (
              <div className="tnav-dropdown tnav-dropdown-selector" role="listbox" aria-label="Select country">
                {COUNTRIES.map(c => (
                  <button
                    key={c.code}
                    className={`tnav-selector-option ${selectedCountry.code === c.code ? 'active' : ''}`}
                    role="option"
                    aria-selected={selectedCountry.code === c.code}
                    onClick={() => {
                      setSelectedCountry(c);
                      // Auto-match currency to country
                      const matchedCurrency = CURRENCIES.find(cu => cu.code === c.currency);
                      if (matchedCurrency) setSelectedCurrency(matchedCurrency);
                      setCountryOpen(false);
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{c.flag}</span>
                    <span>{c.name}</span>
                    {selectedCountry.code === c.code && (
                      <span style={{ marginLeft: 'auto', color: '#C9A84C', fontSize: 12 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency selector */}
          <div ref={currencyRef} style={{ position: 'relative' }}>
            <button
              className="tnav-selector"
              onClick={() => { setCurrencyOpen(o => !o); setCountryOpen(false); setAvatarOpen(false); }}
              aria-expanded={currencyOpen}
              aria-haspopup="listbox"
              title="Select currency"
            >
              <span style={{
                fontSize: 12, fontFamily: 'DM Sans, system-ui, sans-serif',
                fontWeight: 500, color: '#C9A84C',
              }}>
                {selectedCurrency.symbol}
              </span>
              <span>{selectedCurrency.code}</span>
              <ChevronDown open={currencyOpen} />
            </button>

            {currencyOpen && (
              <div className="tnav-dropdown tnav-dropdown-selector" role="listbox" aria-label="Select currency">
                {CURRENCIES.map(c => (
                  <button
                    key={c.code}
                    className={`tnav-selector-option ${selectedCurrency.code === c.code ? 'active' : ''}`}
                    role="option"
                    aria-selected={selectedCurrency.code === c.code}
                    onClick={() => { setSelectedCurrency(c); setCurrencyOpen(false); }}
                  >
                    <span style={{
                      width: 22, textAlign: 'center', fontSize: 13,
                      fontWeight: 600, color: '#C9A84C', flexShrink: 0,
                    }}>
                      {c.symbol}
                    </span>
                    <span>{c.code}</span>
                    <span style={{ color: '#9B9590', fontSize: 12, marginLeft: 4 }}>{c.name}</span>
                    {selectedCurrency.code === c.code && (
                      <span style={{ marginLeft: 'auto', color: '#C9A84C', fontSize: 12 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth buttons (shown when NOT logged in) */}
          {!user && (
            <>
              <div className="tnav-divider" />
              <button className="tnav-btn-signin" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="tnav-btn-register" onClick={() => navigate('/signup')}>
                Get Started →
              </button>
            </>
          )}

          {/* Compact user greeting when logged in */}
          {user && (
            <>
              <div className="tnav-divider" />
              <span style={{
                fontFamily: 'DM Sans, system-ui, sans-serif',
                fontSize: 12, color: 'rgba(253,252,250,0.55)',
                transition: 'color 350ms ease',
              }}
                className={scrolled ? '' : ''}
              >
                Welcome back,{' '}
                <span style={{ color: '#C9A84C', fontWeight: 500 }}>
                  {userName.split(' ')[0]}
                </span>
              </span>
            </>
          )}
        </div>

        {/* ══ LAYER 2: Main navigation bar ══ */}
        <div className="tnav-main">

          {/* Logo */}
          <button
            className="tnav-logo"
            onClick={() => navigate('/home')}
            aria-label="Go to Travoura home"
          >
            <TravouraLogoMark scrolled={scrolled} />
            <span className="tnav-logo-word">Travoura</span>
          </button>

          {/* Nav links — centered via absolute position in CSS */}
          <nav className="tnav-links" aria-label="Primary navigation">
            {NAV_ITEMS.map(item => (
              <button
                key={item.href}
                className={`tnav-link${location.pathname === item.href ? ' active' : ''}`}
                onClick={() => navigate(item.href)}
                aria-current={location.pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}

            {/* AI Planner — featured item */}
            <button
              className="tnav-link tnav-link-ai"
              onClick={() => navigate('/generate-itinerary')}
            >
              ✦ Plan with AI
            </button>
          </nav>

          {/* Right side controls */}
          <div className="tnav-right">

            {/* Notification bell */}
            <button className="tnav-bell" aria-label="Notifications" title="Notifications">
              <BellIcon />
              {/* Dot indicator */}
              <span className="tnav-bell-dot" aria-hidden="true" />
            </button>

            {/* User avatar + dropdown — shown when logged in */}
            {user && (
              <div ref={avatarRef} style={{ position: 'relative' }}>
                <button
                  className="tnav-avatar"
                  onClick={() => { setAvatarOpen(o => !o); setCountryOpen(false); setCurrencyOpen(false); }}
                  aria-expanded={avatarOpen}
                  aria-haspopup="menu"
                  aria-label={`Account menu for ${userName}`}
                  title={userName}
                >
                  {initials}
                </button>

                {avatarOpen && (
                  <div className="tnav-dropdown tnav-dropdown-avatar" role="menu">
                    {/* User info */}
                    <div className="tnav-dropdown-header">
                      <div className="tnav-dropdown-header-name">{userName}</div>
                      <div className="tnav-dropdown-header-email">{userEmail}</div>
                    </div>

                    {/* My Dashboard */}
                    <button
                      role="menuitem"
                      className="tnav-dropdown-item"
                      onClick={() => { navigate('/app/dashboard'); setAvatarOpen(false); }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="7" height="7" rx="1"/>
                      </svg>
                      My Dashboard
                    </button>

                    {/* My Trips */}
                    <button
                      role="menuitem"
                      className="tnav-dropdown-item"
                      onClick={() => { navigate('/trips'); setAvatarOpen(false); }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      My Trips
                    </button>

                    {/* AI Itineraries */}
                    <button
                      role="menuitem"
                      className="tnav-dropdown-item"
                      onClick={() => { navigate('/itineraries'); setAvatarOpen(false); }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                      </svg>
                      AI Itineraries
                    </button>

                    {/* Budget Tracker */}
                    <button
                      role="menuitem"
                      className="tnav-dropdown-item"
                      onClick={() => { navigate('/app/budget'); setAvatarOpen(false); }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      Budget Tracker
                    </button>

                    <div className="tnav-dropdown-sep" />

                    {/* Preferences */}
                    <button
                      role="menuitem"
                      className="tnav-dropdown-item"
                      onClick={() => { navigate('/app/settings'); setAvatarOpen(false); }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                      </svg>
                      Preferences & Settings
                    </button>

                    {/* Sign Out */}
                    <button
                      role="menuitem"
                      className="tnav-dropdown-item signout"
                      onClick={handleSignOut}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sign in / Get Started — shown when NOT logged in (in main bar, compact) */}
            {!user && (
              <>
                <div className="tnav-divider" />
                <button
                  className="tnav-btn-signin"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
                <button
                  className="tnav-btn-register"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="tnav-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                <line x1="3" y1="7"  x2="21" y2="7"  />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="17" y2="17" />
              </svg>
            </button>

          </div>
        </div>
      </nav>

      {/* ══ MOBILE DRAWER ══ */}
      {mobileOpen && (
        <div className="tnav-mobile-drawer" aria-modal="true" role="dialog" aria-label="Navigation menu">
          <div className="tnav-mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div className="tnav-mobile-panel">
            <button className="tnav-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6"  y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Logo in drawer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, paddingLeft: 4 }}>
              <TravouraLogoMark scrolled={true} />
              <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, color: '#1A1A1A' }}>
                Travoura
              </span>
            </div>

            {/* Nav links */}
            {NAV_ITEMS.map(item => (
              <button
                key={item.href}
                className="tnav-mobile-link"
                onClick={() => navigate(item.href)}
              >
                {item.label}
              </button>
            ))}
            <button
              className="tnav-mobile-link ai-link"
              onClick={() => navigate('/generate-itinerary')}
            >
              ✦ Plan with AI
            </button>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(232,220,200,0.4)', margin: '12px 0' }} />

            {/* Country + Currency selectors stacked */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <button
                className="tnav-selector"
                style={{ flex: 1, justifyContent: 'center', border: '1px solid rgba(232,220,200,0.5)', borderRadius: 8, padding: '8px 12px', color: '#6B6560' }}
                onClick={() => { setCountryOpen(o => !o); }}
              >
                <span style={{ fontSize: 16 }}>{selectedCountry.flag}</span>
                <span style={{ fontSize: 13 }}>{selectedCountry.name}</span>
              </button>
              <button
                className="tnav-selector"
                style={{ flex: 1, justifyContent: 'center', border: '1px solid rgba(232,220,200,0.5)', borderRadius: 8, padding: '8px 12px', color: '#6B6560' }}
                onClick={() => { setCurrencyOpen(o => !o); }}
              >
                <span style={{ fontSize: 13, color: '#C9A84C', fontWeight: 600 }}>{selectedCurrency.symbol}</span>
                <span style={{ fontSize: 13 }}>{selectedCurrency.code}</span>
              </button>
            </div>

            {/* Account actions */}
            {user ? (
              <>
                <button className="tnav-mobile-link" onClick={() => navigate('/app/dashboard')}>⊞  My Dashboard</button>
                <button className="tnav-mobile-link" onClick={() => navigate('/trips')}>◎  My Trips</button>
                <button className="tnav-mobile-link" onClick={() => navigate('/app/budget')}>₹  Budget Tracker</button>
                <button className="tnav-mobile-link" style={{ color: '#B33A3A' }} onClick={handleSignOut}>→  Sign Out</button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  style={{ flex: 1, padding: '11px 0', borderRadius: 8, border: '1px solid rgba(232,220,200,0.6)', background: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#6B6560', cursor: 'pointer' }}
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
                <button
                  style={{ flex: 1, padding: '11px 0', borderRadius: 8, border: 'none', background: '#1A1A1A', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, color: '#F7F5F0', cursor: 'pointer' }}
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomeNavbar;
