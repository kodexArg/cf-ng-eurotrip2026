import { sendTelegramNotification } from '../lib/telegram';

interface Env {
  DB: D1Database;
  AUTH_SECRET: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

// POST: submit an access request (unauthenticated — allowlisted in middleware)
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: { name?: string; email?: string; note?: string };
  try {
    body = await ctx.request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, note } = body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return Response.json({ error: 'name is required' }, { status: 400 });
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'A valid email is required' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedNote = note && typeof note === 'string' ? note.trim() || null : null;

  await ctx.env.DB.prepare(
    'INSERT INTO access_requests (id, name, email, note) VALUES (?, ?, ?, ?)'
  ).bind(id, trimmedName, trimmedEmail, trimmedNote).run();

  // Send Telegram notification (fire-and-forget, don't block on failure)
  const notifText = `🔔 Access request from ${trimmedName} (${trimmedEmail})${trimmedNote ? ': ' + trimmedNote : ''}`;
  try {
    await sendTelegramNotification(ctx.env.TELEGRAM_BOT_TOKEN, ctx.env.TELEGRAM_CHAT_ID, notifText);
  } catch {
    // Notification failure should not block the request
  }

  return Response.json({ success: true });
};

// GET: list all access requests (owner-only)
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const user = (ctx.data as { user?: { name: string; role: string; session_id: string } }).user;
  if (!user || user.role !== 'owner') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { results } = await ctx.env.DB.prepare(
    'SELECT * FROM access_requests ORDER BY created_at DESC'
  ).all();

  return Response.json({ requests: results });
};
