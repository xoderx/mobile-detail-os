export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type UserRole = 'admin' | 'tech' | 'customer';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: number;
}
export type VehicleSize = 'sedan' | 'suv' | 'truck' | 'luxury';
export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}
export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}
export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: 'luxury' | 'classic' | 'exotic' | 'daily';
  description?: string;
}
export interface ServiceTier {
  id: string;
  name: string;
  price: number;
  displayPrice?: string;
  specialOffer?: string;
  features: string[];
  isPopular: boolean;
}
export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}
export interface AppConfig {
  id: string;
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  aboutText: string;
  ctaText: string;
  features: FeatureItem[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  brandTheme: {
    primaryColor: string;
    gradientStart: string;
    gradientEnd: string;
    fontScale: number;
  };
  integrations: {
    stripe: boolean;
    twilio: boolean;
    googleMaps: boolean;
    cloudinary: boolean;
  };
  keys: {
    stripePublicKey: string;
    twilioSid: string;
    cloudinaryKey?: string;
  };
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}