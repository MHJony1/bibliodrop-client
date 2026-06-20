'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Bell, ChevronDown, Menu, Search, LogOut, Settings, Shield } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function DashboardNavbar({ currentUser, toggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fallback extraction matching application state model
  const userName = currentUser?.name || currentUser?.displayName || 'User Member';
  const userEmail = currentUser?.email || 'member@bibliodrop.com';
  const role = currentUser?.role || 'User';
  const userAvatar = currentUser?.image || currentUser?.photoURL || null;

  // Global click tracking listener to dismiss drawer view safely
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Native Better Auth logic to sync drop-down termination with home channel
  const handleSignOut = async () => {
    setIsDropdownOpen(false);
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
      console.error('Dashboard logout crash:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const getDynamicTitle = () => {
    const paths = pathname.split('/').filter(Boolean);
    if (paths.length <= 2) return 'Overview';
    return paths[paths.length - 1]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <header className="h-20 w-full border-b border-white/[0.04] bg-[#0A0E22]/75 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 transition-all duration-300">
      
      {/* Left Segment: Device Control & Header Context */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button 
          onClick={toggleSidebar}
          className="md:hidden text-gray-400 hover:text-white p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl cursor-pointer transition-all active:scale-95"
        >
          <Menu size={20} />
        </button>

        <div className="hidden lg:block relative w-full max-w-xs group">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#818CF8] transition-colors" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="w-full bg-[#050714]/60 border border-white/[0.05] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#5046E5]/60 focus:ring-1 focus:ring-[#5046E5]/30 transition-all"
          />
        </div>

        <div className="lg:hidden">
          <h2 className="text-sm font-bold text-white tracking-wide">{getDynamicTitle()}</h2>
        </div>
      </div>

      {/* Right Segment: Application Tools & Profile Identity Layer */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        <Link 
          href="/" 
          className="text-[11px] font-semibold text-gray-400 hover:text-white transition-all flex items-center gap-1.5 bg-white/[0.02] px-3 py-2 rounded-xl border border-white/[0.04] hover:bg-white/[0.05]"
        >
          <Home size={13} />
          <span className="hidden sm:inline">Portal Home</span>
        </Link>

        <button className="text-gray-400 hover:text-white p-2 bg-white/[0.02] border border-white/[0.04] rounded-xl cursor-pointer relative transition-all hover:bg-white/[0.04]">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#5046E5] rounded-full shadow-[0_0_10px_rgba(80,70,229,0.6)]" />
        </button>

        <div className="w-[1px] h-5 bg-white/[0.08]" />

        {/* Profile Interactive Panel Layout */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.03] transition-all cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white tracking-wide">{userName}</div>
              <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[8px] font-black tracking-widest uppercase rounded bg-[#5046E5]/15 border border-[#5046E5]/30 text-[#818CF8]">
                {role}
              </span>
            </div>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5046E5] to-[#7C3AED] p-[1px] shadow-[0_0_15px_rgba(80,70,229,0.15)] overflow-hidden">
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="w-full h-full object-cover rounded-[10px]" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full bg-[#0A0D22] rounded-[10px] flex items-center justify-center text-white text-xs font-black uppercase">
                  {userName.charAt(0)}
                </div>
              )}
            </div>
            <ChevronDown size={12} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Action Popover Interface Container */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-[#0D112A] border border-white/[0.05] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-white/[0.03] mb-1.5">
                <p className="text-xs text-gray-400 truncate font-medium">{userEmail}</p>
              </div>

              <div className="space-y-0.5">
                <Link 
                  href={`/dashboard/${role.toLowerCase()}`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/[0.03] hover:text-white transition-all"
                >
                  <Shield size={14} className="text-gray-400" />
                  Workspace Hub
                </Link>
                <button 
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/[0.03] hover:text-white transition-all text-left cursor-pointer"
                >
                  <Settings size={14} className="text-gray-400" />
                  Account Settings
                </button>
              </div>

              <div className="h-[1px] bg-white/[0.04] my-1.5" />

              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-all text-left cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out Account
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}