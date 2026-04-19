import { IndexedEntity } from "./core-utils";
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastServiceDate?: number;
}
export interface Booking {
  id: string;
  customerId: string;
  vehicleSize: string;
  packageId: string;
  dateTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  technicianId?: string;
  location?: string;
}
export interface Subscription {
  id: string;
  customerId: string;
  planType: 'basic' | 'premium' | 'elite';
  status: 'active' | 'cancelled';
  nextRenewal: number;
  price: number;
}
export class CustomerEntity extends IndexedEntity<Customer> {
  static readonly entityName = "customer";
  static readonly indexName = "customers";
  static readonly initialState: Customer = { id: "", firstName: "", lastName: "", email: "", phone: "" };
  static seedData: Customer[] = [
    { id: "c1", firstName: "John", lastName: "Doe", email: "john@example.com", phone: "555-0101", lastServiceDate: Date.now() - 86400000 * 5 },
    { id: "c2", firstName: "Jane", lastName: "Smith", email: "jane@example.com", phone: "555-0102", lastServiceDate: Date.now() - 86400000 * 2 }
  ];
}
export class BookingEntity extends IndexedEntity<Booking> {
  static readonly entityName = "booking";
  static readonly indexName = "bookings";
  static readonly initialState: Booking = {
    id: "", customerId: "", vehicleSize: "sedan", packageId: "basic", dateTime: "", status: 'pending', totalPrice: 0, technicianId: "tech-1"
  };
  static seedData: Booking[] = [
    { id: "b1", customerId: "c1", vehicleSize: "suv", packageId: "premium", dateTime: new Date().toISOString(), status: 'confirmed', totalPrice: 150, technicianId: "tech-1", location: "123 Maple St" },
    { id: "b2", customerId: "c2", vehicleSize: "sedan", packageId: "basic", dateTime: new Date(Date.now() + 86400000).toISOString(), status: 'pending', totalPrice: 80, technicianId: "tech-1", location: "456 Oak Ave" }
  ];
}
export class SubscriptionEntity extends IndexedEntity<Subscription> {
  static readonly entityName = "subscription";
  static readonly indexName = "subscriptions";
  static readonly initialState: Subscription = { id: "", customerId: "", planType: "basic", status: "active", nextRenewal: 0, price: 0 };
  static seedData: Subscription[] = [
    { id: "s1", customerId: "c1", planType: "premium", status: "active", nextRenewal: Date.now() + 86400000 * 20, price: 149 },
    { id: "s2", customerId: "c2", planType: "basic", status: "active", nextRenewal: Date.now() + 86400000 * 10, price: 89 }
  ];
}