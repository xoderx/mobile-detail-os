import { Hono } from "hono";
import type { Env } from './core-utils';
import { CustomerEntity, BookingEntity, SubscriptionEntity, ServiceTierEntity, AddOnEntity, ConfigEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { addDays, format } from 'date-fns';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'DetailFlow OS API' }}));
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { role } = await c.req.json();
    return ok(c, { id: `u-${role}`, name: role === 'admin' ? 'Admin User' : role === 'tech' ? 'John Tech' : 'Valued Customer', role, email: 'user@example.com' });
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
  // CMS: CONFIG
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
    await entity.patch(data);
    return ok(c, await entity.getState());
  });
  // CMS: SERVICES
  app.get('/api/cms/services', async (c) => {
    await ServiceTierEntity.ensureSeed(c.env);
    return ok(c, await ServiceTierEntity.list(c.env));
  });
  app.post('/api/cms/services', async (c) => {
    const data = await c.req.json();
    const service = await ServiceTierEntity.create(c.env, { ...data, id: crypto.randomUUID() });
    return ok(c, service);
  });
  app.patch('/api/cms/services/:id', async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();
    const entity = new ServiceTierEntity(c.env, id);
    await entity.patch(data);
    return ok(c, await entity.getState());
  });
  app.delete('/api/cms/services/:id', async (c) => {
    const id = c.req.param('id');
    await ServiceTierEntity.delete(c.env, id);
    return ok(c, { success: true });
  });
  // CMS: ADDONS
  app.get('/api/cms/addons', async (c) => {
    await AddOnEntity.ensureSeed(c.env);
    return ok(c, await AddOnEntity.list(c.env));
  });
  app.post('/api/cms/addons', async (c) => {
    const data = await c.req.json();
    const addon = await AddOnEntity.create(c.env, { ...data, id: crypto.randomUUID() });
    return ok(c, addon);
  });
  app.patch('/api/cms/addons/:id', async (c) => {
    const id = c.req.param('id');
    const data = await c.req.json();
    const entity = new AddOnEntity(c.env, id);
    await entity.patch(data);
    return ok(c, await entity.getState());
  });
  app.delete('/api/cms/addons/:id', async (c) => {
    const id = c.req.param('id');
    await AddOnEntity.delete(c.env, id);
    return ok(c, { success: true });
  });
  // BOOKINGS (Existing refined)
  app.get('/api/bookings', async (c) => {
    await BookingEntity.ensureSeed(c.env);
    const techId = c.req.query('technicianId');
    const customerId = c.req.query('customerId');
    const page = await BookingEntity.list(c.env);
    let filtered = page.items;
    if (techId) filtered = filtered.filter(b => b.technicianId === techId);
    if (customerId) filtered = filtered.filter(b => b.customerId === customerId);
    return ok(c, { items: filtered, next: page.next });
  });
  app.get('/api/bookings/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new BookingEntity(c.env, id);
    const state = await entity.getState();
    if (!state.id) return notFound(c, 'Booking not found');
    return ok(c, { ...state, contact: { firstName: 'Demo', lastName: 'Customer', phone: '555-0199', address: '123 Detail Lane' } });
  });
  app.post('/api/bookings', async (c) => {
    const data = await c.req.json();
    const booking = await BookingEntity.create(c.env, { ...data, id: crypto.randomUUID(), status: 'pending', checklist: {} });
    return ok(c, booking);
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