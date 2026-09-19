import React from 'react';
import { Flame, Zap, Clock, ArrowLeft, Tag } from 'lucide-react';
import { Offer, AccountProduct } from '../types';
import { AccountCard } from './AccountCard';

interface OffersSectionProps {
  offers: Offer[];
  accounts: AccountProduct[];
  currency: string;
  onViewDetails: (account: AccountProduct) => void;
  onBuyNow: (account: AccountProduct) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  offers,
  accounts,
  currency,
  onViewDetails,
  onBuyNow,
}) => {
  const activeOffers = offers.filter((o) => o.active);
  const offerAccounts = accounts.filter((a) => a.isOffer || (a.discountPercent && a.discountPercent > 0));

  if (activeOffers.length === 0 && offerAccounts.length === 0) {
    return null;
  }

  const primaryOffer = activeOffers[0];

  return (
    <section id="offers" className="py-12 sm:py-16 bg-[#0e121b] border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner if available */}
        {primaryOffer && (
          <div className="relative rounded-3xl overflow-hidden mb-12 border border-red-500/30 shadow-2xl bg-gradient-to-r from-red-950 via-[#181d2a] to-[#121724] p-6 sm:p-10">
            <div className="relative z-10 max-w-2xl space-y-4">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs shadow-md animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>عروض موسمية حصرية</span>
                <span className="bg-black/30 px-2 py-0.5 rounded-full">خصم {primaryOffer.discountPercent}%</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {primaryOffer.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {primaryOffer.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-amber-300 font-bold pt-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>العرض سارٍ لفترة محدودة وحتى نفاد الكمية!</span>
              </div>

            </div>

            {/* Ambient fire glow */}
            <div className="absolute top-0 left-0 w-80 h-full bg-gradient-to-r from-red-600/20 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>تخفيضات نارية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              أقوى عروض حسابات Free Fire
            </h2>
          </div>
        </div>

        {/* Accounts with offers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {offerAccounts.slice(0, 3).map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              currency={currency}
              onViewDetails={onViewDetails}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
