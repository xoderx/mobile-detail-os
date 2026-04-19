import React, { useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, Clock, Info } from 'lucide-react';
import { addDays, format, isBefore, startOfToday } from 'date-fns';
import { WeatherBanner } from './WeatherBanner';
import { Alert, AlertDescription } from '@/components/ui/alert';
const timeSlots = [
  { id: 'morning', label: 'Morning', window: '8:00 AM - 12:00 PM', icon: '☀️' },
  { id: 'afternoon', label: 'Afternoon', window: '1:00 PM - 5:00 PM', icon: '🌤️' },
  { id: 'evening', label: 'Late Session', window: '5:30 PM - 8:30 PM', icon: '🌙' },
];
export function ScheduleStep() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const setStep = useBookingStore(s => s.setStep);
  const currentDateTime = useBookingStore(s => s.dateTime);
  const setDateTime = useBookingStore(s => s.setDateTime);
  const handleContinue = () => {
    if (selectedDate && selectedSlot) {
      const combined = new Date(selectedDate);
      // We just store a descriptive string or a mocked time for now
      setDateTime(combined.toISOString());
      setStep(5);
    }
  };
  const isDayDisabled = (date: Date) => {
    return isBefore(date, startOfToday()) || date > addDays(new Date(), 30);
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(3)} className="-ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Add-ons
        </Button>
      </div>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Pick a Time</h2>
        <p className="text-muted-foreground mt-2">When should we arrive to transform your vehicle?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Date</label>
          <div className="p-4 border rounded-xl bg-card shadow-sm inline-block w-full">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDayDisabled}
              className="rounded-md mx-auto"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="mb-4 h-24">
            {selectedDate && (
              <WeatherBanner date={selectedDate.toISOString()} />
            )}
          </div>
          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select Arrival Window</label>
          <div className="space-y-3">
            {!selectedDate ? (
              <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
                Please select a date first
              </div>
            ) : (
              timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${selectedSlot === slot.id ? 'border-brand-500 bg-brand-50/50 shadow-md' : 'border-border hover:border-brand-200 bg-background'}`}
                >
                  <div className="text-2xl">{slot.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold">{slot.label}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> {slot.window}
                    </div>
                  </div>
                  {selectedSlot === slot.id && (
                    <div className="h-2 w-2 rounded-full bg-brand-500" />
                  )}
                </button>
              ))
            )}
          </div>
          {selectedDate && (
            <Alert className="bg-brand-50 border-brand-200">
              <Info className="h-4 w-4 text-brand-600" />
              <AlertDescription className="text-xs text-brand-700">
                We'll call 30 minutes before arrival on {format(selectedDate, 'PPP')}.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
      <div className="pt-8 flex justify-end">
        <Button 
          size="lg" 
          disabled={!selectedDate || !selectedSlot}
          onClick={handleContinue} 
          className="bg-brand-600 hover:bg-brand-700 h-12 px-8 font-bold disabled:opacity-50"
        >
          Contact Details
        </Button>
      </div>
    </div>
  );
}