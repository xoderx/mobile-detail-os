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
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABNmlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjarY7NDkBAFIWnL6UoWfFndm7szm9jY2f9XIsomfU6Oje85fSce78AIEZTo8HWBGfFzPImRkdXV6pG9AByDAm50rUe1yV8FshWAsmYq9v1U2A2mD8tYFpZ/6y/668pXUv6LNAshZJx67vAaiB/XMC0sv6OvxPshSREvGReSjr6vAtshLREvGRedLzI95AdEJYIH5kvOT/kfMhOxEvGRS5X6M6M+AaxH8IKscAUEC30L6I/hBXigYknWuhfRH8IK8QDE0+00L+I/hBWiwZ6p+u8AOKF/UX0h7BOPLD3RAv9S+9A+vK76H5X96B7L3XvX+X65f6N7o8Y+P4IAAAAOGVYSWZNTQAqAAAACAAHAQYAAwAAAAEAAQAAAREABAAAAAEAAABAAREQAEAAAAAEAAAAUAAAAABBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykAAAADAAAABwAAAAEAAA== ";
const IconMap: Record<string, any> = {
  SprayCan, CarFront, ShieldCheck, Award, MapPin, Sparkles, Heart, Star
};
export function HomePage() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const userRole = useAuthStore(s => s.user?.role);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);
  const portalPath = userRole === 'admin' ? '/admin' : userRole === 'tech' ? '/tech' : '/my-bookings';
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 ice-crack-pattern opacity-[0.03] pointer-events-none" />
      <ThemeToggle />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={LOGO_BASE64} alt="Stone Cold Logo" className="h-10 w-10 animate-shimmer filter brightness-110" />
          <span className="text-xl font-bold tracking-tight text-shimmer">Stone Cold Detailing</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">Services</a>
          <a href="#reviews" className="text-sm font-medium hover:text-primary transition-colors">Reviews</a>
          {isAuthenticated ? (
            <Button asChild variant="ghost" size="sm" className="gap-2 border border-border">
              <Link to={portalPath}><User className="h-4 w-4" /> My Account</Link>
            </Button>
          ) : (
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
          )}
          <Button asChild className="bg-metallic text-white font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(30,144,255,0.3)]">
            <Link to="/booking">Book Now</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader><SheetTitle>Stone Cold Detailing</SheetTitle></SheetHeader>
            <div className="grid gap-4 py-8">
              <SheetClose asChild><a href="#services" className="text-lg font-medium">Services</a></SheetClose>
              {isAuthenticated ? (
                <SheetClose asChild><Link to={portalPath} className="text-lg font-medium text-primary">Account Dashboard</Link></SheetClose>
              ) : (
                <SheetClose asChild><Link to="/login" className="text-lg font-medium">Login</Link></SheetClose>
              )}
              <Button asChild className="bg-metallic mt-4"><Link to="/booking">Book Now</Link></Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      <section className="relative py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-crackle">
            <Sparkles className="h-3 w-3" />
            <span>FROZEN PERFECTION IN EVERY DETAIL</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black text-foreground mb-8 tracking-tighter leading-[0.9] text-shimmer">
            STAY FROSTY.<br />
            <span className="text-primary">DRIVE METALLIC.</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty font-medium opacity-80">
            Premium mobile automotive care with an arctic precision finish. We bring the showroom frost directly to your driveway.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild size="lg" className="h-16 px-12 text-xl font-black bg-metallic hover:scale-110 transition-transform shadow-xl">
              <Link to="/booking">START BOOKING <ChevronRight className="ml-2 h-6 w-6" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-12 text-xl border-2 hover:bg-muted/50">
              EXPLORE ARTIC PLANS
            </Button>
          </div>
        </div>
      </section>
      <section id="services" className="py-32 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Arctic Services</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { iconName: 'SprayCan', title: 'Arctic Exterior', desc: 'Icy hand wash, metallic decontamination, and high-gloss ceramic shield.' },
              { iconName: 'CarFront', title: 'Deep Freeze Interior', desc: 'Sanitization, fabric extraction, and premium leather frosting.' },
              { iconName: 'ShieldCheck', title: 'Stone Cold Full', desc: 'The complete arctic treatment. Paint correction and lifetime protection.' }
            ].map((s, i) => {
              const Icon = IconMap[s.iconName] || SprayCan;
              return (
                <div key={i} className="group glass-ice p-10 rounded-[2.5rem] hover:-translate-y-4 transition-all duration-500">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                    <Icon className="h-10 w-10 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <footer className="py-20 bg-card border-t border-border/50 text-center space-y-12">
        <div className="flex items-center justify-center gap-3">
          <img src={LOGO_BASE64} alt="Stone Cold" className="h-8 w-8 opacity-70" />
          <span className="text-2xl font-black tracking-tighter uppercase opacity-80">Stone Cold Detailing</span>
        </div>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
          The pinnacle of mobile car care. Precision, longevity, and a metallic finish that defies elements.
        </p>
        <div className="border-t pt-10 text-xs text-muted-foreground font-medium flex flex-col md:flex-row justify-center gap-8">
          <span>&copy; 2025 Stone Cold Detailing</span>
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}