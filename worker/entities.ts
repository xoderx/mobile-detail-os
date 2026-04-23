import { IndexedEntity } from "./core-utils";
import type { Env } from './core-utils';
import type { ServiceTier, AddOn, AppConfig, User, VehicleSize, GalleryItem } from "@shared/types";
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
  checklist: Record<string, boolean>;
  addOns?: string[];
  contact?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  turnstileToken?: string;
}
export interface Subscription {
  id: string;
  customerId: string;
  planType: 'basic' | 'premium' | 'elite';
  status: 'active' | 'cancelled';
  nextRenewal: number;
  price: number;
}
export interface NewsletterLead {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}
export class NewsletterEntity extends IndexedEntity<NewsletterLead> {
  static readonly entityName = "newsletter";
  static readonly indexName = "newsletters";
  static readonly initialState: NewsletterLead = { id: "", email: "", name: "", createdAt: 0 };
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
    id: "", customerId: "", vehicleSize: "sedan", packageId: "basic", dateTime: "", status: 'pending', totalPrice: 0, technicianId: "tech-1", checklist: {}, addOns: [], contact: undefined, turnstileToken: undefined
  };
  static seedData: Booking[] = [
    { id: "b-1", customerId: "cust-1", vehicleSize: "luxury", packageId: "premium", dateTime: subDays(new Date(), 5).toISOString(), status: 'completed', totalPrice: 359, technicianId: "tech-1", checklist: { 'Exterior Wash': true, 'Wheel Cleaning': true, 'Interior Vacuum': true, 'Glass Cleaning': true, 'Tire Dressing': true }, addOns: [], contact: undefined, turnstileToken: undefined },
    { id: "b-2", customerId: "cust-2", vehicleSize: "suv", packageId: "full", dateTime: subDays(new Date(), 1).toISOString(), status: 'completed', totalPrice: 180, technicianId: "tech-2", checklist: { 'Exterior Wash': true, 'Wheel Cleaning': true, 'Interior Vacuum': true, 'Glass Cleaning': true, 'Tire Dressing': true }, addOns: [], contact: undefined, turnstileToken: undefined },
    { id: "b-3", customerId: "cust-3", vehicleSize: "sedan", packageId: "basic", dateTime: addDays(new Date(), 1).toISOString(), status: 'confirmed', totalPrice: 50, technicianId: "tech-1", checklist: {}, addOns: [], contact: undefined, turnstileToken: undefined },
  ];
}
export class SubscriptionEntity extends IndexedEntity<Subscription> {
  static readonly entityName = "subscription";
  static readonly indexName = "subscriptions";
  static readonly initialState: Subscription = { id: "", customerId: "", planType: "basic", status: "active", nextRenewal: 0, price: 0 };
  static seedData: Subscription[] = [
    { id: "s-1", customerId: "cust-1", planType: "elite", status: "active", nextRenewal: addDays(new Date(), 15).getTime(), price: 199 },
    { id: "s-2", customerId: "cust-2", planType: "premium", status: "active", nextRenewal: addDays(new Date(), 22).getTime(), price: 129 },
  ];
}
export class ServiceTierEntity extends IndexedEntity<ServiceTier> {
  static readonly entityName = "service-tier";
  static readonly indexName = "service-tiers";
  static readonly initialState: ServiceTier = { id: "", name: "", price: 0, features: [], isPopular: false };
  static seedData: ServiceTier[] = [
    { id: 'basic', name: 'Basic Wash', price: 50, features: ['Hand Wash', 'Rim Shine', 'Tire Dressing', 'Glass Wipe'], isPopular: false },
    { id: 'interior', name: 'Interior Detail', price: 100, features: ['Steam Cleaning', 'Leather Conditioning', 'Deep Vacuum', 'Odor Neutralizer'], isPopular: false },
    { id: 'full', name: 'Full Detail', price: 180, features: ['Signature Wash', 'Interior Detail', 'Nano Clay Bar', 'Frozen Crystal Wax'], displayPrice: '$180 - $220', specialOffer: '$150 first-time visit', isPopular: true },
    { id: 'premium', name: 'Premium Detail', price: 280, features: ['Full Detail Plus', 'Arctic Ceramic Shield', 'Engine Glacier Clean', 'Lifetime Sealant'], displayPrice: '$280 - $350', isPopular: false },
  ];
}
export class AddOnEntity extends IndexedEntity<AddOn> {
  static readonly entityName = "addon";
  static readonly indexName = "addons";
  static readonly initialState: AddOn = { id: "", name: "", price: 0, description: "" };
  static seedData: AddOn[] = [
    { id: 'engine', name: 'Engine Bay Clean', price: 40, description: 'Deep arctic clean of engine compartment.' },
    { id: 'pet', name: 'Pet Fur Removal', price: 30, description: 'Complete removal of stubborn pet fur.' },
    { id: 'headlight', name: 'Headlight Restore', price: 60, description: 'Restore clarity to fogged headlights.' },
    { id: 'clay', name: 'Clay Bar Treatment', price: 50, description: 'Remove contaminants for a glass-smooth finish.' },
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
    { id: "cust-1", name: "Demo Customer", email: "customer@gmail.com", role: "customer", isActive: true, createdAt: Date.now() },
  ];
}
export interface Feedback {
  id: string;
  rating: number;
  comment?: string;
  customerId?: string;
  createdAt: number;
  featured?: boolean;
}
export class FeedbackEntity extends IndexedEntity<Feedback> {
  static readonly entityName = "feedback";
  static readonly indexName = "feedbacks";
  static readonly initialState: Feedback = { id: "", rating: 0, createdAt: 0 };
  static seedData: Feedback[] = [
    { id: "f-1", rating: 5, comment: "The ceramic coating is like a glass shield. Best in the city.", createdAt: Date.now(), featured: true },
    { id: "f-2", rating: 5, comment: "Professional, punctual, and pristine finish.", createdAt: Date.now(), featured: true },
  ];
}
export class ConfigEntity extends IndexedEntity<AppConfig> {
  static readonly entityName = "config";
  static readonly indexName = "configs";
  static readonly initialState: AppConfig = {
    id: "global-settings",
    siteTitle: "Stone Cold Detailing",
    heroTitle: "Frozen Perfection. Metallic Shine.",
    heroSubtitle: "Premium mobile automotive detailing with an icy precision finish starting at just $50.",
    heroImageUrl: "https://images.unsplash.com/photo-1603584173870-7f37ecf6745d?auto=format&fit=crop&q=80&w=2000",
    ctaText: "Book Your Experience",
    aboutText: "Stone Cold Detailing represents the pinnacle of mobile automotive care.",
    logoUrl: "",
    faviconUrl: "",
    features: [
      { id: 'f1', title: 'Glacial Polish', description: 'Flawless paint correction.', iconName: 'SprayCan' },
      { id: 'f2', title: 'Deep Freeze Interior', description: 'Steam sanitized.', iconName: 'CarFront' },
    ],
    testimonials: [
      { id: 't1', author: 'Mark Stevens', role: 'Tesla Owner', content: 'Incredible finish. The water just slides off.', rating: 5 }
    ],
    gallery: [
      { id: 'g1', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800', title: 'Porsche 911 Ceramic', category: 'luxury' },
      { id: 'g2', url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800', title: 'Ferrari F40 Deep Clean', category: 'exotic' },
      { id: 'g3', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800', title: 'Classic G-Wagon Polish', category: 'classic' },
      { id: 'g4', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800', title: 'BMW M4 Interior', category: 'luxury' }
    ],
    brandTheme: { primaryColor: "#00BFFF", gradientStart: "#00BFFF", gradientEnd: "#C0C0C0", fontScale: 1 },
    integrations: { stripe: true, twilio: false, googleMaps: true, cloudinary: false },
    keys: { stripePublicKey: "pk_test_placeholder", twilioSid: "AC_placeholder" }
  };
  static readonly seedData: AppConfig[] = [ConfigEntity.initialState];
}
export const initializeStore = async (env: Env) => {
  await Promise.all([
    ConfigEntity.ensureSeed(env),
    ServiceTierEntity.ensureSeed(env),
    AddOnEntity.ensureSeed(env),
    UserAccountEntity.ensureSeed(env),
    CustomerEntity.ensureSeed(env),
    BookingEntity.ensureSeed(env),
    SubscriptionEntity.ensureSeed(env),
    FeedbackEntity.ensureSeed(env),
  ]);
};