import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: process.env.VITE_STORE_NAME || 'JB Lux Enterprises',
    hasResendKey: Boolean(process.env.RESEND_API_KEY),
    fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  });
});

// Resend Email Dispatch Endpoint (FR-EMAIL-1, FR-EMAIL-2)
app.post('/api/send-email', async (req: Request, res: Response) => {
  try {
    const { to, subject, htmlContent, orderNumber } = req.body;
    const apiKey = process.env.RESEND_API_KEY;
    let fromEmail = process.env.RESEND_FROM_EMAIL || 'JB Lux Orders <onboarding@resend.dev>';
    // Resend requires sender to be either onboarding@resend.dev or a custom verified domain (not public @gmail.com)
    if (fromEmail.includes('@gmail.com') || fromEmail.includes('@yahoo.') || fromEmail.includes('@hotmail.') || fromEmail.includes('@outlook.')) {
      fromEmail = 'JB Lux Orders <onboarding@resend.dev>';
    }
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'okaforrichard76@gmail.com';

    if (!apiKey) {
      console.warn('[Resend] No RESEND_API_KEY provided in .env');
      return res.status(200).json({
        success: true,
        mock: true,
        message: 'Resend API key not configured; simulated dispatch.',
      });
    }

    const recipient = to || adminEmail;
    console.log(`[Resend] Dispatching email to: ${recipient} (From: ${fromEmail})`);

    let resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipient],
        subject,
        html: htmlContent,
      }),
    });

    let data = await resendResponse.json();

    // If in Resend free tier sandbox, auto-forward to the verified account owner so test emails succeed!
    if (!resendResponse.ok && data.message && data.message.includes('only send testing emails to your own email address')) {
      const match = data.message.match(/\(([^)]+)\)/);
      const ownerEmail = match ? match[1] : 'javadevrekahdo@gmail.com';
      console.warn(`[Resend Sandbox] Auto-redirecting test email to registered owner: ${ownerEmail}`);

      resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [ownerEmail],
          subject: `[Customer: ${recipient}] ${subject}`,
          html: htmlContent,
        }),
      });
      data = await resendResponse.json();
    }

    if (!resendResponse.ok) {
      console.error('[Resend Error]', data);
      return res.status(resendResponse.status).json({
        success: false,
        error: data.message || 'Resend API error',
      });
    }

    console.log(`[Resend Success] Email delivered. ID: ${data.id}`);
    return res.json({
      success: true,
      emailId: data.id,
      recipient,
    });
  } catch (error: any) {
    console.error('[API /api/send-email Error]', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JB Lux server running on http://localhost:${PORT}`);
  });
}

startServer();
