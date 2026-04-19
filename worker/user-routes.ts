import { Hono } from "hono";
import type { Env } from './core-utils';
import { CustomerEntity, BookingEntity, SubscriptionEntity, ServiceTierEntity, AddOnEntity, ConfigEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { addDays, format } from 'date-fns';
// RATE LIMITER HELPER (DO BACKED)
async function checkRateLimit(env: Env, ip: string, key: string, limit: number, windowSec: number = 3600): Promise<boolean> {
  const doId = env.GlobalDurableObject.idFromName('rate-limiter');
  const stub = env.GlobalDurableObject.get(doId);
  const now = Math.floor(Date.now() / 1000);
  const timeKey = Math.floor(now / windowSec);
  const compositeKey = `rl:${key}:${ip}:${timeKey}`;
  // Use DO casPut pattern to increment counter
  // Note: For simplicity in this template, we use getDoc/casPut
  // In a high-traffic env, you'd use a specific atomic increment in the DO
  const doc = await stub.getDoc<number>(compositeKey);
  const current = doc?.data ?? 0;
  const version = doc?.v ?? 0;
  if (current >= limit) return false;
  await stub.casPut(compositeKey, version, current + 1);
  return true;
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'DetailFlow OS API' }}));
  // TURNSTILE VERIFICATION
  app.post('/api/auth/verify-turnstile', async (c) => {
    const { token } = await c.req.json();
    if (!token) return bad(c, 'Turnstile token missing');
    // Use Cloudflare testing secret for demo
    const secret = '1x0000000000000000000000000000000AA';
    const formData = new FormData();
    formData.append('secret', secret);
    formData.append('response', token);
    formData.append('remoteip', c.req.header('CF-Connecting-IP') || '');
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData,
      method: 'POST',
    });
    const outcome = await result.json() as any;
    if (outcome.success) {
      return ok(c, { verified: true });
    }
    return bad(c, 'Bot detection failed');
  });
  // STATS
  app.get('/api/stats', async (c) => {
    const bookings = await BookingEntity.list(c.env);
    const customers = await CustomerEntity.list(c.env);
    const subs = await SubscriptionEntity.list(c.env);
    const configInst = new ConfigEntity(c.env, 'global-settings');
    const config = await configInst.getState();
    const totalRevenue = bookings.items.reduce((acc, b) => acc + (b.status === 'completed' || b.status === 'confirmed' ? b.totalPrice : 0), 0);
    const mrr = subs.items.reduce((acc, s) => acc + (s.status === 'active' ? s.price : 0), 0);
    return ok(c, {
      totalRevenue,
      mrr,
      activeJobs: bookings.items.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
      customerCount: customers.items.length,
      subscriptionCount: subs.items.filter(s => s.status === 'active').length,
      satisfactionScore: 4.9,
      integrations: config.integrations
    });
  });
  // CMS & CONFIG (existing methods preserved...)
  app.get('/api/cms/config', async (c) => {
    const entity = new ConfigEntity(c.env, 'global-settings');
    const state = await entity.getState();
    if (!state.id) {
      await ConfigEntity.create(c.env, ConfigEntity.initialState);
      return ok(c, ConfigEntity.initialState);
    }
    return ok(c, state);
  });
  app.patch('/api/cms/config', async (c) => {
    const data = await c.req.json();
    const entity = new ConfigEntity(c.env, 'global-settings');
    const current = await entity.getState();
    const merged = {
      ...current,
      ...data,
      brandTheme: data.brandTheme ? { ...current.brandTheme, ...data.brandTheme } : current.brandTheme,
      integrations: data.integrations ? { ...current.integrations, ...data.integrations } : current.integrations,
      keys: data.keys ? { ...current.keys, ...data.keys } : current.keys
    };
    await entity.save(merged);
    return ok(c, await entity.getState());
  });
  app.get('/api/cms/services', async (c) => {
    await ServiceTierEntity.ensureSeed(c.env);
    return ok(c, await ServiceTierEntity.list(c.env));
  });
  app.get('/api/cms/addons', async (c) => {
    await AddOnEntity.ensureSeed(c.env);
    return ok(c, await AddOnEntity.list(c.env));
  });
  // BOOKINGS (RATE LIMITED)
  app.get('/api/bookings', async (c) => {
    const page = await BookingEntity.list(c.env);
    const techId = c.req.query('technicianId');
    const customerId = c.req.query('customerId');
    let filtered = page.items;
    if (techId) filtered = filtered.filter(b => b.technicianId === techId);
    if (customerId) filtered = filtered.filter(b => b.customerId === customerId);
    return ok(c, { items: filtered, next: page.next });
  });
  app.post('/api/bookings', async (c) => {
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';
    const allowed = await checkRateLimit(c.env, ip, 'bookings', 5, 3600);
    if (!allowed) return c.json({ success: false, error: 'Too many booking attempts. Please try again later.' }, 429);
    const data = await c.req.json();
    const booking = await BookingEntity.create(c.env, { ...data, id: crypto.randomUUID(), status: 'pending', checklist: {} });
    return ok(c, booking);
  });
  app.get('/api/bookings/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new BookingEntity(c.env, id);
    const state = await entity.getState();
    if (!state.id) return notFound(c, 'Booking not found');
    return ok(c, { ...state, contact: { firstName: 'Demo', lastName: 'Customer', phone: '555-0199', address: '123 Detail Lane' } });
  });
  app.patch('/api/bookings/:id/status', async (c) => {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    const entity = new BookingEntity(c.env, id);
    await entity.patch({ status: status as any });
    return ok(c, { id, status });
  });
  app.patch('/api/bookings/:id/checklist', async (c) => {
    const id = c.req.param('id');
    const { checklist } = await c.req.json();
    const entity = new BookingEntity(c.env, id);
    await entity.patch({ checklist });
    return ok(c, { id, checklist });
  });
  app.post('/api/bookings/:id/assign', async (c) => {
    const id = c.req.param('id');
    const { technicianId } = await c.req.json();
    const entity = new BookingEntity(c.env, id);
    await entity.patch({ technicianId });
    return ok(c, { id, technicianId });
  });
  app.get('/api/weather', (c) => {
    const forecasts = Array.from({ length: 30 }).map((_, i) => ({
      date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
      condition: i % 4 === 0 ? 'Rainy' : 'Sunny',
      temp: Math.floor(Math.random() * (85 - 65) + 65)
    }));
    return ok(c, forecasts);
  });
  app.get('/api/customers', async (c) => {
    await CustomerEntity.ensureSeed(c.env);
    return ok(c, await CustomerEntity.list(c.env));
  });
  app.get('/api/subscriptions', async (c) => {
    await SubscriptionEntity.ensureSeed(c.env);
    return ok(c, await SubscriptionEntity.list(c.env));
  });
  app.post('/api/payments/create-session', async (c) => ok(c, { url: '#' }));
}