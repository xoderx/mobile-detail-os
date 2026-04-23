import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Star, Snowflake, Droplets, User, Menu, Sparkles, Send
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BRAND_NAME } from '@/lib/constants';
import { Logo } from '@/components/Logo';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { GallerySection } from '@/components/home/GallerySection';
import { ReviewSection } from '@/components/home/ReviewSection';
export function HomePage() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: () => api<any>('/api/cms/config'),
  });
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
  const heroTitle = config?.heroTitle || 'FROZEN PERFECTION.';
  const titleParts = heroTitle.split(' ');
  const firstWord = titleParts[0] || '';
  const restOfTitle = titleParts.slice(1).join(' ');
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 ice-crack-pattern opacity-[0.03] pointer-events-none" />
      <ThemeToggle />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10 animate-shimmer" alt={BRAND_NAME} />
          <span className="text-lg font-black tracking-tighter uppercase text-shimmer">{config?.siteTitle || BRAND_NAME}</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/pricing" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Pricing</Link>
          <a href="#services" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Services</a>
          <a href="#gallery" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Showcase</a>
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
      <section className="relative pt-24 pb-32 lg:pt-48 lg:pb-56 bg-slate-900 relative overflow-hidden">
        {config?.heroImageUrl && (
          <div className="absolute inset-0 z-0">
             <img src={config.heroImageUrl} className="w-full h-full object-cover opacity-20" alt="Hero Background" />
             <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/40 to-slate-900" />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-[0.3em] mb-8 animate-crackle">
                <Snowflake className="h-3 w-3" />
                <span>Premium Arctic Care</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-8 tracking-tighter leading-[0.85] text-shimmer uppercase">
                {firstWord} <br /> {restOfTitle}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-12 font-black uppercase tracking-tight opacity-80 max-w-lg">
                {config?.heroSubtitle || "Premium mobile automotive detailing with an icy precision finish."}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button asChild size="lg" className="h-16 px-10 text-lg font-black uppercase tracking-widest bg-metallic rounded-2xl shadow-xl shadow-primary/20 border-t border-white/20">
                  <Link to="/booking">{config?.ctaText || 'Start Booking'}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg font-black uppercase tracking-widest border-2 rounded-2xl border-primary/20 text-primary-foreground shadow-lg hover:bg-primary/10">
                  <Link to="/pricing">View Plans</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="glass-ice p-10 rounded-[3rem] border-2 border-primary/20 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-white">Priority Access</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Join the elite fleet for exclusive arctic promos.</p>
                <form onSubmit={handleLeadCapture} className="space-y-4 relative z-10">
                  <div className="space-y-2">
                    <Input
                      placeholder="YOUR NAME"
                      className="h-14 border-2 border-white/5 rounded-2xl bg-white/5 font-black text-xs uppercase tracking-widest px-6 text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="EMAIL@PROVIDER.COM"
                      required
                      className="h-14 border-2 border-white/5 rounded-2xl bg-white/5 font-black text-xs uppercase tracking-widest px-6 text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 border-t border-white/20"
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
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full shadow-[0_0_15px_rgba(0,191,255,0.5)]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Droplets, title: 'Icy Wash', desc: 'Starting at $50. Precision hand wash with frozen finish.' },
              { icon: Sparkles, title: 'Arctic Full', desc: '$180+. The complete rejuvenation protocol.' },
              { icon: Snowflake, title: 'Ceramic Frost', desc: 'Premium shielding for long-term metallic shine.' }
            ].map((s, i) => (
              <div key={i} className="glass-ice p-12 rounded-[3rem] border-2 border-primary/10 hover:-translate-y-2 transition-transform shadow-sm group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                  <s.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{s.title}</h3>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest leading-relaxed opacity-70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div id="gallery">
        <GallerySection />
      </div>
      <ReviewSection />
      <footer className="py-24 border-t-2 border-border/50 bg-card text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,191,255,0.03),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-10 relative z-10">
          <Logo className="h-12 w-12 opacity-50" />
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] max-w-sm">
            Precision mobile detailing for the automotive elite.
          </p>
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex gap-12">
             <span>© 2025 Stone Cold Detailing</span>
             <Link to="/login" className="hover:text-primary transition-colors">Admin Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}