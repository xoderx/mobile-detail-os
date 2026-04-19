import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronLeft, Snowflake, Star, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';
import { BRAND_NAME } from '@/lib/constants';
export function PricingPage() {
  const { data: tiers, isLoading: tiersLoading } = useQuery({
    queryKey: ['pricing-tiers'],
    queryFn: () => api<{ items: any[] }>('/api/cms/services'),
  });
  const { data: addons, isLoading: addonsLoading } = useQuery({
    queryKey: ['pricing-addons'],
    queryFn: () => api<{ items: any[] }>('/api/cms/addons'),
  });
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <span className="text-sm font-black tracking-tighter uppercase">{BRAND_NAME}</span>
        </Link>
        <Button asChild variant="ghost" size="sm" className="font-black uppercase text-[10px] tracking-widest">
          <Link to="/">Back to Base</Link>
        </Button>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase font-black tracking-widest py-1 px-4">
              Arctic Yield Map
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-shimmer">
              System Pricing
            </h1>
            <p className="text-muted-foreground font-black uppercase text-xs tracking-widest leading-loose opacity-70">
              Select your performance tier. All services performed on-site by certified arctic technicians.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tiersLoading ? (
               Array.from({ length: 4 }).map((_, i) => (
                 <div key={i} className="h-[500px] bg-muted animate-pulse rounded-[3rem]" />
               ))
            ) : tiers?.items.map((pkg) => (
              <Card key={pkg.id} className={`relative flex flex-col border-2 rounded-[3rem] transition-all duration-500 hover:shadow-2xl overflow-hidden ${pkg.isPopular ? 'border-primary ring-2 ring-primary/10 scale-105 z-10 bg-primary/[0.02]' : 'border-border/50'}`}>
                {pkg.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl">
                    Command Choice
                  </div>
                )}
                <CardHeader className="p-8 text-center border-b border-border/40">
                  <CardTitle className="text-2xl font-black uppercase tracking-tight mb-2">{pkg.name}</CardTitle>
                  <div className="text-4xl font-black text-primary">${pkg.price}</div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">{pkg.displayPrice || 'Flat Rate'}</p>
                </CardHeader>
                <CardContent className="flex-1 p-8">
                  <ul className="space-y-4">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[11px] font-black uppercase tracking-tight text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button asChild className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs ${pkg.isPopular ? 'bg-primary' : 'variant-outline'}`} variant={pkg.isPopular ? 'default' : 'outline'}>
                    <Link to="/booking">Select {pkg.name}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center justify-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                Arctic Enhancements
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {addons?.items.map((item) => (
                <div key={item.id} className="glass-ice p-8 rounded-[2rem] border-2 border-primary/5 hover:border-primary/20 transition-all">
                  <h3 className="font-black uppercase tracking-widest text-xs mb-2">{item.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight mb-4">{item.description}</p>
                  <div className="text-lg font-black text-primary">+${item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="py-24 bg-muted/30 border-t-2 border-border/50 text-center">
        <h4 className="text-xl font-black uppercase tracking-tighter mb-8">Ready for the Stone Cold finish?</h4>
        <Button asChild size="lg" className="h-20 px-12 text-xl font-black uppercase tracking-[0.2em] bg-metallic rounded-3xl">
          <Link to="/booking">Initialize Detailing</Link>
        </Button>
      </div>
    </div>
  );
}