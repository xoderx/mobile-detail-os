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
    id: "", customerId: "", vehicleSize: "sedan", packageId: "basic", dateTime: "", status: 'pending', totalPrice: 0 
  };
  static seedData: Booking[] = [
    { id: "b1", customerId: "c1", vehicleSize: "suv", packageId: "premium", dateTime: new Date().toISOString(), status: 'confirmed', totalPrice: 150 },
    { id: "b2", customerId: "c2", vehicleSize: "sedan", packageId: "basic", dateTime: new Date(Date.now() + 86400000).toISOString(), status: 'pending', totalPrice: 80 }
  ];
}