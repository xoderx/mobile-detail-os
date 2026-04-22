import { IndexedEntity } from "./core-utils";
import type { ServiceTier, AddOn, AppConfig, User, VehicleSize } from "@shared/types";
import { subDays, addDays } from "date-fns";
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
  vehicleSize: VehicleSize;
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
  static seedData: Customer[] = [
    { id: "cust-1", firstName: "Robert", lastName: "Chen", email: "robert.c@gmail.com", phone: "555-0101", lastServiceDate: subDays(new Date(), 5).getTime() },
    { id: "cust-2", firstName: "Elena", lastName: "Rodriguez", email: "elena.rod@outlook.com", phone: "555-0102", lastServiceDate: subDays(new Date(), 12).getTime() },
    { id: "cust-3", firstName: "Marcus", lastName: "Thorne", email: "m.thorne@techcorp.io", phone: "555-0103" },
    { id: "cust-4", firstName: "Sarah", lastName: "Jenkins", email: "sarahj@me.com", phone: "555-0104", lastServiceDate: subDays(new Date(), 2).getTime() },
  ];
}
export class BookingEntity extends IndexedEntity<Booking> {
  static readonly entityName = "booking";
  static readonly indexName = "bookings";
  static readonly initialState: Booking = {
    id: "", customerId: "", vehicleSize: "sedan", packageId: "basic", dateTime: "", status: 'pending', totalPrice: 0, technicianId: "tech-1", checklist: {}
  };
  static seedData: Booking[] = [
    { id: "b-1", customerId: "cust-1", vehicleSize: "luxury", packageId: "ceramic", dateTime: subDays(new Date(), 5).toISOString(), status: 'completed', totalPrice: 359, technicianId: "tech-1", checklist: { 'Exterior Wash': true, 'Wheel Cleaning': true, 'Interior Vacuum': true, 'Glass Cleaning': true, 'Tire Dressing': true } },
    { id: "b-2", customerId: "cust-2", vehicleSize: "suv", packageId: "premium", dateTime: subDays(new Date(), 1).toISOString(), status: 'completed', totalPrice: 169, technicianId: "tech-2", checklist: { 'Exterior Wash': true, 'Wheel Cleaning': true, 'Interior Vacuum': true, 'Glass Cleaning': true, 'Tire Dressing': true } },
    { id: "b-3", customerId: "cust-3", vehicleSize: "sedan", packageId: "basic", dateTime: addDays(new Date(), 1).toISOString(), status: 'confirmed', totalPrice: 89, technicianId: "tech-1", checklist: {} },
    { id: "b-4", customerId: "cust-4", vehicleSize: "truck", packageId: "premium", dateTime: addDays(new Date(), 2).toISOString(), status: 'pending', totalPrice: 189, technicianId: "unassigned", checklist: {} },
  ];
}
export class SubscriptionEntity extends IndexedEntity<Subscription> {
  static readonly entityName = "subscription";
  static readonly indexName = "subscriptions";
  static readonly initialState: Subscription = { id: "", customerId: "", planType: "basic", status: "active", nextRenewal: 0, price: 0 };
  static seedData: Subscription[] = [
    { id: "s-1", customerId: "cust-1", planType: "elite", status: "active", nextRenewal: addDays(new Date(), 15).getTime(), price: 199 },
    { id: "s-2", customerId: "cust-2", planType: "premium", status: "active", nextRenewal: addDays(new Date(), 22).getTime(), price: 129 },
    { id: "s-3", customerId: "cust-4", planType: "basic", status: "active", nextRenewal: addDays(new Date(), 5).getTime(), price: 79 },
  ];
}
export class ServiceTierEntity extends IndexedEntity<ServiceTier> {
  static readonly entityName = "service-tier";
  static readonly indexName = "service-tiers";
  static readonly initialState: ServiceTier = { id: "", name: "", price: 0, features: [], isPopular: false };
  static seedData: ServiceTier[] = [
    { id: 'basic', name: 'Arctic Wash', price: 89, features: ['Icy Hand Wash', 'Rim Glaze', 'Interior Frost Vacuum'], isPopular: false },
    { id: 'premium', name: 'Stone Cold Detail', price: 149, features: ['Signature Detail', 'Nano Clay Bar', 'Frozen Crystal Wax'], isPopular: true },
    { id: 'ceramic', name: 'Diamond Shield', price: 299, features: ['Premium Detail Plus', 'Arctic Ceramic Coating'], isPopular: false },
  ];
}
export class AddOnEntity extends IndexedEntity<AddOn> {
  static readonly entityName = "addon";
  static readonly indexName = "addons";
  static readonly initialState: AddOn = { id: "", name: "", price: 0, description: "" };
  static seedData: AddOn[] = [
    { id: 'engine', name: 'Engine Glacier Clean', price: 49, description: 'Deep arctic clean of engine compartment.' },
    { id: 'pet', name: 'Arctic Pet Fur Removal', price: 30, description: 'Complete removal of stubborn pet fur.' },
    { id: 'headlight', name: 'Crystal Clarity Restore', price: 60, description: 'Restore clarity to fogged headlights.' },
  ];
}
export class UserAccountEntity extends IndexedEntity<User> {
  static readonly entityName = "user-account";
  static readonly indexName = "user-accounts";
  static readonly initialState: User = {
    id: "", name: "", email: "", role: "customer", isActive: true, createdAt: 0
  };
  static seedData: User[] = [
    { id: "admin-1", name: "System Admin", email: "admin@stonecold.com", role: "admin", isActive: true, createdAt: Date.now() },
    { id: "tech-1", name: "James Wilson", email: "james@stonecold.com", role: "tech", isActive: true, createdAt: Date.now() },
    { id: "tech-2", name: "Sarah Miller", email: "sarah@stonecold.com", role: "tech", isActive: true, createdAt: Date.now() },
    { id: "cust-1", name: "Demo Customer", email: "customer@gmail.com", role: "customer", isActive: true, createdAt: Date.now() },
  ];
}
export class ConfigEntity extends IndexedEntity<AppConfig> {
  static readonly entityName = "config";
  static readonly indexName = "configs";
  static readonly initialState: AppConfig = {
    id: "global-settings",
    siteTitle: "Stone Cold Detailing",
    heroTitle: "Frozen Perfection. Metallic Shine.",
    heroSubtitle: "Premium mobile automotive detailing with an icy precision finish. We bring the arctic clean to your driveway.",
    ctaText: "Book Your Experience",
    aboutText: "Stone Cold Detailing represents the pinnacle of mobile automotive care. Using icy precision and metallic-grade materials, we ensure your vehicle leaves with a showroom frost.",
    features: [
      { id: 'f1', title: 'Glacial Polish', description: 'Flawless paint correction with an arctic glow.', iconName: 'SprayCan' },
      { id: 'f2', title: 'Deep Freeze Interior', description: 'Steam sanitized and leather restoration.', iconName: 'CarFront' },
      { id: 'f3', title: 'Ice Shield Protection', description: 'Advanced metallic shielding against UV and grime.', iconName: 'ShieldCheck' }
    ],
    testimonials: [
      { id: 't1', author: 'Mark Stevens', role: 'Tesla Model S Owner', content: 'The finish is literally icy. Never seen my car look this metallic and clean.', rating: 5 }
    ],
    brandTheme: {
      primaryColor: "#1E90FF",
      gradientStart: "#1E90FF",
      gradientEnd: "#C0C0C0",
      fontScale: 1
    },
    integrations: { stripe: true, twilio: false, googleMaps: true },
    keys: { stripePublicKey: "pk_test_placeholder", twilioSid: "AC_placeholder" }
  };
}