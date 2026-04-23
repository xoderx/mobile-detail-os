import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ServiceTier, AddOn, VehicleSize } from '@shared/types';
import { FIRST_TIME_DISCOUNT } from '@/lib/constants';
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
export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
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
        const vehicleSize = get().vehicleSize;
        const packageId = get().packageId;
        const addOns = get().addOns;
        const availableTiers = get().availableTiers;
        const availableAddOns = get().availableAddOns;
        let total = 0;
        // Base Package Price with Special Offer handling
        if (packageId && availableTiers.length > 0) {
          const selectedTier = availableTiers.find(t => t.id === packageId);
          if (selectedTier) {
            // Check for special introductory offer overrides (e.g. '$150 first-time')
            // For now we use the base price, but specific logic could parse specialOffer strings
            total += selectedTier.price;
          }
        }
        // Vehicle Size Surcharge
        if (vehicleSize && vehicleSize in VEHICLE_PREMIUMS) {
          total += VEHICLE_PREMIUMS[vehicleSize as string];
        }
        // Add-ons
        if (addOns.length > 0 && availableAddOns.length > 0) {
          addOns.forEach(id => {
            const addon = availableAddOns.find(a => a.id === id);
            if (addon) {
              total += addon.price;
            }
          });
        }
        // Apply a global first-time discount if applicable (mock condition for now)
        // In a real app, we would check if the user is authenticated and has 0 previous bookings
        const applyDiscount = false; 
        if (applyDiscount) {
          total -= FIRST_TIME_DISCOUNT;
        }
        return Math.max(0, total);
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
    }),
    {
      name: 'booking-progress-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        step: state.step,
        vehicleSize: state.vehicleSize,
        packageId: state.packageId,
        addOns: state.addOns,
        dateTime: state.dateTime,
        contact: state.contact,
        confirmedBookingId: state.confirmedBookingId,
      }),
    }
  )
);