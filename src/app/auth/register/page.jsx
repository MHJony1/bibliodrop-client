'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
  BookOpen,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import Link from 'next/link';

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoUrl: '',
    password: '',
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [role, setRole] = useState('user'); 

  // Real-time Password Validation
  const passwordValidations = {
    hasMinLength: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
  };

  const isPasswordValid =
    passwordValidations.hasMinLength &&
    passwordValidations.hasUppercase &&
    passwordValidations.hasLowercase;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Better-Auth Credentials Signup Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password must fulfill all validation rules.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        image: formData.photoUrl || undefined,
        role: role, // 'user' or 'librarian' passing to Better-Auth
        callbackURL: redirectTo,
      });

      if (signUpError) {
        toast.error(
          signUpError.message || 'Registration failed! Please check your details.'
        );
        setLoading(false);
        return;
      }

      if (data) {
        toast.success('Account created successfully! Welcome to BiblioDrop. 🎉');
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Better-Auth Google OAuth Handler
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
    <div className="w-full min-h-screen bg-[#05081F] text-white flex items-center justify-center px-4 sm:px-6 py-24 relative overflow-hidden">
      {/* Background Glow Effects matching Navbar/Banner */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-96 sm:w-150 h-96 sm:h-100 bg-[#6D4AFF]/15 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md z-10"
      >
        <div
          className="w-full border border-white/5 p-6 sm:p-8 shadow-[0_4px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 16, 53, 0.85) 0%, rgba(5, 8, 31, 0.98) 100%)',
          }}
        >
          {/* Header */}
          <div className="text-center space-y-2 mb-6 relative">
            <Link
              href="/"
              className="absolute left-0 top-1 text-xs text-white/40 hover:text-[#F7B500] flex items-center gap-1 transition-all duration-200 group no-underline"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              Home
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D4AFF]/10 border border-[#6D4AFF]/20 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F7B500] animate-pulse" />
              <span className="text-[#F7B500] text-[10px] font-bold tracking-widest uppercase">
                Premium Literary Dispatch
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
              Biblio<span className="text-[#6D4AFF]">Drop</span>
            </h2>
            <p className="text-gray-400 text-xs font-medium">
              Create an account to start your journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold text-xs block pl-0.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#05081F] border border-white/10 text-white placeholder:text-gray-600 text-sm outline-none transition-all focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF]/30"
                />
              </div>
            </div>

            {/* Profile Picture URL */}
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold text-xs block pl-0.5">
                Profile Picture URL <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="url"
                  name="photoUrl"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.photoUrl}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#05081F] border border-white/10 text-white placeholder:text-gray-600 text-sm outline-none transition-all focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF]/30"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold text-xs block pl-0.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#05081F] border border-white/10 text-white placeholder:text-gray-600 text-sm outline-none transition-all focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF]/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold text-xs block pl-0.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-[#05081F] border border-white/10 text-white placeholder:text-gray-600 text-sm outline-none transition-all focus:border-[#6D4AFF] focus:ring-1 focus:ring-[#6D4AFF]/30"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Validation Bubble */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2.5 pt-1.5 px-1"
                >
                  <div className={`flex items-center gap-1 text-[10px] font-semibold transition-colors ${passwordValidations.hasMinLength ? 'text-green-400' : 'text-gray-500'}`}>
                    <CheckCircle size={10} /> Min 6 chars
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-semibold transition-colors ${passwordValidations.hasUppercase ? 'text-green-400' : 'text-gray-500'}`}>
                    <CheckCircle size={10} /> 1 Uppercase
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-semibold transition-colors ${passwordValidations.hasLowercase ? 'text-green-400' : 'text-gray-500'}`}>
                    <CheckCircle size={10} /> 1 Lowercase
                  </div>
                </motion.div>
              )}
            </div>

            {/* Role Selection (Reader vs Librarian) */}
            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold text-xs block pl-0.5">
                Join BiblioDrop as a
              </label>
              <div className="flex gap-3">
                {/* User / Reader Button */}
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                    role === 'user'
                      ? 'border-[#6D4AFF] bg-[#6D4AFF]/10 text-white shadow-[0_0_12px_rgba(109,74,255,0.2)]'
                      : 'border-white/10 bg-[#05081F] text-gray-400 hover:border-white/20 hover:text-gray-300'
                  }`}
                >
                  <User size={14} className={role === 'user' ? 'text-[#6D4AFF]' : ''} />
                  <span className="text-xs font-bold">Reader (User)</span>
                </button>

                {/* Librarian Button */}
                <button
                  type="button"
                  onClick={() => setRole('librarian')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                    role === 'librarian'
                      ? 'border-[#F7B500] bg-[#F7B500]/10 text-white shadow-[0_0_12px_rgba(247,181,0,0.2)]'
                      : 'border-white/10 bg-[#05081F] text-gray-400 hover:border-white/20 hover:text-gray-300'
                  }`}
                >
                  <ShieldAlert size={14} className={role === 'librarian' ? 'text-[#F7B500]' : ''} />
                  <span className="text-xs font-bold">Librarian</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#F7B500] text-[#05081F] font-bold text-sm transition-all duration-200 active:scale-[0.98] shadow-[0_4px_20px_rgba(247,181,0,0.25)] hover:bg-[#FFD04D] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <BookOpen size={14} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full h-11 rounded-xl bg-[#05081F] border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white font-semibold text-xs transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Sign up with Google</span>
          </button>

          {/* Footer Link */}
          <p className="text-center text-gray-500 text-xs mt-5 mb-0">
            Already have an account?{' '}
            <Link
              href={`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-[#6D4AFF] hover:text-[#8B5CF6] font-bold transition-colors no-underline border-b border-transparent hover:border-[#8B5CF6]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;