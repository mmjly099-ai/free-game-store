import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Power,
  Copy,
  AlertCircle,
  HelpCircle,
  Building,
  Smartphone,
  Zap,
  DollarSign
} from 'lucide-react';
import { PaymentMethod } from '../../types';
import { api } from '../../lib/api';

interface PaymentsManagerProps {
  paymentMethods: PaymentMethod[];
  onRefresh: () => void;
  onShowMessage: (msg: string, isError?: boolean) => void;
}

const PRESET_TEMPLATES = [
  {
    name: 'بنك الكريمي (حساب / إكسبرس)',
    provider: 'kuraimi',
    icon: '🏦',
    currency: 'YER / SAR / USD',
    note: 'تحويل فوري عبر تطبيق الكريمي جوال أو إكسبرس',
    instructions: 'قم بالتحويل إلى رقم الحساب عبر تطبيق الكريمي جوال، أو إرسال حوالة كريمي إكسبرس باسم المستلم. بعد التحويل أرسل رقم العملية وسند التحويل عبر واتساب.'
  },
  {
    name: 'محفظة جيب (Jeeb)',
    provider: 'jeeb',
    icon: '📱',
    currency: 'YER',
    note: 'دفع فوري عبر محفظة جيب الإلكترونية',
    instructions: 'افتح تطبيق جيب (Jeeb) واختر تحويل إلى محفظة أخرى، ثم أدخل رقم المحفظة أدناه، واكتب رقم طلبك في الملاحظات، ثم أرسل إشعار العملية عبر واتساب.'
  },
  {
    name: 'محفظة ون كاش (OneCash)',
    provider: 'onecash',
    icon: '⚡',
    currency: 'YER',
    note: 'دفع مباشر عبر OneCash بنك اليمن والكويت',
    instructions: 'قم بالدفع عبر تطبيق OneCash إلى رقم الحساب/المحفظة أدناه واحتفظ برقم المرجع/العملية لتأكيد استلامك للطلب فوراً.'
  },
  {
    name: 'حوالة صرافة يمنية (النجم / الامتياز / يمن إكسبرس)',
    provider: 'exchange',
    icon: '💸',
    currency: 'YER / SAR',
    note: 'متاح عبر جميع شبكات الصرافة المعتمدة في اليمن',
    instructions: 'توجه إلى أقرب شبكة صرافة (النجم، الامتياز، يمن إكسبرس، أو داديه) وأرسل الحوالة بالاسم والمحافظة الموضحة ثم أرسل صورة السند ورقم الحوالة عبر واتساب.'
  },
  {
    name: 'محفظة جوالي (Jawali)',
    provider: 'jawali',
    icon: '📲',
    currency: 'YER',
    note: 'تحويل فوري عبر محفظة جوالي - بنك البحرين واليمن',
    instructions: 'افتح تطبيق محفظة جوالي وقم بتحويل المبلغ إلى الرقم الموضح مع إرفاق رقم العملية للتأكيد الفوري.'
  }
];

