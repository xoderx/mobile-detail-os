import React from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
export function AddOnSelection() {
  const selectedAddOns = useBookingStore(s => s.addOns);
  const toggleAddOn = useBookingStore(s => s.toggleAddOn);
  const setStep = useBookingStore(s => s.setStep);
  const availableAddOns = useBookingStore(s => s.availableAddOns);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="-ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Packages
        </Button>
      </div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Boost Your Detail</h2>
        <p className="text-muted-foreground mt-2">Select optional upgrades for that extra showroom shine.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableAddOns.map((item) => {
          const isSelected = selectedAddOns.includes(item.id);
          return (
            <Card
              key={item.id}
              onClick={() => toggleAddOn(item.id)}
              className={`cursor-pointer transition-all border-2 ${isSelected ? 'border-brand-500 bg-brand-50/30' : 'hover:border-brand-200'}`}
            >
              <CardContent className="p-5 flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  <div className="text-sm font-bold text-brand-600 mt-2">+${item.price}</div>
                </div>
                <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-500 border-brand-500' : 'border-border'}`}>
                  {isSelected ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="pt-10 flex justify-end">
        <Button size="lg" onClick={() => setStep(4)} className="bg-brand-600 hover:bg-brand-700 h-12 px-8 font-bold">
          Continue to Schedule
        </Button>
      </div>
    </div>
  );
}