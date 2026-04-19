import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/booking-store';
export function SuccessStep() {
  const navigate = useNavigate();
  const reset = useBookingStore(s => s.reset);
  const confirmedBookingId = useBookingStore(s => s.confirmedBookingId);
  const displayId = confirmedBookingId 
    ? confirmedBookingId.split('-')[0].toUpperCase() 
    : Math.random().toString(36).substring(2, 9).toUpperCase();
  const handleReturnHome = () => {
    reset();
    navigate('/');
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-background rounded-3xl border shadow-xl p-8 text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          className="mx-auto h-20 w-20 bg-brand-100 rounded-full flex items-center justify-center text-brand-600"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Booking Confirmed!</h2>
          <p className="text-muted-foreground text-pretty">
            Your vehicle is scheduled for rejuvenation. A detailed confirmation has been sent to your email.
          </p>
        </div>
        <div className="bg-muted/50 rounded-2xl p-4 border border-dashed border-muted-foreground/20">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Confirmation ID</span>
          <div className="text-2xl font-mono font-bold text-brand-600">#{displayId}</div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Button onClick={handleReturnHome} className="w-full bg-brand-600 hover:bg-brand-700 h-12">
            <Home className="mr-2 h-4 w-4" /> Return to Home
          </Button>
          <Button variant="outline" className="w-full h-12" onClick={() => window.print()}>
            <Calendar className="mr-2 h-4 w-4" /> Print Confirmation
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Need to reschedule? Contact us at (555) 123-4567 with your ID.
        </p>
      </motion.div>
    </div>
  );
}