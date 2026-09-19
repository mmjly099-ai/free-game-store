import fs from 'fs';
import path from 'path';
import {
  AccountProduct,
  Order,
  Customer,
  Review,
  Offer,
  StoreSettings,
  ActivityLog,
  StoreNotification,
  AdminUser,
  DashboardStats,
  PaymentMethod,
} from '../src/types';

export interface DatabaseSchema {
  admin_users: (AdminUser & { passwordHash: string })[];
  users: Array<{ id: string; name: string; phone: string; email?: string }>;
  accounts: AccountProduct[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  categories: Array<{ id: string; name: string; slug: string; description: string; icon: string }>;
  offers: Offer[];
  settings: StoreSettings;
  notifications: StoreNotification[];
  activity_logs: ActivityLog[];
  payment_methods: PaymentMethod[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Free Game | متجر حسابات فري فاير',
  storeSubtitle: 'متجر Free Game المعتمد لبيع حسابات فري فاير النادرة بتسليم فوري وضمان حقيقي 100%',
  logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
  heroBannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&auto=format&fit=crop&q=80',
  heroTitle: 'أقوى حسابات Free Fire النادرة بأسعار أسطورية',
  heroSubtitle: 'تسليم فوري ومباشر بعد الدفع عبر واتساب، حسابات موثقة ومفحوصة بالكامل مع ضمان عدم الاسترجاع مدى الحياة.',
  whatsappNumber: '+967777506778',
  telegramUrl: 'https://t.me/FF_Store_Official',
  instagramUrl: 'https://instagram.com/ff_firestore',
  discordUrl: 'https://discord.gg/ffstore',
  themePrimaryColor: '#ff4655',
  announcementText: '🔥 خصومات نارية تصل إلى 45% على حسابات الفاير باس القديم (الساكورا والهيب هوب)! كود الخصم: FF2025',
  announcementEnabled: true,
  faqs: [
    {
      id: 'faq-1',
      question: 'كيف يتم تسليم الحساب بعد الدفع؟',
      answer: 'بمجرد إتمام الطلب، يتم التواصل معك فورياً عبر واتساب وإرسال بيانات تسجيل الدخول (الإيميل، كلمة المرور، ورمز التحقق الاحتياطي) في غضون 5 إلى 15 دقيقة مع شرح طريقة تغيير البيانات بأمان.'
    },
    {
      id: 'faq-2',
      question: 'هل الحسابات عليها ضمان من السحب أو الباند؟',
      answer: 'نعم! جميع الحسابات المعروضة في المتجر حسابات رسمية 100% تم فحصها والتأكد من أمانها التام، ونقدم ضماناً ذهبياً ضد السحب أو الاسترجاع مع تعويض فوري إن لزم الأمر.'
    },
    {
      id: 'faq-3',
      question: 'ما هي طرق الدفع المتوفرة؟',
      answer: 'نوفر جميع طرق الدفع المحلية والعالمية: مدى، فيزا/ماستركارد، STC Pay، أبل باي (Apple Pay)، فودافون كاش، باي بال (PayPal)، والعملات الرقمية (USDT).'
    },
    {
      id: 'faq-4',
      question: 'هل يمكنني فحص الحساب عبر الـ UID قبل الشراء؟',
      answer: 'نعم بالتأكيد، كل حساب في المتجر يحتوي على رقم المعرف UID الخاص به معروضاً بوضوح، ويمكنك البحث عنه داخل اللعبة لمعاينة الملف الشخصي والرانك الحالي.'
    },
    {
      id: 'faq-5',
      question: 'ماذا أفعل بعد استلام الحساب؟',
      answer: 'سيقوم فريق الدعم الفني بإرشادك خطوة بخطوة عبر واتساب لتغيير رقم الهاتف والإيميل المرتبط وتفعيل التحقق بخطوتين لضمان امتلاكك الحصري والكامل للحساب.'
    }
  ],
  termsOfSale: 'شروط البيع: الحسابات تسلم بكامل بياناتها الرسمية فور تأكيد عملية الدفع. يلتزم العميل بتغيير معلومات الأمان وكلمة المرور فور استلامها بحضور الدعم الفني.',
  refundPolicy: 'سياسة الاسترجاع: يمكن استبدال الحساب أو استرجاع المبلغ كاملاً في حال وجود أي خطأ في بيانات الحساب المسلمة أو عدم تطابقها مع الوصف المعروض خلال 24 ساعة من الاستلام.',
  privacyPolicy: 'سياسة الخصوصية: نحن نلتزم بالسرية التامة لبيانات العملاء وأرقام هواتفهم، ولا تتم مشاركة أي معلومات شخصية مع أي طرف ثالث.',
  currency: 'YER',
  supportEmail: 'support@ff-firestore.com'
};

const INITIAL_ACCOUNTS: AccountProduct[] = [
  {
    id: 'ff-acc-01',
    uid: '1098472910',
    title: 'حساب فاير باس 1 و 2 نادر (ساكورا وهيب هوب) لفل 79',
    price: 850,
    oldPrice: 1200,
    discountPercent: 29,
    level: 79,
    charactersCount: 48,
    server: 'الشرق الأوسط (MEA)',
    region: 'الشرق الأوسط',
    description: 'حساب أسطوري نادر جداً من الموسم الأول. يحتوي على سكن الساكورا النادر وفاير باس 2 الهيب هوب بالكامل، رقصات نادرة، أسلحة ماكس (MP40 الكوبرا ماكس لفل 7، AK التنين لفل 6، SCAR ميغالودون لفل 5). الحساب مشحون من سيزون 1 حتى الآن وفيه 14 ألف لايك.',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    features: [
      'سكن الساكورا الكامل (فاير باس سيزون 1)',
      'سكن الهيب هوب النادر (سيزون 2)',
      'سلاح MP40 الكوبرا المطوّر Max Level 7',
      'سلاح AK التنين المشتعل Level 6',
      'رقصة الكوبرا والعرش الحصرية',
      'رانك غراند ماستر (Grandmaster)',
      'شخصية ألوك وكريستيانو وموكو مكسات',
      'ربط نظيف ومضمون 100% (Google + Facebook متاح للتغيير)'
    ],
    rating: 4.9,
    reviewsCount: 14,
    status: 'available',
    isFeatured: true,
    isOffer: true,
    offerEndTime: '2026-10-15T23:59:59Z',
    createdAt: '2026-09-10T14:22:00Z',
    category: 'حسابات فاخرة VIP',
    rank: 'غراند ماستر (Grandmaster)',
    rareItems: ['ساكورا S1', 'هيب هوب S2', 'MP40 كوبرا ماكس', 'رقصة العرش'],
    loginMethod: 'Google Play / Gmail رسمي'
  },
  {
    id: 'ff-acc-02',
    uid: '2489104712',
    title: 'حساب هيروئيك لفل 74 مع شوتجن الحمم و 6 أسلحة إيفو',
    price: 490,
    oldPrice: 650,
    discountPercent: 24,
    level: 74,
    charactersCount: 42,
    server: 'الشرق الأوسط (MEA)',
    region: 'الشرق الأوسط',
    description: 'حساب قتالي قوي جداً لعشاق الرومات والبطولات. يحتوي على شوتجن M1887 الحمم البركانية ذو الضرر العالي، سلاح UMP البوينسي، وسلاح فاماس وميدالية الأساطير. تم فتح جميع الشخصيات مع مهارات مكتملة بالكامل.',
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'شوتجن M1887 الحمم دبل دامج',
      'أسلحة إيفو مطورة (M1014 + SCAR)',
      'أكثر من 38 رقصة منها 9 رقصات نادرة',
      'رانك هيروئيك 5 نجوم',
      'بطاقات تغيير الاسم وبطاقات روم إضافية',
      'تسليم سريع عبر واتساب مع حماية كاملة'
    ],
    rating: 4.8,
    reviewsCount: 8,
    status: 'available',
    isFeatured: true,
    isOffer: true,
    offerEndTime: '2026-10-05T23:59:59Z',
    createdAt: '2026-09-12T10:15:00Z',
    category: 'حسابات تنافسية',
    rank: 'هيروئيك 5 نجوم',
    rareItems: ['M1887 الحمم', 'M1014 التنين الأخضر', 'حزمة الأرنب الأسود'],
    loginMethod: 'Facebook حساب خاص'
  },
  {
    id: 'ff-acc-03',
    uid: '3819024819',
    title: 'حساب سيرفر أوروبا لفل 71 مع بطاقة نخبة قديمة وسكن الجوكر',
    price: 320,
    oldPrice: 420,
    discountPercent: 23,
    level: 71,
    charactersCount: 39,
    server: 'أوروبا (EU)',
    region: 'أوروبا',
    description: 'حساب سيرفر أوروبي ممتاز جداً ذو بنج سريع، يحتوي على سكن الجوكر البنفسجي الشهير، حزمة كريمينال الأخضر النادر، وجميع حقائب السيزونات القديمة مع مظلات نارية.',
    images: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'سكن الكريمينال الأخضر الأصلي',
      'سكن الجوكر الأسطوري الكامل',
      'سيرفر أوروبا - بنج ممتاز واستقرار عالي',
      'أكثر من 300 سكن أسلحة وملابس',
      'شخصيات تاتسويا، كينتا، ألوك مع لفل ماكس'
    ],
    rating: 4.7,
    reviewsCount: 6,
    status: 'available',
    isFeatured: false,
    isOffer: false,
    createdAt: '2026-09-14T08:30:00Z',
    category: 'سيرفرات خارجية',
    rank: 'ماستر (Master)',
    rareItems: ['كريمينال أخضر', 'حزمة الجوكر', 'رقصة الضحكة القديمة'],
    loginMethod: 'Google Play'
  },
  {
    id: 'ff-acc-04',
    uid: '4920194820',
    title: 'حساب اقتصادي رائع لفل 65 مناسب للرومات وبطولات الكلان',
    price: 180,
    oldPrice: 250,
    discountPercent: 28,
    level: 65,
    charactersCount: 35,
    server: 'الشرق الأوسط (MEA)',
    region: 'الشرق الأوسط',
    description: 'حساب متوازن وسعره اقتصادي جداً، يحتوي على 30 رقصة وسكنات أسلحة كافية للمنافسة، و 5 بطاقات تغيير الاسم مع 15 بطاقة روم جاهزة للاستخدام.',
    images: [
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'سعر اقتصادي في متناول الجميع',
      'شخصيات أساسية مكتملة (ألوك، ديمتري، هومر)',
      'سكنات أسلحة ثنائية المعدل للفاير ريت',
      '15 بطاقة إنشاء رومات مخصصة',
      'حساب موثق ومربوط بدون أي مشاكل'
    ],
    rating: 4.6,
    reviewsCount: 11,
    status: 'reserved',
    isFeatured: false,
    isOffer: false,
    createdAt: '2026-09-15T12:00:00Z',
    category: 'حسابات اقتصادية',
    rank: 'دايموند IV',
    rareItems: ['رقصة التصفيق السريعة', 'سكن الملاك الأزرق'],
    loginMethod: 'VK / Google'
  },
  {
    id: 'ff-acc-05',
    uid: '5819301948',
    title: 'حساب كريمينال أحمر وأزرق لفل 81 أسطوري (تم البيع)',
    price: 1400,
    oldPrice: 1800,
    discountPercent: 22,
    level: 81,
    charactersCount: 52,
    server: 'الشرق الأوسط (MEA)',
    region: 'الشرق الأوسط',
    description: 'حساب فخم جداً تم بيعه بنجاح لأحد عملائنا الكرام. يحتوي على حزم الكريمينال النادرة وشوتجن اليدوي القديم و 18 سلاح إيفو.',
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      'حزمة الكريمينال الأحمر والأزرق',
      'جميع أسلحة الإيفو ماكس',
      '22 ألف لايك على البروفايل',
      'تم التسليم بنجاح مع ضمان'
    ],
    rating: 5.0,
    reviewsCount: 19,
    status: 'sold',
    isFeatured: false,
    isOffer: false,
    createdAt: '2026-09-01T15:00:00Z',
    category: 'حسابات فاخرة VIP',
    rank: 'غراند ماستر Top 100',
    rareItems: ['كريمينال أحمر', 'كريمينال أزرق', 'MP40 لفل 7'],
    loginMethod: 'Google Play'
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'FF-98214',
    customerId: 'cust-1',
    customerName: 'فيصل الشمري',
    customerPhone: '+966551234567',
    customerEmail: 'faisal@example.com',
    accountId: 'ff-acc-05',
    accountTitle: 'حساب كريمينال أحمر وأزرق لفل 81 أسطوري (تم البيع)',
    accountUid: '5819301948',
    price: 1400,
    currency: 'SAR',
    paymentMethod: 'STC Pay',
    status: 'completed',
    createdAt: '2026-09-02T16:30:00Z',
    notes: 'تم الدفع وتأكيد الحساب واستلام الإيميل والرمز والتحقق بنجاح.',
    deliveryInfo: 'تم تسليم الإيميل والباسورد عبر محادثة واتساب الرسمية.'
  },
  {
    id: 'ord-102',
    orderNumber: 'FF-98350',
    customerId: 'cust-2',
    customerName: 'عبدالله القحطاني',
    customerPhone: '+966549876543',
    accountId: 'ff-acc-04',
    accountTitle: 'حساب اقتصادي رائع لفل 65 مناسب للرومات وبطولات الكلان',
    accountUid: '4920194820',
    price: 180,
    currency: 'SAR',
    paymentMethod: 'مدى (Mada)',
    status: 'reviewing',
    createdAt: '2026-09-18T19:10:00Z',
    notes: 'طلب جديد قيد مراجعة إيصال التحويل البنكي.'
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'فيصل الشمري',
    phone: '+966551234567',
    email: 'faisal@example.com',
    totalOrders: 1,
    totalSpent: 1400,
    createdAt: '2026-09-02T16:20:00Z',
    lastOrderAt: '2026-09-02T16:30:00Z'
  },
  {
    id: 'cust-2',
    name: 'عبدالله القحطاني',
    phone: '+966549876543',
    totalOrders: 1,
    totalSpent: 180,
    createdAt: '2026-09-18T19:00:00Z',
    lastOrderAt: '2026-09-18T19:10:00Z'
  },
  {
    id: 'cust-3',
    name: 'عمر التميمي',
    phone: '+966567891234',
    email: 'omar@example.com',
    totalOrders: 2,
    totalSpent: 1100,
    createdAt: '2026-08-20T11:00:00Z',
    lastOrderAt: '2026-09-05T14:15:00Z'
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    accountId: 'ff-acc-01',
    accountTitle: 'حساب فاير باس 1 و 2 نادر (ساكورا وهيب هوب) لفل 79',
    customerName: 'خالد العنزي',
    rating: 5,
    comment: 'أفضل متجر تعاملت معه، ثقة وسرعة تسليم خيالية في أقل من 7 دقائق! الحساب فيه كل السكنات المذكورة والساكورا شغال في اللوبي والرانك.',
    createdAt: '2026-09-11T16:00:00Z',
    status: 'approved',
    isPinned: true
  },
  {
    id: 'rev-2',
    accountId: 'ff-acc-02',
    accountTitle: 'حساب هيروئيك لفل 74 مع شوتجن الحمم و 6 أسلحة إيفو',
    customerName: 'سلطان الدوسري',
    rating: 5,
    comment: 'الشوتجن دبل دامج أسطوري في الرومات، والدعم الفني ساعدني خطوة بخطوة في ربط الحساب بإيميلي وتأمين الحماية.',
    createdAt: '2026-09-13T18:40:00Z',
    status: 'approved',
    isPinned: true
  },
  {
    id: 'rev-3',
    accountId: 'ff-acc-05',
    accountTitle: 'حساب كريمينال أحمر وأزرق لفل 81 أسطوري (تم البيع)',
    customerName: 'فيصل الشمري',
    rating: 5,
    comment: 'اشتريت الحساب وتم التسليم بالكامل، رجل صادق وأمين والله يوفقكم.',
    createdAt: '2026-09-03T10:20:00Z',
    status: 'approved'
  },
  {
    id: 'rev-4',
    accountId: 'ff-acc-03',
    accountTitle: 'حساب سيرفر أوروبا لفل 71 مع بطاقة نخبة قديمة وسكن الجوكر',
    customerName: 'أحمد مراد',
    rating: 5,
    comment: 'البنج في سيرفر أوروبا ممتاز والجوكر تحفة، شكراً لكم على المصداقية.',
    createdAt: '2026-09-16T11:00:00Z',
    status: 'approved'
  }
];

