import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  ChevronRight, Star, SprayCan, CarFront, ShieldCheck,
  Menu, Award, MapPin, Sparkles, Heart, User
} from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';

const IconMap: Record<string, any> = {
  SprayCan, CarFront, ShieldCheck, Award, MapPin, Sparkles, Heart, Star
};
export function HomePage() {
  
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const userRole = useAuthStore(s => s.user?.role);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);
  const themeStyle = {
    '--primary-brand': '#0ea5e9',
    '--gradient-start': '#0ea5e9',
    '--gradient-end': '#0284c7',
  } as React.CSSProperties;
  
  const portalPath = userRole === 'admin' ? '/admin' : userRole === 'tech' ? '/tech' : '/my-bookings';
  return (
    <div className="min-h-screen bg-background" style={themeStyle}>
      <ThemeToggle />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--primary-brand)' }}>DX</div>
          <span className="text-xl font-bold tracking-tight">Detail Deluxe</span>
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
            <Link to="/booking">Book Now</Link>
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
                  <Link to="/booking">Book Now</Link>
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
            <span>LUXURY AUTO CARE REIMAGINED</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold text-foreground mb-6 tracking-tight leading-[1.05]">
            Showroom Quality Car Detailing <br />
            <span className="text-brand-500" style={{ color: 'var(--primary-brand)' }}>at your doorstep.</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
            Experience the ultimate in mobile automotive rejuvenation with Detail Deluxe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-10 text-xl font-bold shadow-xl hover:scale-105 transition-transform" style={{ background: `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))` }}>
              <Link to="/booking">Book Now <ChevronRight className="ml-2 h-6 w-6" /></Link>
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
            {[
              { iconName: 'SprayCan', title: 'Premium Exterior', description: 'Hand wash, clay bar, polish, wax & sealant protection' },
              { iconName: 'CarFront', title: 'Interior Deep Clean', description: 'Vacuum, steam clean, leather conditioning & odor elimination' },
              { iconName: 'ShieldCheck', title: 'Complete Detail', description: 'Full exterior + interior with ceramic coating option' },
              { iconName: 'Award', title: 'Luxury Package', description: 'Paint correction, interior restoration & premium protection' },
              { iconName: 'Sparkles', title: 'Subscription', description: 'Monthly maintenance plans with priority scheduling' },
              { iconName: 'MapPin', title: 'Mobile Service', description: 'We come to you - home, office or anywhere convenient' }
            ].map((s, i) => {
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
      <footer className="py-16 bg-slate-900/10 border-t text-center space-y-8">
        <div className="font-bold text-4xl tracking-tighter uppercase" style={{ color: 'var(--primary-brand)' }}>Detail Deluxe</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm max-w-4xl mx-auto">
          <div>
            <h4 className="font-bold mb-4 text-foreground">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#services" className="hover:text-brand-500 transition-colors">Premium Detail</a></li>
              <li><a href="#services" className="hover:text-brand-500 transition-colors">Interior Clean</a></li>
              <li><a href="#services" className="hover:text-brand-500 transition-colors">Subscriptions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-brand-500 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Team</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-foreground">Book Now</h4>
            <div className="space-y-2">
              <Link to="/booking" className="block hover:text-brand-500 transition-colors font-medium">Start Booking</Link>
              <Link to="/login" className="block hover:text-brand-500 transition-colors">Customer Portal</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-foreground">Contact</h4>
            <p className="text-muted-foreground mb-4">We come to you anywhere</p>
            <div className="flex justify-center space-x-4 text-2xl text-brand-500">
              <a href="#" className="hover:scale-110 transition-transform"><Heart className="h-5 w-5" /></a>
              <a href="#" className="hover:scale-110 transition-transform"><Star className="h-5 w-5" /></a>
              <a href="#" className="hover:scale-110 transition-transform"><Award className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm border-t pt-8">&copy; 2025 Detail Deluxe. All rights reserved.</p>
      </footer>
    </div>
  );
}