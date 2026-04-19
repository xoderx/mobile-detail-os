import React from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
const packages = [
  {
    id: 'basic',
    name: 'Essential Wash',
    price: '$89',
    features: ['Hand Wash & Dry', 'Tire Dressing', 'Interior Vacuum', 'Interior Wipe Down', 'Window Cleaning'],
    popular: false
  },
  {
    id: 'premium',
    name: 'Signature Detail',
    price: '$149',
    features: ['Essential Wash Plus', 'Clay Bar Treatment', 'Synthetic Wax Polish', 'Deep Carpet Shampoo', 'Steam Cleaning'],
    popular: true
  },
  {
    id: 'ceramic',
    name: 'Ceramic Guard',
    price: '$299',
    features: ['Signature Detail Plus', '12-Month Ceramic Seal', 'Iron Decontamination', 'Paint Enhancement', 'Wheel Barrel Deep Clean'],
    popular: false
  }
];
export function PackageSelection() {
  const setStep = useBookingStore(s => s.setStep);
  const setPackageId = useBookingStore(s => s.setPackageId);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="-ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold">Choose Your Package</h2>
        <p className="text-muted-foreground">Professional care tailored to your needs.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`relative flex flex-col transition-all duration-300 hover:shadow-xl ${pkg.popular ? 'border-brand-500 ring-1 ring-brand-500 scale-105' : 'border-border'}`}>
            {pkg.id === 'ceramic' ? (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                Ceramic Protection Included
              </div>
            ) : pkg.id === 'basic' ? (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                Best Value
              </div>
            ) : pkg.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
              <div className="text-3xl font-bold mt-2">{pkg.price}</div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setPackageId(pkg.id)}
                className={`w-full ${pkg.popular ? 'bg-brand-500 hover:bg-brand-600' : ''}`}
                variant={pkg.popular ? 'default' : 'outline'}
              >
                Select {pkg.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-12 p-6 bg-brand-50 rounded-2xl border border-brand-100 text-center">
        <h4 className="font-bold text-brand-900 mb-1">Frequently Bought Together</h4>
        <p className="text-xs text-brand-700 mb-3">Add Engine Detail + Odor Bomb for just <span className="font-bold">$65</span> (Save $9)</p>
        <p className="text-[10px] text-brand-600/60 uppercase font-bold tracking-wider italic">Smart Suggestion</p>
      </div>
    </div>
  );
}