import { Hono } from "hono";
import { format, addDays } from "date-fns";
import type { Env } from './core-utils';
import { CustomerEntity, BookingEntity, SubscriptionEntity, ServiceTierEntity, AddOnEntity, ConfigEntity, UserAccountEntity, FeedbackEntity, NewsletterEntity, initializeStore } from "./entities";
import { ok, bad, notFound } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // SEEDING & STATS
  app.get('/api/stats', async (c) => {
    await initializeStore(c.env);
    const bookings = await BookingEntity.list(c.env);
    const customers = await CustomerEntity.list(c.env);
    const subs = await SubscriptionEntity.list(c.env);
    const feedback = await FeedbackEntity.list(c.env);
    const totalRevenue = bookings.items.reduce((acc, b) => acc + (b.status === 'completed' ? b.totalPrice : 0), 0);
    const mrr = subs.items.reduce((acc, s) => acc + (s.status === 'active' ? s.price : 0), 0);
    const avgRating = feedback.items.length > 0 
      ? feedback.items.reduce((acc, f) => acc + f.rating, 0) / feedback.items.length 
      : 5.0;
    return ok(c, {
      totalRevenue,
      mrr,
      activeJobs: bookings.items.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length,
      customerCount: customers.items.length,
      subscriptionCount: subs.items.filter(s => s.status === 'active').length,
      satisfactionScore: parseFloat(avgRating.toFixed(1)),
      integrations: { stripe: true, twilio: false, googleMaps: true }
    });
  });
  // CMS
  app.get('/api/cms/config', async (c) => {
    await initializeStore(c.env);
    const entity = new ConfigEntity(c.env, 'global-settings');
    return ok(c, await entity.getState());
  });
  app.patch('/api/cms/config', async (c) => {
    const payload = await c.req.json();
    const entity = new ConfigEntity(c.env, 'global-settings');
    await entity.patch(payload);
    return ok(c, { success: true });
  });
  app.get('/api/cms/services', async (c) => {
    await initializeStore(c.env);
    return ok(c, await ServiceTierEntity.list(c.env));
  });
  app.get('/api/cms/addons', async (c) => {
    await initializeStore(c.env);
    return ok(c, await AddOnEntity.list(c.env));
  });
  // AUTH & SECURITY
  app.post('/api/auth/verify-turnstile', async (c) => {
    const { token } = await c.req.json();
    if (!token) return bad(c, 'Security token missing');
    return ok(c, { verified: true });
  });
  app.post('/api/auth/register', async (c) => {
    const { name, email, password, role, phoneNumber } = await c.req.json();
    if (!email || !name) return bad(c, 'Required fields missing');
    const user = await UserAccountEntity.create(c.env, {
      id: crypto.randomUUID(),
      name,
      email,
      role: role || 'customer',
      phoneNumber,
      isActive: true,
      createdAt: Date.now()
    });
    if (user.role === 'customer') {
      await CustomerEntity.create(c.env, {
        id: user.id,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        email,
        phone: phoneNumber || '',
      });
    }
    return ok(c, user);
  });
  app.get('/api/users', async (c) => {
    await initializeStore(c.env);
    return ok(c, await UserAccountEntity.list(c.env));
  });
  app.delete('/api/users/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await UserAccountEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
  // NEWSLETTER & LEADS
  app.post('/api/newsletters', async (c) => {
    const { name, email } = await c.req.json();
    if (!email) return bad(c, 'Email required');
    const lead = await NewsletterEntity.create(c.env, {
      id: crypto.randomUUID(),
      email,
      name: name || '',
      createdAt: Date.now()
    });
    return ok(c, lead);
  });
  // FEEDBACK
  app.get('/api/feedback', async (c) => {
    await initializeStore(c.env);
    return ok(c, await FeedbackEntity.list(c.env));
  });
  app.post('/api/feedback', async (c) => {
    const { rating, comment, customerId } = await c.req.json();
    if (!rating) return bad(c, 'Rating required');
    const feedback = await FeedbackEntity.create(c.env, {
      id: crypto.randomUUID(),
      rating,
      comment,
      customerId,
      createdAt: Date.now(),
      featured: false
    });
    return ok(c, feedback);
  });
  app.patch('/api/feedback/:id', async (c) => {
    const id = c.req.param('id');
    const payload = await c.req.json();
    const entity = new FeedbackEntity(c.env, id);
    await entity.patch(payload);
    return ok(c, { success: true });
  });
  app.delete('/api/feedback/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await FeedbackEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
  // BOOKINGS
  app.get('/api/bookings', async (c) => {
    const techId = c.req.query('technicianId');
    const customerId = c.req.query('customerId');
    const page = await BookingEntity.list(c.env);
    let items = page.items;
    if (techId) items = items.filter(b => b.technicianId === techId);
    if (customerId) items = items.filter(b => b.customerId === customerId);
    return ok(c, { items, next: page.next });
  });
  app.post('/api/bookings', async (c) => {
    const {customerId, vehicleSize, packageId, addOns=[], dateTime, contact, totalPrice, turnstileToken} = await c.req.json();
    if (!vehicleSize || !packageId || !dateTime || !contact?.firstName || !contact?.lastName || !contact?.email || !contact?.phone || !contact?.address || !turnstileToken || totalPrice <= 0) return bad(c, 'Missing or invalid required booking details');
    const booking = await BookingEntity.create(c.env, {customerId, vehicleSize, packageId, addOns: addOns || [], dateTime, totalPrice, turnstileToken, contact, id: crypto.randomUUID(), status: 'pending', checklist: {} });
    return ok(c, booking);
  });
  app.get('/api/bookings/:id', async (c) => {
    const entity = new BookingEntity(c.env, c.req.param('id'));
    const state = await entity.getState();
    if (!state.id) return notFound(c);
    const customer = state.customerId ? await new CustomerEntity(c.env, state.customerId).getState() : null;
    return ok(c, { ...state, contact: customer || { firstName: 'Guest', lastName: 'Client' } });
  });
  app.post('/api/bookings/:id/assign', async (c) => {
    const { technicianId } = await c.req.json();
    const id = c.req.param('id');
    const entity = new BookingEntity(c.env, id);
    await entity.patch({ technicianId });
    return ok(c, { success: true });
  });
  app.patch('/api/bookings/:id/status', async (c) => {
    const { status } = await c.req.json();
    const entity = new BookingEntity(c.env, c.req.param('id'));
    await entity.patch({ status });
    return ok(c, { success: true });
  });
  app.patch('/api/bookings/:id/checklist', async (c) => {
    const { checklist } = await c.req.json();
    const entity = new BookingEntity(c.env, c.req.param('id'));
    await entity.patch({ checklist });
    return ok(c, { success: true });
  });
  app.get('/api/customers', async (c) => ok(c, await CustomerEntity.list(c.env)));
  app.get('/api/subscriptions', async (c) => ok(c, await SubscriptionEntity.list(c.env)));
  app.get('/api/weather', (c) => ok(c, Array.from({ length: 7 }).map((_, i) => ({
    date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
    condition: i % 3 === 0 ? 'Cloudy' : 'Sunny',
    temp: 70 + i
  }))));
}