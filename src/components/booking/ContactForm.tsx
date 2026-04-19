import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Loader2, Lock } from 'lucide-react';
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
  const setStep = useBookingStore(s => s.setStep);
  const setContact = useBookingStore(s => s.setContact);
  // Get current state for submission
  const vehicleSize = useBookingStore(s => s.vehicleSize);
  const packageId = useBookingStore(s => s.packageId);
  const addOns = useBookingStore(s => s.addOns);
  const dateTime = useBookingStore(s => s.dateTime);
  const { register, handleSubmit, formState: { errors } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: useBookingStore.getState().contact
  });
  const onSubmit = async (data: ContactValues) => {
    setIsSubmitting(true);
    try {
      setContact(data);
      // Simulate real submission
      await api('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          customerId: 'c1', // Mocked for now
          vehicleSize,
          packageId,
          addOns,
          dateTime,
          contact: data
        })
      });
      // Move to success step (6)
      setStep(6);
    } catch (error) {
      console.error('Submission failed', error);
      // In a real app we would show a toast error
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(4)} className="-ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Schedule
        </Button>
      </div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Your Information</h2>
        <p className="text-muted-foreground mt-2">Where and who should we look for?</p>
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
          <Input id="phone" type="tel" placeholder="(555) 000-0000" {...register('phone')} className={errors.phone ? 'border-destructive' : ''} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Service Address</Label>
          <Input id="address" placeholder="123 Detail St, Clean City, ST 12345" {...register('address')} className={errors.address ? 'border-destructive' : ''} />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>
        <div className="pt-6 border-t flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <Lock className="h-3 w-3" /> Secure booking. No payment taken now.
          </div>
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-700 h-14 text-lg font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Booking...
              </>
            ) : (
              'Complete Booking'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}