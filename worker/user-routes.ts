import { Hono } from "hono";
import type { Env } from './core-utils';
import { CustomerEntity, BookingEntity, SubscriptionEntity } from "./entities";
import { ok, bad } from './core-utils';
import { addDays, format } from 'date-fns';

export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'DetailFlow OS API' }}));
  
  // AUTH
  app.post('/api/auth/login', async (c) => {
    const { role } = await c.req.json();
    return ok(c, { id: crypto.randomUUID(), name: 'User Name', role, email: 'user@example.com' });
  });

  // WEATHER
  app.get('/api/weather', (c) => {
    const forecasts = Array.from({ length: 30 }).map((_, i) => ({
      date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
      condition: i % 4 === 0 ? 'Rainy' : 'Sunny',
      temp: Math.floor(Math.random() * (85 - 65) + 65)
    }));
    return ok(c, forecasts);
  });

  // STATS / ANALYTICS
  app.get('/api/stats', async (c) => {
    const bookings = await BookingEntity.list(c.env);
    const customers = await CustomerEntity.list(c.env);
    const subs = await SubscriptionEntity.list(c.env);
    const totalRevenue = bookings.items.reduce((acc, b) => acc + (b.status === 'completed' || b.status === 'confirmed' ? b.totalPrice : 0), 0);
    const mrr = subs.items.reduce((acc, s) => acc + (s.status === 'active' ? s.price : 0), 0);
    return ok(c, {
      totalRevenue,
      mrr,
      activeJobs: bookings.items.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
      customerCount: customers.items.length,
      subscriptionCount: subs.items.filter(s => s.status === 'active').length,
      satisfactionScore: 4.9,
      weatherForecast: {
        condition: 'Partly Cloudy',
        riskLevel: 'Low'
      }
    });
  });
  // CUSTOMERS
  app.get('/api/customers', async (c) => {
    await CustomerEntity.ensureSeed(c.env);
    const page = await CustomerEntity.list(c.env);
    return ok(c, page);
  });
  // BOOKINGS
  app.get('/api/bookings', async (c) => {
    await BookingEntity.ensureSeed(c.env);
    const techId = c.req.query('technicianId');
    const page = await BookingEntity.list(c.env);
    if (techId) {
      return ok(c, { items: page.items.filter(b => b.technicianId === techId), next: page.next });
    }
    return ok(c, page);
  });
  app.post('/api/bookings', async (c) => {
    const data = (await c.req.json()) as any;
    const booking = await BookingEntity.create(c.env, {
      ...data,
      id: crypto.randomUUID(),
      status: 'pending'
    });
    return ok(c, booking);
  });
  app.patch('/api/bookings/:id/status', async (c) => {
    const id = c.req.param('id');
    const { status } = (await c.req.json()) as { status: string };
    const entity = new BookingEntity(c.env, id);
    await entity.patch({ status: status as any });
    return ok(c, { id, status });
  });
  // SUBSCRIPTIONS
  app.get('/api/subscriptions', async (c) => {
    await SubscriptionEntity.ensureSeed(c.env);
    const page = await SubscriptionEntity.list(c.env);
    return ok(c, page);
  });
  // PAYMENTS MOCK
  app.post('/api/payments/create-session', async (c) => {
    // Simulating Stripe Checkout Session creation
    return ok(c, { sessionId: 'mock_session_' + crypto.randomUUID(), url: '#' });
  });
}