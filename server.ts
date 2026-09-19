import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with generous limit for base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // --- API ROUTES FIRST ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Settings
  app.get('/api/settings', (req: Request, res: Response) => {
    try {
      const settings = db.getSettings();
      res.json(settings);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Accounts
  app.get('/api/accounts', (req: Request, res: Response) => {
    try {
      const {
        search,
        server,
        status,
        category,
        minPrice,
        maxPrice,
        minLevel,
        sort,
      } = req.query;

      const accounts = db.getAccounts({
        search: search as string,
        server: server as string,
        status: status as string,
        category: category as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        minLevel: minLevel ? parseInt(minLevel as string, 10) : undefined,
        sort: sort as string,
      });

      res.json(accounts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/accounts/:id', (req: Request, res: Response) => {
    try {
      const account = db.getAccountById(req.params.id);
      if (!account) {
        return res.status(404).json({ error: 'الحساب غير موجود' });
      }
      res.json(account);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/accounts', (req: Request, res: Response) => {
    try {
      const newAccount = db.createAccount(req.body);
      res.status(201).json(newAccount);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/accounts/:id', (req: Request, res: Response) => {
    try {
      const updated = db.updateAccount(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'الحساب غير موجود' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/accounts/:id/duplicate', (req: Request, res: Response) => {
    try {
      const duplicated = db.duplicateAccount(req.params.id);
      if (!duplicated) {
        return res.status(404).json({ error: 'الحساب غير موجود' });
      }
      res.json(duplicated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/accounts/:id', (req: Request, res: Response) => {
    try {
      const success = db.deleteAccount(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'الحساب غير موجود' });
      }
      res.json({ success: true, message: 'تم حذف الحساب بنجاح' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Media / image upload handler
  app.post('/api/upload', (req: Request, res: Response) => {
    try {
      const { dataUrl, filename } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'لم يتم إرسال ملف' });
      }

      // Check format
      if (!dataUrl.startsWith('data:image/') && !dataUrl.startsWith('data:video/')) {
        return res.status(400).json({ error: 'صيغة الملف غير مدعومة. يرجى رفع صورة أو فيديو صالح.' });
      }

      // Direct dataUrl return is instant, reliable, zero-config and persists inside the json db
      res.json({ url: dataUrl, filename: filename || 'media_file' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Orders
  app.get('/api/orders', (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      const orders = db.getOrders(status as string);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/orders/track', (req: Request, res: Response) => {
    try {
      const { orderNumber, phone } = req.query;
      if (!orderNumber || !phone) {
        return res.status(400).json({ error: 'رقم الطلب ورقم الهاتف مطلوبان للبحث' });
      }

      const order = db.getOrderByTracking(orderNumber as string, phone as string);
      if (!order) {
        return res.status(404).json({ error: 'لم يتم العثور على طلب مطابق للبيانات المدخلة' });
      }

      const account = db.getAccountById(order.accountId);

      res.json({
        order,
        account: account ? {
          title: account.title,
          uid: account.uid,
          level: account.level,
          image: account.images[0],
          server: account.server
        } : null
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const { customerName, customerPhone, customerEmail, accountId, paymentMethod, transferReference, notes } = req.body;
      if (!customerName || !customerPhone || !accountId || !paymentMethod) {
        return res.status(400).json({ error: 'جميع الحقول الأساسية مطلوبة لإتمام الطلب' });
      }

      const result = db.createOrder({
        customerName,
        customerPhone,
        customerEmail,
        accountId,
        paymentMethod,
        transferReference,
        notes
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Payment Methods API
  app.get('/api/payment-methods', (req: Request, res: Response) => {
    try {
      const all = req.query.all === 'true';
      const methods = db.getPaymentMethods(all);
      res.json(methods);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/payment-methods', (req: Request, res: Response) => {
    try {
      const { name, provider, accountNumber, accountName, instructions, note, icon, currency, active } = req.body;
      if (!name || !accountNumber || !accountName) {
        return res.status(400).json({ error: 'اسم طريقة الدفع، ورقم الحساب، واسم المستلم حقول مطلوبة' });
      }
      const created = db.createPaymentMethod({
        name,
        provider: provider || 'custom',
        accountNumber,
        accountName,
        instructions: instructions || '',
        note: note || '',
        icon: icon || '💳',
        currency: currency || 'YER',
        active: active !== undefined ? active : true,
      });
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/payment-methods/:id', (req: Request, res: Response) => {
    try {
      const updated = db.updatePaymentMethod(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'وسيلة الدفع غير موجودة' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/payment-methods/:id', (req: Request, res: Response) => {
    try {
      const deleted = db.deletePaymentMethod(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'وسيلة الدفع غير موجودة' });
      }
      res.json({ success: true, message: 'تم حذف وسيلة الدفع بنجاح' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/payment-methods/:id/toggle', (req: Request, res: Response) => {
    try {
      const toggled = db.togglePaymentMethod(req.params.id);
      if (!toggled) {
        return res.status(404).json({ error: 'وسيلة الدفع غير موجودة' });
      }
      res.json(toggled);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    try {
      const { status, deliveryInfo } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'حالة الطلب مطلوبة' });
      }

      const updated = db.updateOrderStatus(req.params.id, status, deliveryInfo);
      if (!updated) {
        return res.status(404).json({ error: 'الطلب غير موجود' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Customers
  app.get('/api/customers', (req: Request, res: Response) => {
    try {
      const customers = db.getCustomers();
      res.json(customers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reviews
  app.get('/api/reviews', (req: Request, res: Response) => {
    try {
      const { accountId, status } = req.query;
      const reviews = db.getReviews({
        accountId: accountId as string,
        status: status as string
      });
      res.json(reviews);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    try {
      const { accountId, customerName, rating, comment } = req.body;
      if (!accountId || !rating || !comment) {
        return res.status(400).json({ error: 'يرجى كتابة التقييم وتحديد عدد النجوم' });
      }

      const review = db.createReview({
        accountId,
        customerName,
        rating: Number(rating),
        comment
      });

      res.status(201).json(review);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/reviews/:id/status', (req: Request, res: Response) => {
    try {
      const { status, isPinned } = req.body;
      const review = db.updateReviewStatus(req.params.id, status, isPinned);
      if (!review) {
        return res.status(404).json({ error: 'التقييم غير موجود' });
      }
      res.json(review);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/reviews/:id', (req: Request, res: Response) => {
    try {
      const success = db.deleteReview(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'التقييم غير موجود' });
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Offers
  app.get('/api/offers', (req: Request, res: Response) => {
    try {
      const offers = db.getOffers();
      res.json(offers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/offers', (req: Request, res: Response) => {
    try {
      const offer = db.createOffer(req.body);
      res.status(201).json(offer);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/offers/:id', (req: Request, res: Response) => {
    try {
      const updated = db.updateOffer(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'العرض غير موجود' });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/offers/:id', (req: Request, res: Response) => {
    try {
      const success = db.deleteOffer(req.params.id);
      if (!success) return res.status(404).json({ error: 'العرض غير موجود' });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dashboard Stats
  app.get('/api/dashboard/stats', (req: Request, res: Response) => {
    try {
      const stats = db.getStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Activity Logs
  app.get('/api/activity-logs', (req: Request, res: Response) => {
    try {
      const logs = db.getActivityLogs();
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Notifications
  app.get('/api/notifications', (req: Request, res: Response) => {
    try {
      const notifs = db.getNotifications();
      res.json(notifs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
    try {
      db.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Auth
  app.post('/api/admin/login', (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبان' });
      }

      const admin = db.verifyAdmin(username, password);
      if (!admin) {
        return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
      }

      // Generate simple session token
      const token = Buffer.from(`${admin.id}:${Date.now()}:${admin.username}`).toString('base64');
      res.json({
        token,
        admin
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/change-password', (req: Request, res: Response) => {
    try {
      const { username, oldPassword, newPassword } = req.body;
      if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
      }

      const success = db.changeAdminPassword(username, oldPassword, newPassword);
      if (!success) {
        return res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
      }

      res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- VITE MIDDLEWARE OR STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 Free Fire Store server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
