import { IndexedEntity } from "./core-utils";
import type { ServiceTier, AddOn, AppConfig } from "@shared/types";
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
  checklist?: Record<string, boolean>;
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
}
export class BookingEntity extends IndexedEntity<Booking> {
  static readonly entityName = "booking";
  static readonly indexName = "bookings";
  static readonly initialState: Booking = {
    id: "", customerId: "", vehicleSize: "sedan", packageId: "basic", dateTime: "", status: 'pending', totalPrice: 0, technicianId: "tech-1", checklist: {}
  };
}
export class SubscriptionEntity extends IndexedEntity<Subscription> {
  static readonly entityName = "subscription";
  static readonly indexName = "subscriptions";
  static readonly initialState: Subscription = { id: "", customerId: "", planType: "basic", status: "active", nextRenewal: 0, price: 0 };
}
export class ServiceTierEntity extends IndexedEntity<ServiceTier> {
  static readonly entityName = "service-tier";
  static readonly indexName = "service-tiers";
  static readonly initialState: ServiceTier = { id: "", name: "", price: 0, features: [], isPopular: false };
  static seedData: ServiceTier[] = [
    { id: 'basic', name: 'Essential Wash', price: 89, features: ['Hand Wash', 'Tire Dressing', 'Interior Vacuum'], isPopular: false },
    { id: 'premium', name: 'Signature Detail', price: 149, features: ['Essential Wash Plus', 'Clay Bar', 'Synthetic Wax'], isPopular: true },
    { id: 'ceramic', name: 'Ceramic Guard', price: 299, features: ['Signature Detail Plus', '12-Month Coating'], isPopular: false },
  ];
}
export class AddOnEntity extends IndexedEntity<AddOn> {
  static readonly entityName = "addon";
  static readonly indexName = "addons";
  static readonly initialState: AddOn = { id: "", name: "", price: 0, description: "" };
  static seedData: AddOn[] = [
    { id: 'engine', name: 'Engine Bay Detail', price: 49, description: 'Deep clean of engine compartment.' },
    { id: 'pet', name: 'Pet Hair Removal', price: 30, description: 'Complete removal of stubborn pet fur.' },
    { id: 'headlight', name: 'Headlight Restoration', price: 60, description: 'Restore clarity to fogged headlights.' },
  ];
}
export class ConfigEntity extends IndexedEntity<AppConfig> {
  static readonly entityName = "config";
  static readonly indexName = "configs";
  static readonly initialState: AppConfig = {
    id: "global-settings",
    siteTitle: "DetailFlow OS",
    heroTitle: "Showroom quality at your doorstep.",
    heroSubtitle: "Mobile auto detailing reimagined. We bring premium care directly to you.",
    aboutText: "Founded by automotive enthusiasts, DetailFlow combines cutting-edge techniques with premium products.",
    integrations: { stripe: true, twilio: false, googleMaps: true },
    keys: { stripePublicKey: "pk_test_placeholder", twilioSid: "AC_placeholder" }
  };
}