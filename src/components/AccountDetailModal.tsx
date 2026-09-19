import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Flame,
  Globe,
  CheckCircle2,
  Copy,
  Check,
  ShoppingCart,
  MessageCircle,
  Play,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AccountProduct, Review, StoreSettings } from '../types';
import { formatPrice, formatWhatsAppUrl, api } from '../lib/api';

interface AccountDetailModalProps {
  account: AccountProduct | null;
  settings: StoreSettings;
  currency: string;
  onClose: () => void;
  onBuyNow: (account: AccountProduct) => void;
  onAddToCart: (account: AccountProduct) => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  settings,
  currency,
  onClose,
  onBuyNow,
  onAddToCart,
}) => {
  if (!account) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedUid, setCopiedUid] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadAccountReviews();
    setSelectedImageIndex(0);
    setShowVideo(false);
  }, [account.id]);

  const loadAccountReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await api.getReviews({ accountId: account.id, status: 'approved' });
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleCopyUid = () => {
    navigator.clipboard.writeText(account.uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const text = 
      `مرحباً، أستفسر بخصوص حساب Free Fire:\n` +
      `📌 الاسم: ${account.title}\n` +
      `🆔 المعرف UID: ${account.uid}\n` +
      `💰 السعر: ${account.price} SAR\n` +
      `هل الحساب متاح حالياً للتسليم؟`;
    window.open(formatWhatsAppUrl(settings.whatsappNumber || '777506778', text), '_blank');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      await api.submitReview({
        accountId: account.id,
        customerName: reviewName || 'عميل موثق',
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSubmitted(true);
      setShowReviewForm(false);
      setReviewComment('');
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء إرسال التقييم');
    } finally {
      setSubmittingReview(false);
    }
  };

  const isSold = account.status === 'sold';
  const isReserved = account.status === 'reserved';
  const images = account.images && account.images.length > 0
    ? account.images
    : [settings.heroBannerUrl];

  // Helper for Youtube embed
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const vid = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const vid = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        id="account-detail-modal"
        className="relative w-full max-w-5xl bg-[#101520] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[92vh]"
      >
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0d111a]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>تفاصيل حساب Free Fire</span>
            </div>
            <button
              onClick={handleCopyUid}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300"
              title="نسخ المعرف"
            >
              <span>UID: {account.uid}</span>
              {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>

          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Gallery & Video (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              
              {/* Main Media Display */}
              <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                {showVideo && account.videoUrl ? (
                  account.videoUrl.includes('youtube') || account.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={getEmbedUrl(account.videoUrl) || ''}
                      title={account.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={account.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <img
                    src={images[selectedImageIndex]}
                    alt={account.title}
                    className="w-full h-full object-cover transition-all"
                  />
                )}

                {/* Status Overlays */}
                {isSold && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4">
                    <span className="px-6 py-2 rounded-xl bg-red-600 text-white font-black text-xl shadow-2xl border-2 border-white/20">
                      تم البيع
                    </span>
                    <p className="text-slate-300 text-xs mt-2">هذا الحساب تم بيعه وتسليمه بنجاح لأحد عملائنا</p>
                  </div>
                )}

                {/* Navigation Arrows for images */}
                {!showVideo && images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row & Video Button */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setShowVideo(false);
                      setSelectedImageIndex(idx);
                    }}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      !showVideo && selectedImageIndex === idx
                        ? 'border-red-500 ring-2 ring-red-500/30 scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}

                {account.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 flex flex-col items-center justify-center gap-1 transition-all ${
                      showVideo
                        ? 'border-red-500 bg-red-600/30 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Play className="w-5 h-5 fill-current text-red-500" />
                    <span className="text-[10px] font-bold">فيديو</span>
                  </button>
                )}
              </div>

              {/* Guarantee Box */}
              <div className="bg-[#131a26] border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-white block mb-0.5">ضمان ذهبي معتمد من المتجر:</span>
                  يتم تسليم البريد الإلكتروني وكلمة المرور الأصلية للحساب ورموز التحقق، مع متابعة خطوة بخطوة من الدعم لتأمين الحساب باسمك ورقمك الخاص.
                </div>
              </div>

            </div>

            {/* Right Column: Account Specs, Description & Actions (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              
              <div>
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                  {account.title}
                </h2>

                {/* Rating & Category */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 text-sm text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{account.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({account.reviewsCount} تقييم)</span>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    {account.category || 'حسابات فري فاير'}
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#161c29] border border-slate-800 mb-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">السعر النهائي:</span>
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      {formatPrice(account.price, currency)}
                    </span>
                    {account.oldPrice && (
                      <span className="text-sm text-slate-500 line-through mr-2">
                        {formatPrice(account.oldPrice, currency)}
                      </span>
                    )}
                  </div>

                  {account.discountPercent && account.discountPercent > 0 && (
                    <span className="px-3 py-1 rounded-lg bg-red-600/90 text-white font-black text-xs shadow-md">
                      توفير {account.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Account Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">مستوى الحساب:</span>
                    <span className="font-extrabold text-amber-400 text-sm">LVL {account.level}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">السيرفر:</span>
                    <span className="font-bold text-white text-sm">{account.server}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">الرانك الحالي:</span>
                    <span className="font-bold text-amber-300 text-sm">{account.rank || 'هيروئيك'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">طريقة الربط:</span>
                    <span className="font-bold text-emerald-400 text-sm">{account.loginMethod || 'Google / رسمي'}</span>
                  </div>
                </div>

                {/* Features List */}
                {account.features && account.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-slate-300 mb-2">مميزات وعناصر الحساب:</h4>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pl-1">
                      {account.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {account.description && (
                  <div className="mb-4 text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-bold text-slate-200 block mb-1">وصف الحساب:</span>
                    <p className="whitespace-pre-line">{account.description}</p>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                {isSold ? (
                  <div className="w-full py-3.5 px-4 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-center font-bold text-sm">
                    تم بيع هذا الحساب ولا يمكن شراؤه حالياً
                  </div>
                ) : (
                  <>
                    <button
                      id="modal-buy-now-btn"
                      onClick={() => {
                        onClose();
                        onBuyNow(account);
                      }}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-sm shadow-xl shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>شراء الآن وتسليم فوري</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          onAddToCart(account);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>إضافة للسلة</span>
                      </button>

                      <button
                        onClick={handleWhatsAppInquiry}
                        className="py-2.5 px-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold border border-emerald-600/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>استفسار واتساب</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>

          </div>

          {/* Customer Reviews Section for this account */}
          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>تقييمات وآراء المشترين للحساب</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                    {reviews.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">تقييمات حقيقية من عملاء اشتروا من متجرنا</p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-bold transition-all cursor-pointer"
              >
                {showReviewForm ? 'إلغاء التقييم' : '✍️ أضف تقييمك'}
              </button>
            </div>

            {/* Review Form Drawer */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white">تقييم الحساب والخدمة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">اسمك الكريم:</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="مثال: محمد العمري"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">عدد النجوم:</label>
                    <div className="flex items-center gap-1.5 py-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none p-0.5 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 mr-2">{reviewRating} من 5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">تعليقك ورأيك في الحساب وسرعة التسليم:</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="اكتب تجربتك بكل أمانة..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">ملاحظة: تخضع التقييمات لموافقة الإدارة قبل ظهورها للعامة.</p>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {submittingReview ? 'جاري الإرسال...' : 'إرسال التقييم'}
                  </button>
                </div>
              </form>
            )}

            {reviewSubmitted && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تم إرسال تقييمك بنجاح وسيظهر بعد اعتماد الإدارة. شكراً لثقتك!</span>
              </div>
            )}

            {/* Reviews List */}
            {loadingReviews ? (
              <div className="text-center py-6 text-xs text-slate-500">جاري تحميل التقييمات...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-6 bg-slate-900/40 rounded-xl border border-slate-800/80 text-xs text-slate-400">
                لا توجد تقييمات منشورة لهذا الحساب بعد. كن أول من يقيّم!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs">
                            {rev.customerName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">{rev.customerName}</span>
                            <span className="text-[10px] text-emerald-400">مشترٍ موثق</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(rev.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
