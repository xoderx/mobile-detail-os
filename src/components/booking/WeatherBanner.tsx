import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Sun, CloudRain, Wind, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
interface WeatherBannerProps {
  date: string | null;
}
export function WeatherBanner({ date }: WeatherBannerProps) {
  const { data: weatherData } = useQuery({
    queryKey: ['weather'],
    queryFn: () => api<any[]>('/api/weather'),
  });
  if (!date) return null;
  const selectedDateStr = format(new Date(date), 'yyyy-MM-dd');
  const forecast = weatherData?.find((f) => f.date === selectedDateStr);
  if (!forecast) return null;
  const isRainy = forecast.condition.toLowerCase().includes('rain');
  return (
    <div className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all animate-fade-in ${isRainy ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isRainy ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
        {isRainy ? <CloudRain className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">
            {isRainy ? 'Weather Alert' : 'Optimal Detailing Window'}
          </span>
          {isRainy ? <AlertCircle className="h-3 w-3 text-amber-600" /> : <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
        </div>
        <p className="text-xs text-muted-foreground">
          {isRainy 
            ? 'Rain is forecast. We recommend moving to a covered area or rescheduling.' 
            : 'Sunny skies ahead! Perfect for paint decontamination and curing.'}
        </p>
      </div>
      <div className="text-right hidden sm:block">
        <div className="text-lg font-bold">{forecast.temp}°F</div>
        <div className="text-[10px] uppercase font-bold tracking-tighter opacity-60">Forecast</div>
      </div>
    </div>
  );
}