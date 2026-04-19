import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  ChevronRight, Star, SprayCan, CarFront, ShieldCheck,
  Menu, Award, MapPin, Loader2, Sparkles, Heart, User
} from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { AppConfig } from '@shared/types';
const IconMap: Record<string, any> = {
  SprayCan, CarFront, ShieldCheck, Award, MapPin, Sparkles, Heart, Star
};
export function HomePage() {
  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: () => api<AppConfig>('/api/cms/config'),
  });
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const userRole = useAuthStore(s => s.user?.role);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);
  const themeStyle = {
    '--primary-brand': config?.brandTheme?.primaryColor || '#0ea5e9',
    '--gradient-start': config?.brandTheme?.gradientStart || '#0ea5e9',
    '--gradient-end': config?.brandTheme?.gradientEnd || '#0284c7',
  } as React.CSSProperties;
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-brand-500 mb-4" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading Experience...</p>
      </div>
    );
  }
  const portalPath = userRole === 'admin' ? '/admin' : userRole === 'tech' ? '/tech' : '/my-bookings';
  return (
    <div className="min-h-screen bg-background" style={themeStyle}>
      <ThemeToggle />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--primary-brand)' }}>D</div>
          <span className="text-xl font-bold tracking-tight">{config?.siteTitle}</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium hover:text-brand-500 transition-colors">Services</a>
          <a href="#reviews" className="text-sm font-medium hover:text-brand-500 transition-colors">Reviews</a>
          {isAuthenticated ? (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to={portalPath}><User className="h-4 w-4" /> My Account</Link>
            </Button>
          ) : (
            <Link to="/login" className="text-sm font-medium hover:text-brand-500 transition-colors">Login</Link>
          )}
          <Button asChild className="bg-brand-500 hover:bg-brand-600 shadow-md" style={{ backgroundColor: 'var(--primary-brand)' }}>
            <Link to="/booking">{config?.ctaText || 'Book Now'}</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader><SheetTitle>Navigation</SheetTitle></SheetHeader>
            <div className="grid gap-4 py-4">
              <SheetClose asChild><a href="#services" className="text-lg font-medium py-2">Services</a></SheetClose>
              <SheetClose asChild><a href="#reviews" className="text-lg font-medium py-2">Reviews</a></SheetClose>
              {isAuthenticated ? (
                <SheetClose asChild><Link to={portalPath} className="text-lg font-medium py-2 flex items-center gap-2 text-brand-600"><User className="h-5 w-5" /> Account Dashboard</Link></SheetClose>
              ) : (
                <SheetClose asChild><Link to="/login" className="text-lg font-medium py-2">Login</Link></SheetClose>
              )}
              <SheetClose asChild>
                <Button asChild className="w-full mt-4" style={{ backgroundColor: 'var(--primary-brand)' }}>
                  <Link to="/booking">{config?.ctaText || 'Book Now'}</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      <section className="relative py-20 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-brand-50/50 dark:bg-brand-950/10 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold mb-8 animate-fade-in shadow-sm border">
            <Star className="h-3 w-3 fill-current text-amber-500" />
            <span>PREMIUM AUTO CARE ON DEMAND</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold text-foreground mb-6 tracking-tight leading-[1.05]">
            {config?.heroTitle.split(' ').slice(0, -2).join(' ')} <br />
            <span className="text-brand-500" style={{ color: 'var(--primary-brand)' }}>{config?.heroTitle.split(' ').slice(-2).join(' ')}</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
            {config?.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-10 text-xl font-bold shadow-xl hover:scale-105 transition-transform" style={{ background: `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))` }}>
              <Link to="/booking">{config?.ctaText} <ChevronRight className="ml-2 h-6 w-6" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-10 text-xl" asChild>
              <a href="#services">Explore Packages</a>
            </Button>
          </div>
        </div>
      </section>
      <section id="services" className="py-32 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Expert care for every surface of your vehicle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config?.features.map((s, i) => {
              const Icon = IconMap[s.iconName] || SprayCan;
              return (
                <div key={i} className="group hover:shadow-2xl transition-all border-2 rounded-3xl p-10 text-center bg-background hover:-translate-y-2">
                  <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-10 w-10 text-brand-500 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <footer className="py-16 border-t text-center space-y-4">
        <div className="font-bold text-2xl tracking-tighter" style={{ color: 'var(--primary-brand)' }}>{config?.siteTitle}</div>
        <p className="text-muted-foreground text-sm">&copy; 2024 {config?.siteTitle}. Precision & Excellence.</p>
      </footer>
    </div>
  );
}