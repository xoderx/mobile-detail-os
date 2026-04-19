import { Hono } from "hono";
import type { Env } from './core-utils';
import { CustomerEntity, BookingEntity } from "./entities";
import { ok, bad, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'DetailFlow OS API' }}));
  // CUSTOMERS
  app.get('/api/customers', async (c) => {
    await CustomerEntity.ensureSeed(c.env);
    const page = await CustomerEntity.list(c.env);
    return ok(c, page);
  });
  // BOOKINGS
  app.get('/api/bookings', async (c) => {
    await BookingEntity.ensureSeed(c.env);
    const page = await BookingEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/bookings', async (c) => {
    const data = (await c.req.json()) as any;
    if (!data.customerId || !data.packageId) return bad(c, 'Invalid booking data');
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
}