import { create } from 'zustand';
export type VehicleSize = 'sedan' | 'suv' | 'truck' | 'luxury';
export interface BookingState {
  step: number;
  vehicleSize: VehicleSize | null;
  packageId: string | null;
  addOns: string[];
  dateTime: string | null;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  setStep: (step: number) => void;
  setVehicleSize: (size: VehicleSize) => void;
  setPackageId: (id: string) => void;
  toggleAddOn: (id: string) => void;
  setDateTime: (dateTime: string) => void;
  setContact: (contact: Partial<BookingState['contact']>) => void;
  reset: () => void;
}
const initialContact = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
};
export const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  vehicleSize: null,
  packageId: null,
  addOns: [],
  dateTime: null,
  contact: initialContact,
  setStep: (step) => set({ step }),
  setVehicleSize: (vehicleSize) => set({ vehicleSize, step: 2 }),
  setPackageId: (packageId) => set({ packageId, step: 3 }),
  toggleAddOn: (id) => set((state) => ({
    addOns: state.addOns.includes(id)
      ? state.addOns.filter((a) => a !== id)
      : [...state.addOns, id],
  })),
  setDateTime: (dateTime) => set({ dateTime, step: 5 }),
  setContact: (contact) => set((state) => ({ 
    contact: { ...state.contact, ...contact } 
  })),
  reset: () => set({
    step: 1,
    vehicleSize: null,
    packageId: null,
    addOns: [],
    dateTime: null,
    contact: initialContact,
  }),
}));