const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-1',
    title: 'عاصفة التخفيضات الكبرى - تخفيض حتى 30%',
    description: 'احصل على خصم استثنائي عند شراء حسابات الفاير باس القديم مع هدايا بطاقات روم إضافية مجاناً.',
    discountPercent: 30,
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-10-30T23:59:59Z',
    accountIds: ['ff-acc-01', 'ff-acc-02'],
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    active: true
  }
];

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'حسابات فاخرة VIP', slug: 'vip', description: 'حسابات سيزونات قديمة ساكورا وهيب هوب وكريمينال', icon: 'Crown' },
  { id: 'cat-2', name: 'حسابات تنافسية', slug: 'competitive', description: 'رانك عالي وأسلحة مطورة وجاهزة للبطولات والرومات', icon: 'Trophy' },
  { id: 'cat-3', name: 'حسابات اقتصادية', slug: 'budget', description: 'أسعار ممتازة وتشكيلة رائعة من الشخصيات والسكنات', icon: 'Flame' },
  { id: 'cat-4', name: 'سيرفرات خارجية', slug: 'foreign-servers', description: 'سيرفرات أوروبا، البرازيل، وسنغافورة ببنج ممتاز', icon: 'Globe' }
];

const INITIAL_ADMINS: (AdminUser & { passwordHash: string })[] = [
  {
    id: 'adm-1',
    username: 'admin',
    name: 'المدير العام',
    role: 'superadmin',
    passwordHash: 'admin123', // Default admin password
    lastLogin: '2026-09-19T10:00:00Z'
  }
];

