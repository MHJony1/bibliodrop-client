'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Truck, BookOpen, MessageSquare, Heart, 
  PlusCircle, Boxes, ClipboardList, UserCheck, ShieldAlert, History, LogOut, X, Sparkles
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const menuConfigs = {
  user: [
    { label: 'Overview', path: '/dashboard/user', icon: LayoutDashboard },
    { label: 'Delivery History', path: '/dashboard/user/delivery-history', icon: Truck },
    { label: 'Reading List', path: '/dashboard/user/reading-list', icon: BookOpen },
    { label: 'My Reviews', path: '/dashboard/user/my-reviews', icon: MessageSquare },
    { label: 'Wishlist', path: '/dashboard/user/wishlist', icon: Heart },
  ],
  librarian: [
    { label: 'Overview', path: '/dashboard/librarian', icon: LayoutDashboard },
    { label: 'Add Book', path: '/dashboard/librarian/add-book', icon: PlusCircle },
    { label: 'Manage Inventory', path: '/dashboard/librarian/manage-inventory', icon: Boxes },
    { label: 'Manage Deliveries', path: '/dashboard/librarian/manage-deliveries', icon: ClipboardList },
  ],
  admin: [
    { label: 'Overview', path: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Book Approvals', path: '/dashboard/admin/book-approvals', icon: ShieldAlert },
    { label: 'Manage Users', path: '/dashboard/admin/manage-users', icon: UserCheck },
    { label: 'Manage Books', path: '/dashboard/admin/manage-books', icon: BookOpen },
    { label: 'Transactions', path: '/dashboard/admin/transactions', icon: History },
  ]
};

export default function DashboardSidebar({ currentUser, closeSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = currentUser?.role?.toLowerCase() || 'user';
  const activeMenus = menuConfigs[role] || menuConfigs['user'];

  const handleSignOut = async () => {
    closeSidebar?.();
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Logged out successfully! 👋');
            window.location.href = '/auth/login';
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error('Sidebar sign out mismatch:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="h-full flex flex-col justify-between bg-[#0A0D22] border-r border-white/[0.03]">
      <div>
        {/* Brand Showcase Layout */}
        <div className="h-20 px-6 border-b border-white/[0.03] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#5046E5] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(80,70,229,0.3)]">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Biblio<span className="text-[#F59E0B]">Drop</span>
            </span>
          </Link>
          
          <button 
            onClick={closeSidebar} 
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-xl bg-white/[0.02] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Dynamic Route Segment Navigation Link Loop */}
        <nav className="p-4 space-y-1 mt-6">
          <span className="px-3 mb-2.5 block text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            {role} Workspace
          </span>
          
          {activeMenus.map((menu, idx) => {
            const IconComponent = menu.icon;
            const isActive = pathname === menu.path;
            
            return (
              <Link
                key={idx}
                href={menu.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#5046E5]/10 text-[#818CF8] font-semibold border-r-2 border-[#5046E5]' 
                    : 'text-gray-400 hover:bg-white/[0.02] hover:text-white'
                }`}
              >
                <IconComponent size={16} className={isActive ? 'text-[#818CF8]' : 'text-gray-400 group-hover:text-white transition-colors'} />
                {menu.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Decorative Interactive Metrics Panel & Operational Footer */}
      <div className="p-4 space-y-4">
        
        {/* Visual Dashboard Feature Card Enhancement */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.04] relative overflow-hidden group">
          <div className="absolute -right-3 -bottom-3 w-12 h-12 bg-[#5046E5]/10 rounded-full blur-xl group-hover:bg-[#5046E5]/20 transition-all duration-500" />
          <div className="flex items-center gap-2 text-[#818CF8] text-[11px] font-bold tracking-wider uppercase mb-1.5">
            <Sparkles size={12} className="animate-pulse" />
            Platform Status
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            Database connections secured. Workspace sync operational.
          </p>
          <div className="mt-2.5 w-full bg-white/[0.05] h-[3px] rounded-full overflow-hidden">
            <div className="w-[88%] h-full bg-gradient-to-r from-[#5046E5] to-[#7C3AED] rounded-full" />
          </div>
        </div>

        <div className="h-[1px] bg-white/[0.04]" />

        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer bg-transparent border-none text-left"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}