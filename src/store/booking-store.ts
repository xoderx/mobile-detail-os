import { create } from 'zustand';
export type VehicleSize = 'sedan' | 'suv' | 'truck' | 'luxury';
export const PRICING = {
  VEHICLE: {
    sedan: 0,
    suv: 20,
    truck: 40,
    luxury: 60
  },
  PACKAGES: {
    basic: 89,
    premium: 149,
    ceramic: 299
  },
  ADD_ONS: {
    engine: 49,
    pet: 30,
    headlight: 60,
    odor: 25,
    'ceramic-boost': 40,
    'clay-bar': 50
  }
};
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
export const useBookingStore = create<BookingState>((set, get) => ({
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
  getTotalPrice: () => {
    const { vehicleSize, packageId, addOns } = get();
    let total = 0;
    if (packageId && packageId in PRICING.PACKAGES) {
      total += PRICING.PACKAGES[packageId as keyof typeof PRICING.PACKAGES];
    }
    if (vehicleSize && vehicleSize in PRICING.VEHICLE) {
      total += PRICING.VEHICLE[vehicleSize];
    }
    addOns.forEach(id => {
      if (id in PRICING.ADD_ONS) {
        total += PRICING.ADD_ONS[id as keyof typeof PRICING.ADD_ONS];
      }
    });
    return total;
  },
  reset: () => set({
    step: 1,
    vehicleSize: null,
    packageId: null,
    addOns: [],
    dateTime: null,
    contact: initialContact,
  }),
}));