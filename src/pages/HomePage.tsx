import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronRight, Star, Snowflake, Droplets, User, Menu, Sparkles, Send
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BRAND_NAME, BRAND_SLOGAN } from '@/lib/constants';
import { Logo } from '@/components/Logo';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function HomePage() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const portalPath = user?.role === 'admin' ? '/admin' : user?.role === 'tech' ? '/tech' : '/my-bookings';
  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api('/api/newsletters', { method: 'POST', body: JSON.stringify({ name, email }) });
      toast.success('Access Granted. Watch your inbox for arctic offers.');
      setEmail('');
      setName('');
    } catch (err) {
      toast.error('System failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 ice-crack-pattern opacity-[0.03] pointer-events-none" />
      <ThemeToggle />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10 animate-shimmer" alt={BRAND_NAME} />
          <span className="text-lg font-black tracking-tighter uppercase text-shimmer">{BRAND_NAME}</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/pricing" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Pricing</Link>
          <a href="#services" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Services</a>
          {isAuthenticated ? (
            <Button asChild variant="ghost" size="sm" className="gap-2 font-black uppercase text-[10px] tracking-widest">
              <Link to={portalPath}><User className="h-3 w-3" /> Dashboard</Link>
            </Button>
          ) : (
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Auth</Link>
          )}
          <Button asChild className="bg-metallic text-primary-foreground font-black uppercase tracking-widest h-11 px-6 rounded-xl shadow-lg border border-primary/30">
            <Link to="/booking">Book Now</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader><SheetTitle className="font-black uppercase">{BRAND_NAME}</SheetTitle></SheetHeader>
            <div className="grid gap-6 py-12">
              <SheetClose asChild><Link to="/pricing" className="text-xl font-black uppercase">Pricing</Link></SheetClose>
              <SheetClose asChild><Link to="/booking" className="text-xl font-black uppercase">Book Now</Link></SheetClose>
              {isAuthenticated ? (
                 <SheetClose asChild><Link to={portalPath} className="text-xl font-black uppercase text-primary">Portal</Link></SheetClose>
              ) : (
                 <SheetClose asChild><Link to="/login" className="text-xl font-black uppercase">Login</Link></SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      <section className="relative pt-24 pb-32 lg:pt-48 lg:pb-56 bg-gradient-to-br from-slate-900/50 via-blue-900/20 to-indigo-900/80 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Car silhouette SVG */}
          <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="w-3/4 h-3/4 bottom-0 right-0 opacity-20 translate-x-20 -translate-y-20 scale-110 absolute">
            <defs>
              <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0e0e0"/>
                <stop offset="25%" stopColor="#a0a0a0"/>
                <stop offset="50%" stopColor="#00bfff"/>
                <stop offset="100%" stopColor="#808080"/>
              </linearGradient>
              <radialGradient id="iceGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3"/>
                <stop offset="70%" stopColor="#00bfff" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Car body */}
            <path d="M50 150 Q100 120 200 120 Q300 120 350 150 L350 220 Q300 240 200 240 Q100 240 50 220 Z" fill="url(#iceGlow)" stroke="url(#metallic)" strokeWidth="3" strokeLinecap="round"/>
            {/* Roof */}
            <path d="M80 130 Q150 100 250 130" fill="none" stroke="url(#metallic)" strokeWidth="4" strokeLinecap="round"/>
            {/* Windows */}
            <path d="M100 135 Q130 125 160 135 Q190 145 220 135 Q250 125 280 135" fill="none" stroke="#00bfff" strokeWidth="1.5" strokeDasharray="3,3"/>
            {/* Wheels */}
            <circle cx="100" cy="235" r="18" fill="#333" stroke="url(#metallic)" strokeWidth="2"/>
            <circle cx="300" cy="235" r="18" fill="#333" stroke="url(#metallic)" strokeWidth="2"/>
            {/* Ice cracks on car */}
            <path d="M120 140 L130 130 M160 135 L170 125 M200 145 L210 135 M240 130 L250 120" stroke="#00ffff" strokeWidth="1" strokeLinecap="round" strokeDasharray="2,2"/>
          </svg>
          {/* Ice cracks background */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-10 mix-blend-soft-light absolute">
            <defs>
              <pattern id="iceCracks" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 20 L15 10 M30 40 L35 30 M50 60 L55 50 M70 25 L75 15 M85 70 L90 60 M20 80 L25 70 M40 15 L45 5" stroke="#00bfff" strokeWidth="0.5" strokeLinecap="round" opacity="0.6"/>
                <path d="M60 30 L65 20 M80 50 L85 40 M15 55 L20 45 M45 75 L50 65 M25 35 L30 25 M90 80 L95 70" stroke="#00ffff" strokeWidth="0.4" strokeLinecap="round" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#iceCracks)"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-[0.3em] mb-8 animate-crackle">
                <Snowflake className="h-3 w-3" />
                <span>Premium Arctic Care</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-black text-foreground mb-8 tracking-tighter leading-[0.85] text-shimmer">
                FROZEN<br />PERFECTION.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-12 font-black uppercase tracking-tight opacity-80 max-w-lg">
                {BRAND_SLOGAN}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button asChild size="lg" className="h-16 px-10 text-lg font-black uppercase tracking-widest bg-metallic rounded-2xl shadow-xl">
                  <Link to="/booking">Start Booking</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg font-black uppercase tracking-widest border-2 rounded-2xl">
                  <Link to="/pricing">View Plans</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="glass-ice p-10 rounded-[3rem] border-2 border-primary/20 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Priority Access</h3>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-8">Join the elite fleet for exclusive arctic promos.</p>
                <form onSubmit={handleLeadCapture} className="space-y-4 relative z-10">
                  <div className="space-y-2">
                    <Input 
                      placeholder="YOUR NAME" 
                      className="h-14 border-2 rounded-2xl bg-background/50 font-black text-xs uppercase tracking-widest px-6"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input 
                      type="email" 
                      placeholder="EMAIL@PROVIDER.COM" 
                      required
                      className="h-14 border-2 rounded-2xl bg-background/50 font-black text-xs uppercase tracking-widest px-6"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-[1.02] transition-transform"
                  >
                    {loading ? 'Initializing...' : <><Send className="h-4 w-4 mr-3" /> Claim Invite</>}
                  </Button>
                </form>
              </div>
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-primary/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-primary/10 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>
      <section id="services" className="py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black tracking-tighter uppercase mb-4">Operations</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Droplets, title: 'Icy Wash', desc: 'Starting at $50. Precision hand wash with frozen finish.' },
              { icon: Sparkles, title: 'Arctic Full', desc: '$180+. The complete rejuvenation protocol.' },
              { icon: Snowflake, title: 'Ceramic Frost', desc: 'Premium shielding for long-term metallic shine.' }
            ].map((s, i) => (
              <div key={i} className="glass-ice p-12 rounded-[3rem] border-2 border-primary/10 hover:-translate-y-2 transition-transform">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
                  <s.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{s.title}</h3>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest leading-relaxed opacity-70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-24 border-t-2 border-border/50 bg-card text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-10">
          <Logo className="h-12 w-12 opacity-50" />
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] max-w-sm">
            Precision mobile detailing for the automotive elite. 
          </p>
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex gap-12">
             <span>© 2025 Stone Cold Detailing</span>
             <Link to="/login" className="hover:text-primary">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}