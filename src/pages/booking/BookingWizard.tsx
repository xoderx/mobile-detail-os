import React from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ArrowRight, Car, Package, Calendar as CalendarIcon, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageSelection } from '@/components/booking/PackageSelection';
import { Link } from 'react-router-dom';
export function BookingWizard() {
  const step = useBookingStore(s => s.step);
  const setStep = useBookingStore(s => s.setStep);
  const vehicleSize = useBookingStore(s => s.vehicleSize);
  const setVehicleSize = useBookingStore(s => s.setVehicleSize);
  const progress = (step / 5) * 100;
  const steps = [
    { id: 1, name: 'Vehicle', icon: Car },
    { id: 2, name: 'Service', icon: Package },
    { id: 3, name: 'Add-ons', icon: ArrowRight },
    { id: 4, name: 'Schedule', icon: CalendarIcon },
    { id: 5, name: 'Details', icon: User },
  ];
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="text-sm font-medium flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="text-sm font-bold text-brand-600">Step {step} of 5</div>
        </div>
        <div className="mb-12">
          <Progress value={progress} className="h-2" />
          <div className="mt-4 hidden sm:flex justify-between">
            {steps.map((s) => (
              <div key={s.id} className={`flex flex-col items-center gap-2 ${step >= s.id ? 'text-brand-600' : 'text-muted-foreground'}`}>
                <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${step >= s.id ? 'bg-brand-50 border-brand-200' : 'bg-background'}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-background rounded-2xl border shadow-soft p-6 md:p-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">Select Vehicle Size</h2>
                  <p className="text-muted-foreground">Choose the category that best fits your vehicle.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'sedan', label: 'Sedan', desc: 'Coupes, small sedans' },
                    { id: 'suv', label: 'SUV', desc: 'Compact to mid-size' },
                    { id: 'truck', label: 'Truck/Large', desc: 'Pickups, 3-row SUVs' },
                    { id: 'luxury', label: 'Exotic', desc: 'Sports cars, collectibles' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setVehicleSize(item.id as any)}
                      className={`p-6 rounded-xl border-2 text-left transition-all hover:border-brand-300 ${vehicleSize === item.id ? 'border-brand-500 bg-brand-50/30 shadow-md' : 'border-border'}`}
                    >
                      <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PackageSelection />
              </motion.div>
            )}
            {step > 2 && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <h3 className="text-xl font-bold mb-2">Almost there!</h3>
                <p className="text-muted-foreground">The rest of the wizard is being finalized.</p>
                <Button variant="link" onClick={() => setStep(1)} className="mt-4">Start Over</Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}