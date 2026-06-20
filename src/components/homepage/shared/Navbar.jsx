'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Moon,
  Sun,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────
    NAV LINKS (WITH SECTIONS)
───────────────────────────────────────── */
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Browse Books', href: '/browsebooks' },
  { label: 'How It Works', href: '/#how-it-works', isScroll: true },
  { label: 'About Us', href: '/aboutUs' },
  { label: 'Contact', href: '/#contact', isScroll: true },
];

/* ─────────────────────────────────────────
    AVATAR COMPONENT
───────────────────────────────────────── */
function Avatar({ user, size = 32 }) {
  if (user?.image) {
    return (
      <Image
        src={user.image}
        alt={user.name || 'User'}
        width={size}
        height={size}
        className="rounded-full object-cover aspect-square shrink-0 ring-2 ring-[#6D4AFF]/40"
      />
    );
  }
  return (
    <div
      className="rounded-full bg-gradient-to-br from-[#6D4AFF] to-[#8B5CF6] flex items-center justify-center ring-2 ring-[#6D4AFF]/40 shrink-0 select-none"
      style={{ width: size, height: size }}
    >
      <span className="text-white font-bold" style={{ fontSize: size * 0.38 }}>
        {user?.name?.[0]?.toUpperCase() ?? <User size={size * 0.5} />}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
    NAVBAR COMPONENT
═══════════════════════════════════════════ */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // ─ Intersection Observer
  const [activeSection, setActiveSection] = useState('home');

  const userMenuRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('bibliodrop-theme');
    const dark = saved ? saved === 'dark' : true;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // ── Intersection Observer:
  useEffect(() => {
    if (pathname !== '/') return;

    const sections = ['how-it-works', 'categories', 'contact'];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        } else if (!entry.isIntersecting && activeSection === entry.target.id) {
          setActiveSection('home');
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScrollTop = () => {
      if (window.scrollY < 120) {
        setActiveSection('home');
      }
    };
    window.addEventListener('scroll', handleScrollTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollTop);
    };
  }, [pathname, activeSection]);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fn = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('bibliodrop-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleNavLinkClick = (e, link) => {
    if (link.isScroll) {
      if (pathname === '/') {
        e.preventDefault();
        const targetId = link.href.replace('/#', '');
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(targetId);
        }
      }
    }
    setMobileOpen(false);
  };

  const isActive = (link) => {
    if (pathname === '/') {
      if (link.href === '/') return activeSection === 'home';
      if (link.isScroll) {
        return activeSection === link.href.replace('/#', '');
      }
      return false;
    }

    if (link.isScroll) return false;
    return link.href === '/'
      ? pathname === '/'
      : pathname.startsWith(link.href);
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Logged out successfully! 👋');
            router.push('/');
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-transparent" />
    );
  }

  return (
    <>
      {/* HEADER */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#05081F]/90 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group no-underline"
          >
            <div className="w-[38px] h-[38px] rounded-[11px] shrink-0 bg-gradient-to-br from-[#6D4AFF] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_18px_rgba(109,74,255,0.5)] group-hover:shadow-[0_0_28px_rgba(109,74,255,0.7)] transition-shadow duration-300">
              <BookOpen size={20} color="#fff" strokeWidth={2} />
            </div>
            <div className="leading-none">
              <p className="text-[24px] font-extrabold tracking-tight text-gray-900 dark:text-white m-0">
                Biblio<span className="text-[#6D4AFF]">Drop</span>
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] mt-0.5 text-gray-500 dark:text-[#B8B8C5] m-0">
                Books at Your Doorstep
              </p>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <ul className="hidden lg:flex items-center gap-0.5 list-none m-0 p-0 flex-1 justify-center">
            {navLinks.map((link) => {
              const active = isActive(link);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavLinkClick(e, link)}
                    className={`block px-4 py-2 rounded-full text-sm font-medium no-underline transition-all duration-200 ${
                      active
                        ? 'bg-[#3B2B8A] dark:bg-[#2D1F6E] text-white shadow-[0_2px_12px_rgba(109,74,255,0.35)]'
                        : 'text-gray-600 dark:text-[#B8B8C5] hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden lg:flex w-9 h-9 rounded-full items-center justify-center border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 text-gray-600 dark:text-[#B8B8C5] hover:text-gray-900 dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10 shadow-sm dark:shadow-none transition-all duration-200 cursor-pointer"
            >
              {isDark ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {!user && (
              <>
                <Link
                  href="/auth/login"
                  className="hidden lg:block px-4 py-2 rounded-full text-sm font-medium no-underline text-gray-600 dark:text-[#B8B8C5] hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="hidden lg:flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold no-underline bg-[#F7B500] text-[#05081F] shadow-[0_0_20px_rgba(247,181,0,0.25)] hover:bg-[#FFD04D] hover:shadow-[0_0_28px_rgba(247,181,0,0.45)] hover:scale-[1.03] transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <div ref={userMenuRef} className="hidden lg:block relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/16 shadow-sm dark:shadow-none transition-all duration-200 cursor-pointer"
                >
                  <Avatar user={user} size={28} />
                  <span className="text-sm font-semibold text-gray-800 dark:text-white max-w-[80px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-500 dark:text-[#B8B8C5] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute top-[calc(100%+10px)] right-0 z-50 w-[220px] rounded-2xl overflow-hidden border border-black/8 dark:border-white/8 bg-white dark:bg-[#0D1035] shadow-[0_16px_48px_rgba(0,0,0,0.14)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.65)]"
                    >
                      <div className="px-4 py-3.5 border-b border-black/6 dark:border-white/6 flex items-center gap-3">
                        <Avatar user={user} size={36} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate m-0">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-[#B8B8C5] truncate m-0">
                            {user.email}
                          </p>
                          <p className="text-[10px] mt-1 m-0">
                            <span className="inline-flex items-center px-2 py-0.5 font-bold uppercase tracking-wider rounded-md bg-[#6C47FF]/15 text-[#A78BFA] border border-[#6C47FF]/20 dark:bg-[#6C47FF]/20 dark:text-[#C5C9E0] dark:border-[#6C47FF]/30">
                              {user.role}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="p-1.5">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium no-underline text-gray-700 dark:text-[#B8B8C5] hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/6 transition-all duration-150"
                        >
                          <LayoutDashboard
                            size={15}
                            className="text-[#6D4AFF] shrink-0"
                          />
                          Dashboard
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-left text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-150 cursor-pointer border-none bg-transparent"
                        >
                          <LogOut size={15} className="shrink-0" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex lg:hidden w-9 h-9 rounded-full items-center justify-center border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-gray-900 dark:text-white cursor-pointer transition-all duration-200"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-center"
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-40 lg:hidden w-[min(300px,100vw)] flex flex-col bg-white dark:bg-[#08092A] border-l border-black/8 dark:border-white/8 shadow-[-16px_0_48px_rgba(0,0,0,0.1)] dark:shadow-[-16px_0_48px_rgba(0,0,0,0.6)] pt-[80px] pb-8"
            >
              {user && (
                <div className="mx-4 mb-3 p-3.5 rounded-2xl border border-black/6 dark:border-white/8 bg-black/3 dark:bg-white/4 flex items-center gap-3">
                  <Avatar user={user} size={40} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate m-0">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-[#B8B8C5] truncate m-0">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-0.5 px-4 flex-1 overflow-y-auto">
                {navLinks.map((link, i) => {
                  const active = isActive(link);
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.045, duration: 0.22 }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => handleNavLinkClick(e, link)}
                        className={`flex items-center px-4 py-3 rounded-xl text-[15px] font-medium no-underline transition-all duration-150 ${
                          active
                            ? 'bg-[#3B2B8A]/12 dark:bg-[#2D1F6E]/40 text-[#6D4AFF] dark:text-white'
                            : 'text-gray-700 dark:text-[#B8B8C5] hover:bg-black/5 dark:hover:bg-white/6 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.045 }}
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[15px] font-medium no-underline text-gray-700 dark:text-[#B8B8C5] hover:bg-black/5 dark:hover:bg-white/6 hover:text-gray-900 dark:hover:text-white transition-all duration-150"
                    >
                      <LayoutDashboard size={16} className="text-[#6D4AFF]" />
                      Dashboard
                    </Link>
                  </motion.div>
                )}
              </div>

              <div className="px-4 pt-4 flex flex-col gap-2.5 border-t border-black/6 dark:border-white/8 mt-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-black/8 dark:border-white/8 bg-black/3 dark:bg-white/4 text-sm font-medium text-gray-700 dark:text-[#B8B8C5] cursor-pointer transition-all duration-200"
                >
                  {isDark ? (
                    <Moon size={16} className="text-[#6D4AFF]" />
                  ) : (
                    <Sun size={16} className="text-amber-500" />
                  )}
                  {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>

                {!user ? (
                  <>
                    <Link
                      href="/auth/login"
                      className="block text-center py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/4 dark:bg-white/5 text-sm font-semibold no-underline text-gray-900 dark:text-white transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block text-center py-3 rounded-xl bg-[#F7B500] text-[#05081F] text-sm font-bold no-underline shadow-[0_4px_16px_rgba(247,181,0,0.3)] transition-all duration-200"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-sm font-semibold text-red-500 dark:text-red-400 cursor-pointer transition-all duration-200"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
