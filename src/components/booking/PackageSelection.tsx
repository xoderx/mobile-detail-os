import React from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronLeft, Star, ShieldCheck, Sparkles, Droplets } from 'lucide-react';
export function PackageSelection() {
  const setStep = useBookingStore(s => s.setStep);
  const setPackageId = useBookingStore(s => s.setPackageId);
  const availableTiers = useBookingStore(s => s.availableTiers);
  const getTierIcon = (id: string) => {
    if (id.includes('basic')) return <Droplets className="h-5 w-5 text-slate-400" />;
    if (id.includes('interior')) return <Star className="h-5 w-5 text-brand-400" />;
    if (id.includes('full')) return <Sparkles className="h-5 w-5 text-brand-500" />;
    if (id.includes('premium')) return <ShieldCheck className="h-5 w-5 text-indigo-500" />;
    return <CheckCircle2 className="h-5 w-5 text-brand-500" />;
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="-ml-2 font-black uppercase text-[10px] tracking-widest">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Choose Your Package</h2>
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Professional care tailored to your needs.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {availableTiers.map((pkg) => (
          <Card key={pkg.id} className={`relative flex flex-col transition-all duration-300 hover:shadow-xl group ${pkg.isPopular ? 'border-brand-500 ring-1 ring-brand-500 scale-105 z-10' : 'border-border'}`}>
            {pkg.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap shadow-lg animate-crackle">
                Best Value
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg font-black uppercase tracking-tight">{pkg.name}</CardTitle>
                <div className="text-2xl font-black text-brand-600">
                  {pkg.displayPrice || `$${pkg.price}`}
                </div>
                {pkg.specialOffer && (
                  <Badge className="bg-emerald-500 text-[9px] font-black uppercase tracking-widest h-5 px-2">
                    {pkg.specialOffer}
                  </Badge>
                )}
              </div>
              <div className="h-10 w-10 bg-muted/50 rounded-xl flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                {getTierIcon(pkg.id)}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 mt-4">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[11px] font-bold uppercase tracking-tight text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                onClick={() => setPackageId(pkg.id)}
                className={`w-full h-12 font-black uppercase tracking-widest text-[10px] ${pkg.isPopular ? 'bg-brand-500 hover:bg-brand-600' : 'border-2'}`}
                variant={pkg.isPopular ? 'default' : 'outline'}
              >
                Select {pkg.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-12 p-8 bg-brand-500/5 rounded-3xl border-2 border-brand-500/10 text-center">
        <h4 className="font-black text-brand-900 uppercase tracking-widest text-xs mb-1">Introductory Special</h4>
        <p className="text-xs text-brand-700 font-bold uppercase tracking-tight">Combine Engine Detail + Interior for just <span className="font-black">$125</span></p>
        <p className="text-[10px] text-brand-600/60 uppercase font-black tracking-[0.2em] mt-3 animate-shimmer">Limited Time Arctic Offer</p>
      </div>
    </div>
  );
}