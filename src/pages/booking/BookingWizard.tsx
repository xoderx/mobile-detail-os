import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useBookingStore } from '@/store/booking-store';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Car, Package, PlusCircle, Calendar as CalendarIcon, User, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PackageSelection } from '@/components/booking/PackageSelection';
import { AddOnSelection } from '@/components/booking/AddOnSelection';
import { ScheduleStep } from '@/components/booking/ScheduleStep';
import { ContactForm } from '@/components/booking/ContactForm';
import { SuccessStep } from '@/components/booking/SuccessStep';
import type { VehicleSize } from '@shared/types';
export function BookingWizard() {
  const step = useBookingStore(s => s.step);
  const vehicleSize = useBookingStore(s => s.vehicleSize);
  const packageId = useBookingStore(s => s.packageId);
  const dateTime = useBookingStore(s => s.dateTime);
  const getTotalPrice = useBookingStore(s => s.getTotalPrice);
  const setCatalog = useBookingStore(s => s.setCatalog);
  const setVehicleSize = useBookingStore(s => s.setVehicleSize);
  const { data: tiers, isLoading: tiersLoading } = useQuery({
    queryKey: ['cms-services'],
    queryFn: () => api<{ items: any[] }>('/api/cms/services'),
  });
  const { data: addons, isLoading: addonsLoading } = useQuery({
    queryKey: ['cms-addons'],
    queryFn: () => api<{ items: any[] }>('/api/cms/addons'),
  });
  useEffect(() => {
    if (tiers?.items && addons?.items) {
      setCatalog(tiers.items, addons.items);
    }
  }, [tiers, addons, setCatalog]);
  const progress = (step / 5) * 100;
  const steps = [
    { id: 1, name: 'Vehicle', icon: Car },
    { id: 2, name: 'Service', icon: Package },
    { id: 3, name: 'Add-ons', icon: PlusCircle },
    { id: 4, name: 'Schedule', icon: CalendarIcon },
    { id: 5, name: 'Details', icon: User },
  ];
  if (tiersLoading || addonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600 mx-auto" />
          <p className="text-sm font-bold text-muted-foreground">Initializing Booking Engine...</p>
        </div>
      </div>
    );
  }
  if (step === 6) return <SuccessStep />;
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="text-sm font-medium flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Step {step} of 5
          </div>
        </div>
        <div className="mb-12">
          <Progress value={progress} className="h-2 bg-white" />
          <div className="mt-6 hidden sm:flex justify-between">
            {steps.map((s) => (
              <div key={s.id} className={`flex flex-col items-center gap-2 ${step >= s.id ? 'text-brand-600' : 'text-muted-foreground'}`}>
                <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all ${step >= s.id ? 'bg-brand-50 border-brand-500 shadow-sm' : 'bg-background border-border'}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="bg-background rounded-2xl border shadow-sm p-6 md:p-10 min-h-[500px] overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-bold tracking-tight">Select Vehicle Size</h2>
                      <p className="text-muted-foreground mt-2">Accurate pricing begins with your vehicle category.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'sedan', label: 'Sedan', desc: 'Coupes, small sedans', icon: '🚗' },
                        { id: 'suv', label: 'SUV', desc: 'Compact to mid-size', icon: '🚙' },
                        { id: 'truck', label: 'Truck/Large', desc: 'Pickups, 3-row SUVs', icon: '🚛' },
                        { id: 'luxury', label: 'Exotic', desc: 'Sports cars, high-end', icon: '🏎️' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setVehicleSize(item.id as VehicleSize)}
                          className={`p-6 rounded-xl border-2 text-left transition-all relative ${vehicleSize === item.id ? 'border-brand-500 bg-brand-50/30 shadow-md ring-1 ring-brand-500' : 'border-border hover:border-brand-200'}`}
                        >
                          <div className="text-3xl mb-4">{item.icon}</div>
                          <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                          {vehicleSize === item.id && (
                            <div className="absolute top-4 right-4 text-brand-500">
                              <CheckCircle2 className="h-6 w-6" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <PackageSelection />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <AddOnSelection />
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <ScheduleStep />
                  </motion.div>
                )}
                {step === 5 && (
                  <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <ContactForm />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-background rounded-2xl border shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 border-b pb-2">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium capitalize">{vehicleSize || '---'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium capitalize">{packageId || '---'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{dateTime ? new Date(dateTime).toLocaleDateString() : '---'}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Estimated Total</span>
                    <span className="text-xl font-bold text-brand-600">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Final price confirmed upon arrival.</p>
                </div>
              </div>
            </div>
            <div className="bg-brand-600 rounded-2xl p-6 text-white shadow-lg">
              <h4 className="font-bold mb-2">Support Assistance</h4>
              <p className="text-sm text-brand-100 mb-4">Text us for custom quotes or exotic vehicle inquiries.</p>
              <Button variant="secondary" className="w-full text-brand-600 font-bold">
                (555) 123-4567
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}