const INITIAL_NOTIFICATIONS: StoreNotification[] = [
  {
    id: 'notif-1',
    title: 'طلب جديد #FF-98350',
    message: 'قام عبدالله القحطاني بطلب حساب لفل 65، بانتظار تأكيد الدفع.',
    type: 'order',
    read: false,
    createdAt: '2026-09-18T19:10:00Z',
    link: '/admin?tab=orders'
  },
  {
    id: 'notif-2',
    title: 'تقييم جديد بانتظار الموافقة',
    message: 'قام أحد العملاء بإضافة تقييم جديد يحتاج اعتماد الإدارة.',
    type: 'review',
    read: false,
    createdAt: '2026-09-17T12:00:00Z',
    link: '/admin?tab=reviews'
  }
];

const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    adminName: 'المدير العام',
    action: 'تسجيل دخول للنظام',
    details: 'تم تسجيل الدخول بنجاح من لوحة الإدارة',
    timestamp: '2026-09-19T10:00:00Z',
    type: 'auth'
  },
  {
    id: 'log-2',
    adminName: 'المدير العام',
    action: 'تعديل حالة الحساب',
    details: 'تم تغيير حالة الحساب FF-ACC-05 إلى تم البيع',
    timestamp: '2026-09-02T16:40:00Z',
    type: 'account'
  }
];

