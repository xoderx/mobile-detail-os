import { create } from 'zustand';
import type { ServiceTier, AddOn, VehicleSize } from '@shared/types';
export interface BookingState {
  step: number;
  vehicleSize: VehicleSize | null;
  packageId: string | null;
  addOns: string[];
  dateTime: string | null;
  confirmedBookingId: string | null;
  availableTiers: ServiceTier[];
  availableAddOns: AddOn[];
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
  setConfirmedBookingId: (id: string | null) => void;
  setContact: (contact: Partial<BookingState['contact']>) => void;
  setCatalog: (tiers: ServiceTier[], addons: AddOn[]) => void;
  getTotalPrice: () => number;
  reset: () => void;
}
const initialContact = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
};
const VEHICLE_PREMIUMS: Record<string, number> = {
  sedan: 0,
  suv: 20,
  truck: 40,
  luxury: 60
};
export const useBookingStore = create<BookingState>((set, get) => ({
  step: 1,
  vehicleSize: null,
  packageId: null,
  addOns: [],
  dateTime: null,
  confirmedBookingId: null,
  availableTiers: [],
  availableAddOns: [],
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
  setConfirmedBookingId: (confirmedBookingId) => set({ confirmedBookingId }),
  setContact: (contact) => set((state) => ({
    contact: { ...state.contact, ...contact }
  })),
  setCatalog: (availableTiers, availableAddOns) => set({ availableTiers, availableAddOns }),
  getTotalPrice: () => {
    const { vehicleSize, packageId, addOns, availableTiers, availableAddOns } = get();
    let total = 0;
    if (packageId && availableTiers.length > 0) {
      const selectedTier = availableTiers.find(t => t.id === packageId);
      if (selectedTier) {
        total += selectedTier.price;
      }
    }
    if (vehicleSize && vehicleSize in VEHICLE_PREMIUMS) {
      total += VEHICLE_PREMIUMS[vehicleSize];
    }
    if (addOns.length > 0 && availableAddOns.length > 0) {
      addOns.forEach(id => {
        const addon = availableAddOns.find(a => a.id === id);
        if (addon) {
          total += addon.price;
        }
      });
    }
    return total;
  },
  reset: () => set({
    step: 1,
    vehicleSize: null,
    packageId: null,
    addOns: [],
    dateTime: null,
    confirmedBookingId: null,
    contact: initialContact,
  }),
}));