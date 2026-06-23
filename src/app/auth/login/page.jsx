'use client';

import React, { useState, useEffect, useCallback, Suspense  } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ArrowLeft,
  LogIn,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import Link from 'next/link';

const LogInContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // Better-Auth Session Hook
  const { data: session, isPending } = authClient.useSession();

  // ─── 1. STATES DEFINITION ───
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ─── 2. ROLE-BASED REDIRECTION FUNCTION (DECLARED FIRST) ───
  const handleRoleBasedRedirection = useCallback(
  (user) => {
    if (!user) return;

    const userRole = user.role?.trim().toLowerCase();
    const currentPath = window.location.pathname;

    if (userRole === 'admin' && !currentPath.includes('/dashboard/admin')) {
      toast.success('Welcome to Admin Workspace! 🛡️');
      router.push('/dashboard/admin');
    } else if (userRole === 'librarian' && !currentPath.includes('/dashboard/librarian')) {
      toast.success('Welcome to Librarian Portal! 📚');
      router.push('/dashboard/librarian');
    } else if (!currentPath.includes('/dashboard')) {
      toast.success('Welcome back! Logged in successfully. 👋');
      router.push(redirectTo || '/');
    }
    router.refresh();
  },
  [router, redirectTo],
);

  // ─── 3. USEEFFECT FOR AUTO REDIRECT ───
  useEffect(() => {
    if (session?.user) {
      handleRoleBasedRedirection(session.user);
    }
  }, [session, handleRoleBasedRedirection]);

  // ─── 4. HANDLER FUNCTIONS ───
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Credentials Sign-in Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (signInError) {
        toast.error(
          signInError.message || 'Invalid email or password. Please try again.',
        );
        return;
      }

    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: redirectTo,
      });
    } catch (err) {
      console.error('Google auth error:', err);
      toast.error('Google authentication failed. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#05081F] text-white flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-96 sm:w-150 h-96 sm:h-100 bg-[#6D4AFF]/15 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ══════════════ LOGIN CARD ══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md z-10"
      >
        <div
          className="w-full border border-white/5 p-6 sm:p-8 shadow-[0_4px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl rounded-3xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(13, 16, 53, 0.85) 0%, rgba(5, 8, 31, 0.98) 100%)',
          }}
        >
          {/* Top Header */}
          <div className="text-center space-y-2 mb-6 relative">
            <Link
              href="/"
              className="absolute left-0 top-1 text-xs text-white/40 hover:text-[#F7B500] flex items-center gap-1 transition-all duration-200 group no-underline"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />{' '}
              Home
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D4AFF]/10 border border-[#6D4AFF]/20 mb-1 mt-4 sm:mt-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F7B500] animate-pulse" />
              <span className="text-[#F7B500] text-[10px] font-bold tracking-widest uppercase">
                Welcome Back
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
              Biblio<span className="text-[#6D4AFF]">Drop</span> Secure Gateway
            </h2>
            <p className="text-gray-400 text-xs font-medium">
              Enter your credentials to access your personal workspace
            </p>
          </div>

          {/* ── FORM CONTAINER ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div className="w-full space-y-1">
              <label className="text-gray-300 font-semibold text-xs block pl-0.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail
                  className="absolute left-3.5 text-gray-500 pointer-events-none"
                  size={16}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#05081F] border border-white/10 text-white placeholder:text-gray-600 text-sm outline-none transition-all focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF]/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="w-full space-y-1">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-gray-300 font-semibold text-xs">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-[#6D4AFF] hover:text-[#8B5CF6] font-medium no-underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock
                  className="absolute left-3.5 text-gray-500 pointer-events-none"
                  size={16}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-[#05081F] border border-white/10 text-white placeholder:text-gray-600 text-sm outline-none transition-all focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF]/30"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3.5 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || isPending}
                className="w-full h-11 rounded-xl bg-[#F7B500] text-[#05081F] font-bold text-sm transition-all duration-200 active:scale-[0.98] shadow-[0_4px_20px_rgba(247,181,0,0.25)] hover:bg-[#FFD04D] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Verifying Access...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center py-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="px-3 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              Or Connect Via
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full h-11 rounded-xl bg-[#05081F] border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white font-semibold text-xs transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.92 1 12 1 7.35 1 3.37 3.68 1.44 7.6l3.86 3A6.98 6.98 0 0 1 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.82-.07-1.6-.2-2.36H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.62l3.71 2.88c2.17-2 3.43-4.94 3.43-8.65z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.4a6.93 6.93 0 0 1 0-4.8l-3.86-3A11.95 11.95 0 0 0 1 12c0 1.92.45 3.74 1.25 5.37l4.05-3.17z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.71-2.88c-1.1.74-2.5 1.18-4.25 1.18-3.23 0-5.97-2.18-6.95-5.11l-3.96 3.07A11.97 11.97 0 0 0 12 23z"
              />
            </svg>
            <span>Sign In With Google</span>
          </button>

          {/* Redirect Footer */}
          <p className="text-center text-gray-500 text-xs font-medium pt-4 mb-0">
            Don&apos;t have an account yet?{' '}
            <Link
              href={`/auth/register?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-[#6D4AFF] hover:text-[#8B5CF6] font-bold ml-1 cursor-pointer no-underline border-b border-transparent hover:border-[#8B5CF6] transition-all"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default function LogInPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-[#05081F] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6D4AFF]" size={32} />
      </div>
    }>
      <LogInContent />
    </Suspense>
  );
}










