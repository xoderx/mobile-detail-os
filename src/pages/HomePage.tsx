import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Star,
  Shield,
  Zap,
  CheckCircle2,
  Menu,
  SprayCan,
  CarFront,
  ShieldCheck,
  Users,
  Award,
  MapPin,
  Loader2,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { AppConfig } from '@shared/types';
export function HomePage() {
  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: () => api<AppConfig>('/api/cms/config'),
  });
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">D</div>
          <span className="text-xl font-bold tracking-tight">{config?.siteTitle || 'DetailFlow'}</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium hover:text-brand-500 transition-colors">Services</a>
          <a href="#about" className="text-sm font-medium hover:text-brand-500 transition-colors">About</a>
          <Button asChild className="bg-brand-500 hover:bg-brand-600">
            <Link to="/booking">Book Now</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <SheetClose asChild>
                <a href="#services" className="text-lg font-medium py-2">Services</a>
              </SheetClose>
              <SheetClose asChild>
                <a href="#about" className="text-lg font-medium py-2">About</a>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link to="/booking">Book Now</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-brand-50/50 dark:bg-brand-950/10 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold mb-8 animate-fade-in">
            <Star className="h-3 w-3 fill-current" />
            <span>NATIONWIDE PREMIUM SERVICE</span>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-brand-500 mb-4" />
              <p className="text-muted-foreground animate-pulse">Loading showroom experience...</p>
            </div>
          ) : (
            <>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
                {config?.heroTitle.split(' ').slice(0, -2).join(' ')} <br />
                <span className="text-brand-500">{config?.heroTitle.split(' ').slice(-2).join(' ')}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
                {config?.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="h-12 px-8 bg-brand-500 hover:bg-brand-600 text-lg">
                  <Link to="/booking">Book Your Detail <ChevronRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg" asChild>
                  <a href="#services">View Our Packages</a>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">Expert Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Precision detailing tailored to your vehicle's needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: SprayCan, title: "Exterior Polish", desc: "Flawless paint correction and ceramic coatings." },
              { icon: CarFront, title: "Interior Sanctuary", desc: "Deep cleaning and leather restoration." },
              { icon: ShieldCheck, title: "Ultimate Protection", desc: "Advanced shielding against elements." }
            ].map((s, i) => (
              <div key={i} className="group hover:shadow-xl transition-all border rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <s.icon className="h-8 w-8 text-brand-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="about" className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">About Us</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {config?.aboutText || "Bringing high-end detailing to your driveway with precision and passion."}
          </p>
        </div>
      </section>
      <footer className="py-12 border-t text-center text-muted-foreground text-sm">
        <p>&copy; 2024 {config?.siteTitle || 'DetailFlow OS'}. All rights reserved.</p>
      </footer>
    </div>
  );
}