export const PaymentsManager: React.FC<PaymentsManagerProps> = ({
  paymentMethods,
  onRefresh,
  onShowMessage,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PaymentMethod | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    provider: 'kuraimi',
    accountNumber: '',
    accountName: '',
    instructions: '',
    note: '',
    icon: '💳',
    currency: 'YER',
    active: true,
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      provider: 'kuraimi',
      accountNumber: '',
      accountName: '',
      instructions: '',
      note: '',
      icon: '🏦',
      currency: 'YER',
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: PaymentMethod) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      provider: item.provider || 'custom',
      accountNumber: item.accountNumber,
      accountName: item.accountName,
      instructions: item.instructions || '',
      note: item.note || '',
      icon: item.icon || '💳',
      currency: item.currency || 'YER',
      active: item.active !== false,
    });
    setModalOpen(true);
  };

  const handleApplyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setFormData(prev => ({
      ...prev,
      name: preset.name,
      provider: preset.provider,
      icon: preset.icon,
      currency: preset.currency,
      note: preset.note,
      instructions: preset.instructions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.accountNumber.trim() || !formData.accountName.trim()) {
      onShowMessage('يرجى تعبئة جميع الحقول المطلوبة: اسم طريقة الدفع، رقم الحساب، واسم المستلم', true);
      return;
    }

    try {
      if (editingItem) {
        await api.updatePaymentMethod(editingItem.id, formData);
        onShowMessage('تم تحديث وسيلة الدفع بنجاح');
      } else {
        await api.createPaymentMethod(formData);
        onShowMessage('تمت إضافة طريقة الدفع الجديدة بنجاح');
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      onShowMessage(err.message || 'حدث خطأ أثناء حفظ وسيلة الدفع', true);
    }
  };

  const handleToggleActive = async (item: PaymentMethod) => {
    try {
      await api.togglePaymentMethod(item.id);
      onShowMessage(`تم ${item.active ? 'تعطيل' : 'تفعيل'} ${item.name}`);
      onRefresh();
    } catch (err: any) {
      onShowMessage(err.message || 'فشل تحديث الحالة', true);
    }
  };

  const handleDelete = async (item: PaymentMethod) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف طريقة الدفع "${item.name}"؟`)) {
      return;
    }
    try {
      await api.deletePaymentMethod(item.id);
      onShowMessage('تم حذف طريقة الدفع بنجاح');
      onRefresh();
    } catch (err: any) {
      onShowMessage(err.message || 'فشل حذف طريقة الدفع', true);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">إدارة طرق وحسابات الدفع</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              طرق دفع يمنية
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            تحكم كامل بطرق الدفع المتاحة للعملاء (الكريمي، جيب، ون كاش، حوالات الصرافة) وتعديل أرقام الحسابات وتعليمات الإيداع
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طريقة دفع جديدة</span>
        </button>
      </div>

      {/* Info Tip */}
      <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-2.5 text-xs text-blue-200">
        <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">ملاحظة للمدير: </span>
          <span>
            طرق الدفع المعروضة هنا هي التي تظهر للمشتري مباشرة في نافذة إتمام الشراء، وسيتم نسخ أرقام الحسابات وإرسالها فوراً مع طلب الواتساب.
          </span>
        </div>
      </div>

      {/* Methods Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const isCopied = copiedId === method.id;
          return (
            <div
              key={method.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                method.active
                  ? 'bg-[#111622] border-slate-800 hover:border-slate-700 shadow-md'
                  : 'bg-slate-900/40 border-slate-800/60 opacity-60'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                    {method.icon || '💳'}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>{method.name}</span>
                      {method.active ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          مفعل
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-400">
                          معطل
                        </span>
                      )}
                    </h4>
                    {method.note && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{method.note}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(method)}
                    title={method.active ? 'تعطيل طريقة الدفع' : 'تفعيل طريقة الدفع'}
                    className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                      method.active
                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(method)}
                    title="تعديل"
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(method)}
                    title="حذف"
                    className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div className="py-3 space-y-2 text-xs">
                {/* Account Number Box */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block">رقم الحساب / رقم المحفظة:</span>
                    <span className="text-sm font-mono font-black text-amber-400 tracking-wider block truncate">
                      {method.accountNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(method.accountNumber, method.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Account Name */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-400">اسم المستلم / صاحب الحساب:</span>
                  <span className="font-bold text-white">{method.accountName}</span>
                </div>

                {/* Currency */}
                {method.currency && (
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-slate-400">العملات المقبولة:</span>
                    <span className="font-mono text-emerald-400 font-bold">{method.currency}</span>
                  </div>
                )}

                {/* Instructions */}
                {method.instructions && (
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/50 mt-2">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">تعليمات التحويل للعميل:</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{method.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {paymentMethods.length === 0 && (
        <div className="text-center py-12 bg-[#111622] rounded-2xl border border-slate-800 p-6">
          <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white mb-1">لا توجد طرق دفع مسجلة حالياً</h4>
          <p className="text-xs text-slate-400 mb-4">أضف طرق دفع يمنية كبنك الكريمي وجيب وون كاش لتمكين العملاء من الشراء بسهولة</p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طريقة دفع</span>
          </button>
        </div>
      )}

      {/* CREATE / EDIT PAYMENT METHOD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#111622] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0d111a]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                  {formData.icon || '💳'}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {editingItem ? 'تعديل طريقة الدفع' : 'إضافة طريقة دفع يمنية جديدة'}
                  </h3>
                  <p className="text-[11px] text-slate-400">ستظهر مباشرة في نافذة إتمام الطلب للزبائن</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Quick Preset Buttons (if creating new) */}
              {!editingItem && (
                <div className="space-y-1.5 pb-3 border-b border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block">قوالب يمنية جاهزة بنقرة واحدة:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TEMPLATES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>{preset.icon}</span>
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Method Name & Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">اسم وسيلة الدفع *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: بنك الكريمي (حساب / إكسبرس)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">الأيقونة / الرمز</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🏦"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-center text-base focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Account Number & Account Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">رقم الحساب / رقم المحفظة / الهاتف *</label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="مثال: 300482910 أو 775123456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">اسم صاحب الحساب / المستلم *</label>
                  <input
                    type="text"
                    required
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    placeholder="مثال: متجر فري فاير - اليمن"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Currency & Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">العملات المقبولة</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="مثال: YER أو YER / SAR / USD"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">وصف مختصر</label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="مثال: دفع مباشر وسريع"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-bold">تعليمات التحويل للعميل (تظهر في صفحة الشراء)</label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="اشرح للزبون كيف يقوم بالتحويل وأين يرسل السند..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500 leading-relaxed"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">حالة تفعيل طريقة الدفع</span>
                  <span className="text-[11px] text-slate-400">إذا كانت معطلة لن تظهر للعملاء في نافذة الشراء</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    formData.active
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {formData.active ? 'مفعل للعملاء' : 'معطل مؤقتاً'}
                </button>
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20"
                >
                  {editingItem ? 'حفظ التعديلات' : 'إضافة وسيلة الدفع'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
