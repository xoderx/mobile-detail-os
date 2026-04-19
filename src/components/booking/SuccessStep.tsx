import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Home, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/booking-store';
import { toast } from 'sonner';
export function SuccessStep() {
  const navigate = useNavigate();
  const reset = useBookingStore(s => s.reset);
  const confirmedBookingId = useBookingStore(s => s.confirmedBookingId);
  const [copied, setCopied] = React.useState(false);
  const displayId = confirmedBookingId
    ? confirmedBookingId.split('-')[0].toUpperCase()
    : "ST-XXXXX";
  const handleReturnHome = () => {
    reset();
    navigate('/');
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(displayId);
    setCopied(true);
    toast.success("Reference ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
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
          className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase text-shimmer">Booking Secured</h2>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-tight">
            Your vehicle is scheduled for rejuvenation. A detailed confirmation has been dispatched to your email.
          </p>
        </div>
        <div className="bg-muted/50 rounded-2xl p-6 border-2 border-dashed border-primary/20 relative group">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Reservation Reference</span>
          <div className="text-3xl font-mono font-black text-primary">#{displayId}</div>
          <button 
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 rounded-lg bg-background border hover:bg-muted transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 pt-4">
          <Button onClick={handleReturnHome} className="w-full bg-primary hover:bg-primary/90 h-14 font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-primary/20">
            <Home className="mr-2 h-4 w-4" /> Finalize & Return Home
          </Button>
          <Button variant="outline" className="w-full h-14 font-black uppercase tracking-widest text-xs border-2 rounded-xl" onClick={() => window.print()}>
            <Calendar className="mr-2 h-4 w-4" /> Print Manifest
          </Button>
        </div>
        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">
          Need to reschedule? Contact System Control at (555) 123-4567.
        </p>
      </motion.div>
    </div>
  );
}