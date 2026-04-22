import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  ChevronRight, Star, SprayCan, CarFront, ShieldCheck,
  Menu, Award, MapPin, Sparkles, Heart, User, Snowflake
} from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LOGO_BASE64, BRAND_NAME, BRAND_SLOGAN } from '@/lib/constants';
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
          <img src={LOGO_BASE64} alt={BRAND_NAME} className="h-10 w-10 animate-shimmer filter brightness-110" />
          <span className="text-xl font-black tracking-tighter uppercase text-shimmer">{BRAND_NAME}</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Services</a>
          <a href="#reviews" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Reviews</a>
          {isAuthenticated ? (
            <Button asChild variant="ghost" size="sm" className="gap-2 border-2 rounded-xl font-black uppercase text-[10px] tracking-widest">
              <Link to={portalPath}><User className="h-3 w-3" /> Portal</Link>
            </Button>
          ) : (
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Auth</Link>
          )}
          <Button asChild className="bg-metallic text-white font-black uppercase tracking-widest h-11 px-6 rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(30,144,255,0.3)]">
            <Link to="/booking">Book Now</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader><SheetTitle className="font-black uppercase tracking-tighter">{BRAND_NAME}</SheetTitle></SheetHeader>
            <div className="grid gap-4 py-8">
              <SheetClose asChild><a href="#services" className="text-lg font-black uppercase">Services</a></SheetClose>
              {isAuthenticated ? (
                <SheetClose asChild><Link to={portalPath} className="text-lg font-black uppercase text-primary">Dashboard</Link></SheetClose>
              ) : (
                <SheetClose asChild><Link to="/login" className="text-lg font-black uppercase">Login</Link></SheetClose>
              )}
              <Button asChild className="bg-metallic mt-4 h-14 font-black uppercase"><Link to="/booking">Book Experience</Link></Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      <section className="relative py-24 lg:py-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border-2 border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-crackle">
            <Snowflake className="h-3 w-3" />
            <span>Frozen Perfection in Every Yield</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-display font-black text-foreground mb-10 tracking-tighter leading-[0.8] text-shimmer">
            STAY FROSTY.<br />
            <span className="text-primary">DRIVE METALLIC.</span>
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-16 font-black uppercase tracking-tight opacity-80">
            {BRAND_SLOGAN}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Button asChild size="lg" className="h-20 px-16 text-2xl font-black uppercase tracking-widest bg-metallic hover:scale-110 transition-transform shadow-2xl rounded-2xl">
              <Link to="/booking">START BOOKING <ChevronRight className="ml-2 h-8 w-8" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="h-20 px-16 text-2xl font-black uppercase tracking-widest border-4 hover:bg-muted/50 rounded-2xl">
              EXPLORE PLANS
            </Button>
          </div>
        </div>
      </section>
      <section id="services" className="py-32 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">Arctic Operations</h2>
            <div className="h-2 w-32 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { iconName: 'SprayCan', title: 'Arctic Exterior', desc: 'Icy hand wash, metallic decontamination, and high-gloss ceramic shield.' },
              { iconName: 'CarFront', title: 'Deep Freeze Interior', desc: 'Sanitization, fabric extraction, and premium leather frosting.' },
              { iconName: 'ShieldCheck', title: 'Stone Cold Full', desc: 'The complete arctic treatment. Paint correction and lifetime protection.' }
            ].map((s, i) => {
              const Icon = IconMap[s.iconName] || SprayCan;
              return (
                <div key={i} className="group glass-ice p-12 rounded-[3rem] hover:-translate-y-4 transition-all duration-500 border-2 border-primary/10">
                  <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-primary transition-colors border-2 border-primary/20">
                    <Icon className="h-12 w-12 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-bold uppercase text-xs tracking-widest opacity-70">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <footer className="py-24 bg-card border-t-2 border-border/50 text-center space-y-12">
        <div className="flex items-center justify-center gap-4">
          <img src={LOGO_BASE64} alt={BRAND_NAME} className="h-10 w-10 opacity-70" />
          <span className="text-3xl font-black tracking-tighter uppercase opacity-80">{BRAND_NAME}</span>
        </div>
        <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] max-w-2xl mx-auto leading-loose opacity-60">
          The pinnacle of mobile car care. Precision, longevity, and a metallic finish that defies the elements.
        </p>
        <div className="border-t-2 pt-12 text-[10px] text-muted-foreground font-black uppercase tracking-widest flex flex-col md:flex-row justify-center gap-12">
          <span>&copy; 2025 {BRAND_NAME} System Ops</span>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}