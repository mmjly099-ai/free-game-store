import React from 'react';
import { Star, MessageSquareQuote, ShieldCheck, Calendar, Flame } from 'lucide-react';
import { Review } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  if (approvedReviews.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>تجارب حقيقية موثقة</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          آراء وتقييمات عملائنا الكرام
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          نفتخر بثقة مئات اللاعبين في الشرق الأوسط والخليج العربي
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {approvedReviews.slice(0, 6).map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-[#121722] border border-slate-800 hover:border-slate-700 flex flex-col justify-between shadow-lg relative group transition-all"
          >
            <div>
              {/* Header with customer & stars */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 text-white font-black text-sm flex items-center justify-center shadow-md">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{rev.customerName}</h4>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>مشتري موثق</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Account reference */}
              {rev.accountTitle && (
                <div className="text-[11px] text-red-400/90 font-semibold mb-2 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20 line-clamp-1">
                  اشترى: {rev.accountTitle}
                </div>
              )}

              {/* Comment */}
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(rev.createdAt).toLocaleDateString('ar-SA')}
              </span>
              {rev.isPinned && (
                <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded text-[9px]">
                  تقييم مثبت ⭐
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