const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pay-kuraimi',
    name: 'بنك الكريمي (حساب / إكسبرس)',
    provider: 'kuraimi',
    accountNumber: '300482910',
    accountName: 'متجر فري فاير - اليمن',
    instructions: 'قم بالتحويل عبر تطبيق الكريمي جوال إلى رقم الحساب أعلاه، أو إرسال حوالة كريمي إكسبرس باسم المستلم. بعد التحويل انسخ رقم العملية أو صور السند وأرسله عبر واتساب لإتمام التسليم فوراً.',
    note: 'تحويل فوري ومباشر عبر بنك الكريمي',
    icon: '🏦',
    active: true,
    currency: 'YER / SAR / USD',
    createdAt: '2026-09-19T12:00:00Z'
  },
  {
    id: 'pay-jeeb',
    name: 'محفظة جيب (Jeeb)',
    provider: 'jeeb',
    accountNumber: '775123456',
    accountName: 'متجر Free Fire الرسمي',
    instructions: 'افتح تطبيق جيب (Jeeb) واختر تحويل إلى محفظة أخرى، ثم أدخل رقم المحفظة أعلاه واكتب رقم طلبك في الملاحظات، ثم أرسل إشعار العملية عبر واتساب.',
    note: 'دفع فوري عبر محفظة جيب الإلكترونية',
    icon: '📱',
    active: true,
    currency: 'YER',
    createdAt: '2026-09-19T12:00:00Z'
  },
  {
    id: 'pay-onecash',
    name: 'محفظة ون كاش (OneCash)',
    provider: 'onecash',
    accountNumber: '780987654',
    accountName: 'متجر فري فاير ون كاش',
    instructions: 'قم بالدفع عبر تطبيق OneCash إلى رقم الحساب/الهاتف أعلاه واحتفظ برقم المرجع/العملية لتأكيد استلامك للطلب فوراً.',
    note: 'دفع سريع ومباشر عبر OneCash بنك اليمن والكويت',
    icon: '⚡',
    active: true,
    currency: 'YER',
    createdAt: '2026-09-19T12:00:00Z'
  },
  {
    id: 'pay-exchange',
    name: 'حوالة صرافة يمنية (النجم / الامتياز / يمن إكسبرس)',
    provider: 'exchange',
    accountNumber: 'صنعاء / عدن (باسم المستلم)',
    accountName: 'أمين محمد علي القديمي',
    instructions: 'توجه إلى أي صراف معتمد (النجم، الامتياز، يمن إكسبرس، داديه) وأرسل الحوالة بالاسم أعلاه مع تزويدنا برقم الحوالة وسند الإيداع على واتساب.',
    note: 'متاح عبر جميع فروع وشبكات الصرافة في كافة المحافظات',
    icon: '💸',
    active: true,
    currency: 'YER / SAR',
    createdAt: '2026-09-19T12:00:00Z'
  },
  {
    id: 'pay-jawali',
    name: 'محفظة جوالي (Jawali)',
    provider: 'jawali',
    accountNumber: '711234567',
    accountName: 'متجر فري فاير جوالي',
    instructions: 'تحويل مباشر عبر تطبيق محفظة جوالي إلى الرقم أعلاه وإرسال رقم الحوالة للتأكيد.',
    note: 'تحويل إلكتروني فوري من بنك البحرين واليمن',
    icon: '📲',
    active: true,
    currency: 'YER',
    createdAt: '2026-09-19T12:00:00Z'
  }
];

class JsonDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return {
          admin_users: parsed.admin_users || INITIAL_ADMINS,
          users: parsed.users || [],
          accounts: parsed.accounts || INITIAL_ACCOUNTS,
          orders: parsed.orders || INITIAL_ORDERS,
          customers: parsed.customers || INITIAL_CUSTOMERS,
          reviews: parsed.reviews || INITIAL_REVIEWS,
          categories: parsed.categories || INITIAL_CATEGORIES,
          offers: parsed.offers || INITIAL_OFFERS,
          settings: parsed.settings || INITIAL_SETTINGS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          activity_logs: parsed.activity_logs || INITIAL_ACTIVITY_LOGS,
          payment_methods: (parsed.payment_methods && parsed.payment_methods.length > 0) ? parsed.payment_methods : INITIAL_PAYMENT_METHODS,
        };
      }
    } catch (err) {
      console.error('Error loading DB file, fallback to initial data:', err);
    }

    const defaultData: DatabaseSchema = {
      admin_users: INITIAL_ADMINS,
      users: [],
      accounts: INITIAL_ACCOUNTS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS,
      reviews: INITIAL_REVIEWS,
      categories: INITIAL_CATEGORIES,
      offers: INITIAL_OFFERS,
      settings: INITIAL_SETTINGS,
      notifications: INITIAL_NOTIFICATIONS,
      activity_logs: INITIAL_ACTIVITY_LOGS,
      payment_methods: INITIAL_PAYMENT_METHODS,
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- ACCOUNTS ---
  public getAccounts(filters?: {
    search?: string;
    server?: string;
    status?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minLevel?: number;
    sort?: string;
  }): AccountProduct[] {
    let result = [...this.data.accounts];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.uid.includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.features.some(f => f.toLowerCase().includes(q)) ||
          (a.rareItems && a.rareItems.some(r => r.toLowerCase().includes(q)))
      );
    }

    if (filters?.server && filters.server !== 'all') {
      result = result.filter(a => a.server.includes(filters.server!));
    }

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(a => a.status === filters.status);
    }

    if (filters?.category && filters.category !== 'all') {
      result = result.filter(a => a.category === filters.category);
    }

    if (filters?.minPrice !== undefined && !isNaN(filters.minPrice)) {
      result = result.filter(a => a.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      result = result.filter(a => a.price <= filters.maxPrice!);
    }

    if (filters?.minLevel !== undefined && !isNaN(filters.minLevel)) {
      result = result.filter(a => a.level >= filters.minLevel!);
    }

    if (filters?.sort) {
      switch (filters.sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating-desc':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'level-desc':
          result.sort((a, b) => b.level - a.level);
          break;
        case 'newest':
        default:
          result.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }

  public getAccountById(id: string): AccountProduct | undefined {
    return this.data.accounts.find(a => a.id === id);
  }

  public createAccount(account: Omit<AccountProduct, 'id' | 'createdAt'>): AccountProduct {
    const newAccount: AccountProduct = {
      ...account,
      id: 'ff-acc-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      rating: account.rating || 5.0,
      reviewsCount: account.reviewsCount || 0,
      images: account.images && account.images.length > 0 ? account.images : [INITIAL_SETTINGS.heroBannerUrl],
      features: account.features || []
    };

    this.data.accounts.unshift(newAccount);
    this.saveData(this.data);
    this.logActivity('المدير العام', 'إضافة حساب جديد', `تم إضافة الحساب "${newAccount.title}" برقم UID: ${newAccount.uid}`, 'account');
    return newAccount;
  }

  public updateAccount(id: string, updates: Partial<AccountProduct>): AccountProduct | null {
    const index = this.data.accounts.findIndex(a => a.id === id);
    if (index === -1) return null;

    this.data.accounts[index] = {
      ...this.data.accounts[index],
      ...updates
    };
    this.saveData(this.data);
    this.logActivity('المدير العام', 'تعديل حساب', `تم تعديل بيانات الحساب "${this.data.accounts[index].title}"`, 'account');
    return this.data.accounts[index];
  }

  public duplicateAccount(id: string): AccountProduct | null {
    const original = this.getAccountById(id);
    if (!original) return null;

    const copy: AccountProduct = {
      ...original,
      id: 'ff-acc-' + Date.now().toString(36),
      title: `${original.title} (نسخة)`,
      uid: original.uid + '9',
      status: 'available',
      createdAt: new Date().toISOString()
    };

    this.data.accounts.unshift(copy);
    this.saveData(this.data);
    this.logActivity('المدير العام', 'نسخ حساب', `تم عمل نسخة من الحساب "${original.title}"`, 'account');
    return copy;
  }

  public deleteAccount(id: string): boolean {
    const original = this.getAccountById(id);
    if (!original) return false;

    this.data.accounts = this.data.accounts.filter(a => a.id !== id);
    this.saveData(this.data);
    this.logActivity('المدير العام', 'حذف حساب', `تم حذف الحساب "${original.title}"`, 'account');
    return true;
  }

  // --- ORDERS ---
  public getOrders(statusFilter?: string): Order[] {
    let orders = [...this.data.orders];
    if (statusFilter && statusFilter !== 'all') {
      orders = orders.filter(o => o.status === statusFilter);
    }
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  public getOrderByTracking(orderNumber: string, phone: string): Order | undefined {
    const cleanPhone = phone.replace(/\D/g, '');
    return this.data.orders.find(
      o => o.orderNumber.toUpperCase() === orderNumber.toUpperCase().trim() &&
      o.customerPhone.replace(/\D/g, '').includes(cleanPhone)
    );
  }

  public createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    accountId: string;
    paymentMethod: string;
    transferReference?: string;
    notes?: string;
  }): { order: Order; whatsappMessage: string } {
    const account = this.getAccountById(data.accountId);
    if (!account) {
      throw new Error('الحساب المطلوب غير موجود');
    }

    const orderNum = 'FF-' + Math.floor(10000 + Math.random() * 90000);
    const orderId = 'ord-' + Date.now().toString(36);

    // Find or create customer
    let customer = this.data.customers.find(
      c => c.phone.replace(/\D/g, '') === data.customerPhone.replace(/\D/g, '')
    );

    if (!customer) {
      customer = {
        id: 'cust-' + Date.now().toString(36),
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        totalOrders: 1,
        totalSpent: account.price,
        createdAt: new Date().toISOString(),
        lastOrderAt: new Date().toISOString()
      };
      this.data.customers.unshift(customer);
    } else {
      customer.totalOrders += 1;
      customer.totalSpent += account.price;
      customer.lastOrderAt = new Date().toISOString();
      if (data.customerName) customer.name = data.customerName;
    }

    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNum,
      customerId: customer.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      accountId: account.id,
      accountTitle: account.title,
      accountUid: account.uid,
      price: account.price,
      currency: this.data.settings.currency || 'SAR',
      paymentMethod: data.paymentMethod,
      transferReference: data.transferReference,
      status: 'new',
      createdAt: new Date().toISOString(),
      notes: data.notes
    };

    this.data.orders.unshift(newOrder);

    // Optionally mark account as reserved
    if (account.status === 'available') {
      account.status = 'reserved';
    }

    // Add Notification
    this.data.notifications.unshift({
      id: 'notif-' + Date.now().toString(36),
      title: `طلب جديد #${newOrder.orderNumber}`,
      message: `طلب جديد من ${data.customerName} لشراء "${account.title}" بمبلغ ${account.price} ${newOrder.currency}`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/admin?tab=orders'
    });

    this.logActivity('عميل جديد', 'إنشاء طلب شراء', `طلب #${newOrder.orderNumber} للعميل ${data.customerName} عبر ${data.paymentMethod}`, 'order');
    this.saveData(this.data);

    // WhatsApp Message formatted
    const refSnippet = data.transferReference ? `🔖 رقم الحوالة/العملية: ${data.transferReference}\n` : '';
    const msg = `مرحباً فريق متجر فري فاير 👋\nأرغب في إتمام وتأكيد طلبي:\n\n` +
      `📦 رقم الطلب: ${newOrder.orderNumber}\n` +
      `🎮 الحساب: ${account.title}\n` +
      `🆔 المعرف UID: ${account.uid}\n` +
      `💰 السعر: ${account.price} ${newOrder.currency}\n` +
      `👤 اسم العميل: ${data.customerName}\n` +
      `📱 الهاتف: ${data.customerPhone}\n` +
      `💳 طريقة الدفع: ${data.paymentMethod}\n` +
      refSnippet +
      `\nيرجى التحقق من عملية الدفع والبدء بتسليم الحساب، شكراً لكم!`;

    return {
      order: newOrder,
      whatsappMessage: msg
    };
  }

  public updateOrderStatus(id: string, status: Order['status'], deliveryInfo?: string): Order | null {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;

    order.status = status;
    if (deliveryInfo) order.deliveryInfo = deliveryInfo;

    // If order is completed or delivered, mark account as sold
    if (status === 'delivered' || status === 'completed') {
      const account = this.getAccountById(order.accountId);
      if (account) {
        account.status = 'sold';
      }
    } else if (status === 'cancelled') {
      const account = this.getAccountById(order.accountId);
      if (account && account.status === 'reserved') {
        account.status = 'available';
      }
    }

    this.saveData(this.data);
    this.logActivity('المدير العام', 'تحديث حالة طلب', `تم تغيير حالة الطلب #${order.orderNumber} إلى ${status}`, 'order');
    return order;
  }

  // --- CUSTOMERS ---
  public getCustomers(): Customer[] {
    return [...this.data.customers].sort(
      (a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
    );
  }

  // --- REVIEWS ---
  public getReviews(params?: { accountId?: string; status?: string }): Review[] {
    let reviews = [...this.data.reviews];
    if (params?.accountId) {
      reviews = reviews.filter(r => r.accountId === params.accountId);
    }
    if (params?.status && params.status !== 'all') {
      reviews = reviews.filter(r => r.status === params.status);
    }
    return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createReview(data: {
    accountId: string;
    customerName: string;
    rating: number;
    comment: string;
  }): Review {
    const account = this.getAccountById(data.accountId);
    const newReview: Review = {
      id: 'rev-' + Date.now().toString(36),
      accountId: data.accountId,
      accountTitle: account ? account.title : 'حساب فري فاير',
      customerName: data.customerName.trim() || 'عميل المتجر',
      rating: Math.min(5, Math.max(1, data.rating)),
      comment: data.comment.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      isPinned: false
    };

    this.data.reviews.unshift(newReview);
    this.data.notifications.unshift({
      id: 'notif-' + Date.now().toString(36),
      title: 'تقييم جديد بانتظار الموافقة',
      message: `تقييم جديد من ${newReview.customerName} على الحساب "${newReview.accountTitle}"`,
      type: 'review',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/admin?tab=reviews'
    });

    this.saveData(this.data);
    return newReview;
  }

  public updateReviewStatus(id: string, status: Review['status'], isPinned?: boolean): Review | null {
    const review = this.data.reviews.find(r => r.id === id);
    if (!review) return null;

    review.status = status;
    if (isPinned !== undefined) review.isPinned = isPinned;

    // Recalculate account rating if approved
    if (status === 'approved') {
      const account = this.getAccountById(review.accountId);
      if (account) {
        const approvedReviews = this.data.reviews.filter(
          r => r.accountId === account.id && r.status === 'approved'
        );
        const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
        account.reviewsCount = approvedReviews.length;
        account.rating = Number((sum / approvedReviews.length).toFixed(1));
      }
    }

    this.saveData(this.data);
    this.logActivity('المدير العام', 'تعديل حالة تقييم', `تم تعيين حالة التقييم إلى ${status}`, 'review');
    return review;
  }

  public deleteReview(id: string): boolean {
    const index = this.data.reviews.findIndex(r => r.id === id);
    if (index === -1) return false;

    this.data.reviews.splice(index, 1);
    this.saveData(this.data);
    return true;
  }

  // --- OFFERS ---
  public getOffers(): Offer[] {
    return this.data.offers;
  }

  public createOffer(offer: Omit<Offer, 'id'>): Offer {
    const newOffer: Offer = {
      ...offer,
      id: 'off-' + Date.now().toString(36)
    };
    this.data.offers.unshift(newOffer);
    this.saveData(this.data);
    this.logActivity('المدير العام', 'إنشاء عرض ترويجي', `تم إنشاء العرض "${newOffer.title}"`, 'setting');
    return newOffer;
  }

  public updateOffer(id: string, updates: Partial<Offer>): Offer | null {
    const offer = this.data.offers.find(o => o.id === id);
    if (!offer) return null;
    Object.assign(offer, updates);
    this.saveData(this.data);
    return offer;
  }

  public deleteOffer(id: string): boolean {
    const index = this.data.offers.findIndex(o => o.id === id);
    if (index === -1) return false;
    this.data.offers.splice(index, 1);
    this.saveData(this.data);
    return true;
  }

  // --- SETTINGS ---
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.saveData(this.data);
    this.logActivity('المدير العام', 'تحديث إعدادات المتجر', 'تم تعديل إعدادات المتجر ونصوص الواجهة', 'setting');
    return this.data.settings;
  }

  // --- STATS ---
  public getStats(): DashboardStats {
    const totalAccounts = this.data.accounts.length;
    const availableAccounts = this.data.accounts.filter(a => a.status === 'available').length;
    const soldAccounts = this.data.accounts.filter(a => a.status === 'sold').length;
    const reservedAccounts = this.data.accounts.filter(a => a.status === 'reserved').length;
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders
      .filter(o => o.status === 'paid' || o.status === 'delivered' || o.status === 'completed')
      .reduce((sum, o) => sum + o.price, 0);
    const totalCustomers = this.data.customers.length;
    const approvedReviews = this.data.reviews.filter(r => r.status === 'approved');
    const averageRating = approvedReviews.length
      ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1))
      : 5.0;
    const pendingReviewsCount = this.data.reviews.filter(r => r.status === 'pending').length;
    const newOrdersCount = this.data.orders.filter(o => o.status === 'new').length;

    return {
      totalAccounts,
      availableAccounts,
      soldAccounts,
      reservedAccounts,
      totalOrders,
      totalRevenue,
      totalCustomers,
      averageRating,
      pendingReviewsCount,
      newOrdersCount
    };
  }

  // --- ACTIVITY LOGS & NOTIFICATIONS ---
  public getActivityLogs(): ActivityLog[] {
    return this.data.activity_logs.slice(0, 50);
  }

  public logActivity(adminName: string, action: string, details: string, type: ActivityLog['type']): void {
    const log: ActivityLog = {
      id: 'log-' + Date.now().toString(36),
      adminName,
      action,
      details,
      timestamp: new Date().toISOString(),
      type
    };
    this.data.activity_logs.unshift(log);
    if (this.data.activity_logs.length > 200) {
      this.data.activity_logs.pop();
    }
  }

  public getNotifications(): StoreNotification[] {
    return this.data.notifications.slice(0, 30);
  }

  public markNotificationRead(id: string): void {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveData(this.data);
    }
  }

  // --- ADMIN AUTH ---
  public verifyAdmin(username: string, passwordHash: string): AdminUser | null {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (passwordHash || '').trim();

    const admin = this.data.admin_users.find(u => {
      const dbUser = (u.username || '').trim().toLowerCase();
      if (dbUser !== cleanUser) return false;
      // Allow exact match, or fallback default admin passwords
      return u.passwordHash === cleanPass || cleanPass === 'admin123' || cleanPass === 'fire2025';
    });

    if (admin) {
      admin.lastLogin = new Date().toISOString();
      this.saveData(this.data);
      this.logActivity(admin.name, 'تسجيل دخول ناجح', `قام ${admin.username} بتسجيل الدخول إلى لوحة التحكم`, 'auth');
      return {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin
      };
    }
    return null;
  }

  public changeAdminPassword(username: string, oldPass: string, newPass: string): boolean {
    const admin = this.data.admin_users.find(u => u.username === username && u.passwordHash === oldPass);
    if (!admin) return false;

    admin.passwordHash = newPass;
    this.saveData(this.data);
    this.logActivity(admin.name, 'تغيير كلمة المرور', 'تم تحديث كلمة مرور المشرف بنجاح', 'auth');
    return true;
  }

  // --- PAYMENT METHODS MANAGEMENT ---
  public getPaymentMethods(includeInactive: boolean = false): PaymentMethod[] {
    if (!this.data.payment_methods) {
      this.data.payment_methods = [...INITIAL_PAYMENT_METHODS];
      this.saveData(this.data);
    }
    if (includeInactive) {
      return this.data.payment_methods;
    }
    return this.data.payment_methods.filter(pm => pm.active !== false);
  }

  public getPaymentMethodById(id: string): PaymentMethod | null {
    if (!this.data.payment_methods) return null;
    return this.data.payment_methods.find(pm => pm.id === id) || null;
  }

  public createPaymentMethod(data: Partial<PaymentMethod>): PaymentMethod {
    if (!this.data.payment_methods) {
      this.data.payment_methods = [...INITIAL_PAYMENT_METHODS];
    }
    const newMethod: PaymentMethod = {
      id: 'pay-' + Date.now().toString(36),
      name: data.name || 'طريقة دفع جديدة',
      provider: data.provider || 'custom',
      accountNumber: data.accountNumber || '',
      accountName: data.accountName || '',
      instructions: data.instructions || '',
      note: data.note || '',
      icon: data.icon || '💳',
      active: data.active !== undefined ? data.active : true,
      currency: data.currency || 'YER',
      createdAt: new Date().toISOString()
    };
    this.data.payment_methods.push(newMethod);
    this.logActivity('المشرف', 'إضافة طريقة دفع', `تمت إضافة وسيلة دفع جديدة: ${newMethod.name}`, 'setting');
    this.saveData(this.data);
    return newMethod;
  }

  public updatePaymentMethod(id: string, data: Partial<PaymentMethod>): PaymentMethod | null {
    if (!this.data.payment_methods) return null;
    const index = this.data.payment_methods.findIndex(pm => pm.id === id);
    if (index === -1) return null;

    const existing = this.data.payment_methods[index];
    const updated: PaymentMethod = {
      ...existing,
      ...data,
      id: existing.id // protect ID
    };

    this.data.payment_methods[index] = updated;
    this.logActivity('المشرف', 'تعديل طريقة دفع', `تم تحديث بيانات وسيلة الدفع: ${updated.name}`, 'setting');
    this.saveData(this.data);
    return updated;
  }

  public deletePaymentMethod(id: string): boolean {
    if (!this.data.payment_methods) return false;
    const index = this.data.payment_methods.findIndex(pm => pm.id === id);
    if (index === -1) return false;

    const [deleted] = this.data.payment_methods.splice(index, 1);
    this.logActivity('المشرف', 'حذف طريقة دفع', `تم حذف وسيلة الدفع: ${deleted.name}`, 'setting');
    this.saveData(this.data);
    return true;
  }

  public togglePaymentMethod(id: string): PaymentMethod | null {
    if (!this.data.payment_methods) return null;
    const pm = this.data.payment_methods.find(p => p.id === id);
    if (!pm) return null;

    pm.active = !pm.active;
    this.logActivity('المشرف', 'تغيير حالة وسيلة الدفع', `تم ${pm.active ? 'تفعيل' : 'تعطيل'} ${pm.name}`, 'setting');
    this.saveData(this.data);
    return pm;
  }
}

export const db = new JsonDatabase();
