export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tech' | 'customer';
}
export type VehicleSize = 'sedan' | 'suv' | 'truck' | 'luxury';
export interface ServiceTier {
  id: string;
  name: string;
  price: number;
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
  aboutText: string;
  integrations: {
    stripe: boolean;
    twilio: boolean;
    googleMaps: boolean;
  };
  keys: {
    stripePublicKey: string;
    twilioSid: string;
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