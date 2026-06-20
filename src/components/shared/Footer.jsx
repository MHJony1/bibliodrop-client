'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, Mail, Phone, MapPin, 
  ArrowRight, ShieldCheck, RefreshCw, Truck 
} from 'lucide-react';
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
   if(pathname?.includes('dashboard')){
    return null;
  }

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse Books', href: '/browsebooks' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Categories', href: '/categories' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Refund Policy', href: '/refund' },
  ];

  return (
    <footer id="contact" className="relative bg-[#05081F] border-t border-white/5 text-[#B8B8C5] overflow-hidden pt-16 pb-8 font-sans">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6D4AFF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F7B500]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ───────────── TOP SECTION: NEWSLETTER ───────────── */}
        <div className="bg-gradient-to-r from-[#0D1035] to-[#12164A] border border-white/5 rounded-3xl p-6 sm:p-10 mb-16 shadow-[0_12px_40px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Subscribe to Our <span className="text-[#F7B500]">Newsletter</span>
            </h3>
            <p className="text-sm text-[#B8B8C5] mt-2">
              Get the latest book recommendations, literary insights, and premium delivery deals directly to your inbox.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="w-full lg:max-w-md flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full pl-11 pr-4 py-3.5 bg-[#05081F] border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF] transition-all duration-200"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-[#F7B500] text-[#05081F] font-bold text-sm rounded-xl hover:bg-[#FFD04D] shadow-[0_4px_20px_rgba(247,181,0,0.2)] hover:scale-[1.02] transition-all duration-200 shrink-0 cursor-pointer"
            >
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ───────────── MIDDLE SECTION: LINKS & INFO ───────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/5">
          
          {/* Column 1: Brand & About */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 no-underline group">
              <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-[#6D4AFF] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_18px_rgba(109,74,255,0.4)]">
                <BookOpen size={20} color="#fff" strokeWidth={2} />
              </div>
              <div className="leading-none">
                <p className="text-2xl font-extrabold tracking-tight text-white m-0">
                  Biblio<span className="text-[#6D4AFF]">Drop</span>
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] mt-0.5 text-gray-400 m-0">
                  Books at Your Doorstep
                </p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Connecting readers with local libraries for seamless, luxury doorstep book delivery. Your next great literary journey is just a click away. Experience premium service tailored for true bibliophiles.
            </p>
            
            {/* Social Icons (Fixed with React Icons) */}
            <div className="flex items-center gap-3 mt-2">
              {[
                { Icon: FaFacebookF, href: '#' },
                { Icon: FaXTwitter, href: '#' },
                { Icon: FaInstagram, href: '#' },
                { Icon: FaLinkedinIn, href: '#' }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#6D4AFF] hover:border-[#6D4AFF] hover:shadow-[0_0_15px_rgba(109,74,255,0.4)] transition-all duration-300"
                >
                  <social.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 lg:pl-4">
            <h4 className="text-white font-bold text-base tracking-wide mb-5 relative before:content-[''] before:absolute before:bottom-[-6px] before:left-0 before:w-6 before:h-[2px] before:bg-[#6D4AFF]">
              Quick Links
            </h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white no-underline transition-colors duration-200 flex items-center group">
                    <span className="w-0 group-hover:w-2.5 h-[1.5px] bg-[#6D4AFF] mr-0 group-hover:mr-2 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-base tracking-wide mb-5 relative before:content-[''] before:absolute before:bottom-[-6px] before:left-0 before:w-6 before:h-[2px] before:bg-[#6D4AFF]">
              Legal
            </h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white no-underline transition-colors duration-200 flex items-center group">
                    <span className="w-0 group-hover:w-2.5 h-[1.5px] bg-[#6D4AFF] mr-0 group-hover:mr-2 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="text-white font-bold text-base tracking-wide mb-1 relative before:content-[''] before:absolute before:bottom-[-6px] before:left-0 before:w-6 before:h-[2px] before:bg-[#6D4AFF]">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3.5 mt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#6D4AFF] shrink-0 mt-1" />
                <span className="text-sm text-gray-400 leading-relaxed">
                  123 Library Lane, Bookville, BK 10001
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#6D4AFF] shrink-0" />
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#6D4AFF] shrink-0" />
                <span className="text-sm text-gray-400">hello@bibliodrop.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* ───────────── BOTTOM SECTION: TRUST BADGES & COPYRIGHT ───────────── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <p className="text-xs text-gray-500 text-center md:text-left order-2 md:order-1">
            © {currentYear} <span className="text-gray-400 font-medium">BiblioDrop</span>. All rights reserved. Designed with precision.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 order-1 md:order-2">
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/2 px-3 py-1.5 rounded-lg border border-white/5">
              <Truck className="w-3.5 h-3.5 text-[#F7B500]" />
              <span>Express Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/2 px-3 py-1.5 rounded-lg border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6D4AFF]" />
              <span>Secure Systems</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/2 px-3 py-1.5 rounded-lg border border-white/5">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
              <span>Easy Returns</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;