import React from 'react';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe'; 
import Link from 'next/link';
import { CheckCircle, ShoppingBag, Mail, ArrowRight, HelpCircle } from 'lucide-react';

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  // Safeguard against manual or broken navigation without a session_id
  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  // Retrieve secure transaction session records from Stripe Engine
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const status = session?.status;
  const customerEmail = session?.customer_details?.email || 'your registered email';

  // If the payment flow is incomplete, bounce the user back to home catalog terminal
  if (status === 'open') {
    return redirect('/');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#121B3A] via-[#0E152E] to-[#0A0E22] text-[#D1D5DB] flex items-center justify-center antialiased px-4 relative overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#6D4AFF]/10 to-transparent rounded-full blur-[160px]" />
      </div>

      <div className="max-w-md w-full bg-[#0D1033]/50 border border-white/[0.06] p-8 rounded-[2rem] text-center space-y-8 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative z-10">
        
        {/* Animated Premium Check Icon Block */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#10B981]/20 rounded-full blur-xl animate-pulse" />
            <div className="relative p-4 rounded-full bg-gradient-to-tr from-[#10B981]/10 to-[#10B981]/20 border border-[#10B981]/30">
              <CheckCircle size={52} className="text-[#10B981]" />
            </div>
          </div>
        </div>

        {/* Content Typography Elements */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-[10px] font-bold tracking-[0.15em] text-emerald-400 uppercase">
            Transaction Authorized
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white m-0 leading-none">
            Payment Successful!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-2">
            Thank you for your order. Your premium delivery workflow request has been acknowledged by our digital system.
          </p>
        </div>

        {/* Informational Email Notification Details Card */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-start gap-3.5 text-left">
          <Mail size={18} className="text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Confirmation Matrix Sent</h4>
            <p className="text-xs text-gray-400 leading-relaxed m-0">
              A comprehensive confirmation invoice will be delivered to <span className="text-indigo-300 font-semibold">{customerEmail}</span> momentarily.
            </p>
          </div>
        </div>

        {/* System Support Help Desk Anchor */}
        <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5 m-0">
          <HelpCircle size={12} />
          Questions? Contact us via{' '}
          <a href="mailto:support@example.com" className="text-gray-400 hover:text-white font-medium underline transition-colors">
            support@example.com
          </a>
        </p>

        {/* Navigation Action Buttons Grid */}
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
    </div>
  );
}