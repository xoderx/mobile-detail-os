import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBookingStore } from '@/store/booking-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Loader2, Lock, CreditCard, ShieldCheck, ShieldAlert } from 'lucide-react';
import { api } from '@/lib/api-client';
const contactSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(10, 'Complete service address required'),
});
type ContactValues = z.infer<typeof contactSchema>;
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const setStep = useBookingStore(s => s.setStep);
  const setContact = useBookingStore(s => s.setContact);
  const vehicleSize = useBookingStore(s => s.vehicleSize);
  const packageId = useBookingStore(s => s.packageId);
  const addOns = useBookingStore(s => s.addOns);
  const dateTime = useBookingStore(s => s.dateTime);
  const setConfirmedBookingId = useBookingStore(s => s.setConfirmedBookingId);
  const getTotalPrice = useBookingStore(s => s.getTotalPrice);
  const totalPrice = getTotalPrice();
  const user = useAuthStore(s => s.user);
  useEffect(() => {
    const SCRIPT_ID = 'cf-turnstile-script';
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
    (window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };
    return () => {
      delete (window as any).onTurnstileSuccess;
    };
  }, []);
  const { register, handleSubmit, formState: { errors } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: useBookingStore.getState().contact
  });
  const onSubmit = async (data: ContactValues) => {
    if (!turnstileToken) return;
    setIsSubmitting(true);
    try {
      await api('/api/auth/verify-turnstile', {
        method: 'POST',
        body: JSON.stringify({ token: turnstileToken })
      });
      setContact(data);
      setIsRedirecting(true);
      await api('/api/payments/create-session', { method: 'POST' });
      await new Promise(r => setTimeout(r, 1500));
      const response = await api<any>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          customerId: user?.id || 'guest-client',
          vehicleSize,
          packageId,
          addOns,
          dateTime,
          contact: data,
          totalPrice,
          turnstileToken
        })
      });
      if (response && response.id) {
        setConfirmedBookingId(response.id);
      }
      setStep(6);
    } catch (error) {
      setIsRedirecting(false);
      console.error('Booking submission failed:', error);
      if ((window as any).turnstile) {
        try {
          (window as any).turnstile.reset();
        } catch (e) {
          console.warn('Turnstile reset failed', e);
        }
        setTurnstileToken(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
    {isRedirecting && (
      <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center space-y-6 max-w-sm px-4">
          <div className="h-20 w-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto border-2 border-brand-200">
             <Loader2 className="h-10 w-10 text-brand-600 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Secure Checkout</h3>
            <p className="text-muted-foreground text-sm">Verifying session and connecting to Stripe...</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest"><ShieldCheck className="h-4 w-4" /> PCI Compliant</div>
        </div>
      </div>
    )}
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(4)} className="-ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Schedule
        </Button>
      </div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Final Details</h2>
        <p className="text-muted-foreground mt-2">Please provide your service location and contact information.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="John" {...register('firstName')} className={errors.firstName ? 'border-destructive' : ''} />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" {...register('lastName')} className={errors.lastName ? 'border-destructive' : ''} />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="john@example.com" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="(555) 000-0000" {...register('phone')} className={errors.phone ? 'border-destructive' : ''} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Service Address</Label>
          <Input id="address" placeholder="123 Detail St, Suite 400" {...register('address')} className={errors.address ? 'border-destructive' : ''} />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>
        <div className="py-2">
          <div
            ref={turnstileRef}
            className="cf-turnstile"
            data-sitekey="1x00000000000000000000AA"
            data-callback="onTurnstileSuccess"
          ></div>
          {!turnstileToken && (
            <p className="text-[10px] text-amber-600 mt-2 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> Security verification required to proceed
            </p>
          )}
        </div>
        <div className="mt-4 p-6 bg-brand-50 rounded-2xl border border-brand-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-brand-600" />
              <span className="font-bold text-sm">Deposit Summary</span>
            </div>
            <Badge className="bg-brand-500">Stripe Secure</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Total</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-700 font-bold border-t pt-2">
              <span>Required Deposit</span>
              <span>$20.00</span>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center">
            <Lock className="h-3 w-3" /> Encrypted connection. Your data is protected.
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !turnstileToken}
            className="w-full bg-brand-600 hover:bg-brand-700 h-14 text-lg font-bold shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm & Pay Deposit'
            )}
          </Button>
        </div>
      </form>
    </div>
    </>
  );
}