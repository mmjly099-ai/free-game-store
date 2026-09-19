import React, { useState } from 'react';
import {
  Star,
  Shield,
  Copy,
  Check,
  Eye,
  ShoppingCart,
  Flame,
  Globe,
  Award
} from 'lucide-react';
import { AccountProduct } from '../types';
import { formatPrice } from '../lib/api';

interface AccountCardProps {
  account: AccountProduct;
  currency: string;
  onViewDetails: (account: AccountProduct) => void;
  onBuyNow: (account: AccountProduct) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  currency,
  onViewDetails,
  onBuyNow,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUid = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(account.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSold = account.status === 'sold';
  const isReserved = account.status === 'reserved';
  const mainImage = account.images && account.images.length > 0
    ? account.images[0]
    : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';

  return (
    <div
      id={`account-card-${account.id}`}
      className={`group relative bg-[#121722] rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden shadow-lg ${
        isSold
          ? 'border-slate-800 opacity-75 grayscale-[20%]'
          : 'border-slate-800/90 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={mainImage}
          alt={account.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-[#121722]/20 to-transparent" />

        {/* Level Tag (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-amber-500/50 text-amber-300 font-bold text-xs tracking-wider shadow-lg">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>LVL {account.level}</span>
        </div>

        {/* Status / Discount Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {isSold ? (
            <span className="px-3 py-1 rounded-lg bg-rose-950/90 border border-rose-500/50 text-rose-300 font-black text-xs shadow-md">
              تم البيع
            </span>
          ) : isReserved ? (
            <span className="px-3 py-1 rounded-lg bg-amber-950/90 border border-amber-500/50 text-amber-300 font-bold text-xs shadow-md">
              محجوز مؤقتاً
            </span>
          ) : (
            <span className="px-3 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold text-xs shadow-md">
              متاح للبيع
            </span>
          )}

          {account.discountPercent && account.discountPercent > 0 && !isSold && (
            <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white font-extrabold text-[11px] shadow-md animate-pulse">
              خصم {account.discountPercent}%
            </span>
          )}
        </div>

        {/* Server Tag (Bottom Right) */}
        <div className="absolute bottom-2 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 text-slate-300 text-[11px]">
          <Globe className="w-3 h-3 text-blue-400" />
          <span>{account.server}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* UID & Rating Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <button
              onClick={handleCopyUid}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-750 px-2 py-1 rounded-md border border-slate-700/50 transition-colors"
              title="نسخ المعرف UID"
            >
              <span className="font-mono text-[11px]">UID: {account.uid}</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>

            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{account.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal">({account.reviewsCount})</span>
            </div>
          </div>

          {/* Account Title */}
          <h3
            onClick={() => onViewDetails(account)}
            className="text-base font-bold text-white line-clamp-2 hover:text-red-400 cursor-pointer transition-colors mb-3 leading-snug"
          >
            {account.title}
          </h3>

          {/* Rare Items Badges */}
          {account.rareItems && account.rareItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {account.rareItems.slice(0, 3).map((item, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] font-medium"
                >
                  {item}
                </span>
              ))}
              {account.rareItems.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                  +{account.rareItems.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-800 mt-auto">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {formatPrice(account.price, currency)}
              </span>
              {account.oldPrice && (
                <span className="text-xs text-slate-500 line-through mr-2">
                  {formatPrice(account.oldPrice, currency)}
                </span>
              )}
            </div>
            {account.rank && (
              <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {account.rank}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id={`view-details-btn-${account.id}`}
              onClick={() => onViewDetails(account)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>التفاصيل</span>
            </button>

            <button
              id={`buy-now-btn-${account.id}`}
              onClick={() => onBuyNow(account)}
              disabled={isSold}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isSold
                  ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-md shadow-red-600/20'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isSold ? 'تم البيع' : 'شراء فوري'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
