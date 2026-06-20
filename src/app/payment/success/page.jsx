'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, AlertCircle, ShoppingBag, ArrowRight, Mail, HelpCircle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [syncStatus, setSyncStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    if (!sessionId) {
      setSyncStatus('error');
      return;
    }

    const triggerDatabaseSync = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL; 
        
        const response = await fetch(`${backendUrl}/api/payment-success`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSyncStatus('success');
        } else {
          setSyncStatus('error');
        }
      } catch (error) {
        console.error('Express Backend Sync Failure:', error);
        setSyncStatus('error');
      }
    };

    triggerDatabaseSync();
  }, [sessionId]);

  return (
    <div className="max-w-md w-full bg-[#0D1033]/50 border border-white/6 p-8 rounded-[2rem] text-center space-y-8 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative z-10">
      
      {/* State 1: Verifying with Express Server */}
      {syncStatus === 'verifying' && (
        <div className="space-y-4 py-6">
          <div className="flex justify-center">
            <Loader2 size={48} className="text-[#6D4AFF] animate-spin" />
          </div>
          <h1 className="text-xl font-bold text-white">Verifying Payment...</h1>
          <p className="text-xs text-gray-400">
            Please wait while our Node.js server registers your transaction into MongoDB.
          </p>
        </div>
      )}

      {/* State 2: Success State (Verified & Stored) */}
      {syncStatus === 'success' && (
        <>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#10B981]/20 rounded-full blur-xl animate-pulse" />
              <div className="relative p-4 rounded-full bg-linear-to-tr from-[#10B981]/10 to-[#10B981]/20 border border-[#10B981]/30">
                <CheckCircle size={52} className="text-[#10B981]" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-[10px] font-bold tracking-[0.15em] text-emerald-400 uppercase">
              Database Sync Completed
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white m-0 leading-none">
              Payment Successful!
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-2">
              Thank you for your order. Your transaction has been securely logged into our payment collection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/2 border border-white/4 flex items-start gap-3.5 text-left">
            <Mail size={18} className="text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Invoice Registered</h4>
              <p className="text-xs text-gray-400 leading-relaxed m-0">
                A digital confirmation statement has been tied to your account profile successfully.
              </p>
            </div>
          </div>
        </>
      )}

      {/* State 3: Error/Failure State */}
      {syncStatus === 'error' && (
        <>
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
              <AlertCircle size={52} className="text-red-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Verification Failed</h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              We couldn&apos;t synchronize this checkout token with MongoDB. Contact support if the amount was debited.
            </p>
          </div>
        </>
      )}

      {/* Footer Info */}
      <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5 m-0">
        <HelpCircle size={12} />
        Questions? Contact us via{' '}
        <a href="mailto:support@example.com" className="text-gray-400 hover:text-white font-medium underline transition-colors">
          support@example.com
        </a>
      </p>

      {/* Navigation Button */}
      <div className="grid grid-cols-1 gap-3 pt-2">
        <Link 
          href="/browsebooks" 
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#6D4AFF] hover:bg-[#5B3BE6] text-white text-sm font-extrabold rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(109,74,255,0.2)] group"
        >
          <ShoppingBag size={16} />
          Continue Catalog Shopping
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#121B3A] via-[#0E152E] to-[#0A0E22] text-[#D1D5DB] flex items-center justify-center antialiased px-4 relative overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-b from-[#6D4AFF]/10 to-transparent rounded-full blur-[160px]" />
      </div>

      {/* use suspense to prevent hydration errors */}
      <Suspense fallback={
        <div className="text-white flex items-center gap-2 font-semibold">
          <Loader2 className="animate-spin text-indigo-400" /> Loading Gateway Interface...
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}