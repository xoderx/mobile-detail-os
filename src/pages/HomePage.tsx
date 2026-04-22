import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  ChevronRight, Star, SprayCan, CarFront, ShieldCheck,
  Menu, Award, MapPin, Sparkles, Heart, User, Snowflake, Droplets
} from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LOGO_BASE64, BRAND_NAME, BRAND_SLOGAN } from '@/lib/constants';
import { Logo } from '@/components/Logo';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send, Quote } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
const IconMap: Record<string, any> = {
  SprayCan, CarFront, ShieldCheck, Award, MapPin, Sparkles, Heart, Star, Droplets
};
export function HomePage() {
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');

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
          <Logo className="h-12 w-12 animate-shimmer filter brightness-110" alt={BRAND_NAME} />
          <span className="text-xl font-black tracking-tighter uppercase text-shimmer">{BRAND_NAME}</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Operations</a>
          <a href="#reviews" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Feedback</a>
          {isAuthenticated ? (
            <Button asChild variant="ghost" size="sm" className="gap-2 border-2 rounded-xl font-black uppercase text-[10px] tracking-widest">
              <Link to={portalPath}><User className="h-3 w-3" /> Portal</Link>
            </Button>
          ) : (
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Auth</Link>
          )}
            <Button asChild className="bg-metallic text-primary-foreground font-black uppercase tracking-widest h-11 px-6 rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.5)] drop-shadow-2xl border border-primary/30">
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
              <Button asChild className="bg-metallic mt-4 h-14 font-black uppercase border border-primary/30 text-primary-foreground drop-shadow-2xl shadow-[0_0_30px_rgba(255,255,255,0.5)]"><Link to="/booking">Book Experience</Link></Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      <section className="relative py-24 lg:py-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border-2 border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-crackle">
            <Snowflake className="h-3 w-3" />
            <span>Frozen Perfection Starting at $50</span>
          </div>
          <Logo className="h-20 w-20 mx-auto mb-8 opacity-80 animate-shimmer filter brightness-110 drop-shadow-lg" alt={BRAND_NAME} />
          <h1 className="text-7xl md:text-9xl font-display font-black text-foreground mb-10 tracking-tighter leading-[0.8] text-shimmer">
            STAY FROSTY.<br />
            <span className="text-primary">DRIVE METALLIC.</span>
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-16 font-black uppercase tracking-tight opacity-80">
            {BRAND_SLOGAN}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Button asChild size="lg" className="h-20 px-16 text-2xl font-black uppercase tracking-widest bg-metallic hover:scale-110 transition-transform shadow-2xl rounded-2xl border border-primary/30 text-primary-foreground drop-shadow-2xl shadow-[0_0_30px_rgba(255,255,255,0.5)]">
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
              { iconName: 'Droplets', title: 'Basic Arctic Wash', desc: 'Starting at $50. Professional hand wash with icy rim shine and tire glaze.' },
              { iconName: 'CarFront', title: 'Deep Freeze Interior', desc: '$100 Flat Rate. Steam sanitized, leather conditioned, and deep frost vacuum.' },
              { iconName: 'Sparkles', title: 'Stone Cold Full', desc: '$180 - $220. The complete treatment. Clay bar, crystal wax, and interior rejuvenation.' }
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

      <section id="reviews" className="py-32 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">Client Feedback</h2>
            <div className="h-2 w-32 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-8">What Clients Say</h3>
              <div className="space-y-6">
                {[
                  {name: 'Mark S.', text: 'Icy metallic finish that lasts weeks in any weather.', rating: 5},
                  {name: 'Elena R.', text: 'Interior transformation was unreal. Like new again.', rating: 5},
                  {name: 'David T.', text: 'Premium ceramic shield - worth every penny.', rating: 5}
                ].map((t, i) => (
                  <Card key={i} className="glass-ice p-8 rounded-[2rem] border-primary/20 hover:shadow-2xl transition-all">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex gap-1">
                        {Array.from({length: t.rating}, (_,k) => <Star key={k} className="h-6 w-6 fill-primary text-primary" />)}
                      </div>
                      <Quote className="h-5 w-5 text-muted-foreground ml-auto shrink-0" />
                    </div>
                    <p className="text-lg italic text-muted-foreground leading-relaxed">{t.text}</p>
                    <p className="mt-4 text-sm font-black uppercase tracking-widest text-right text-muted-foreground/70">— {t.name}</p>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <Card className="glass-ice p-12 rounded-[3rem] shadow-2xl border-2 border-primary/20">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Share Your Experience</h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider">Help future clients choose Stone Cold perfection.</p>
                </div>
                <div className="flex items-center justify-center mb-8 gap-2 flex-wrap">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`p-3 rounded-2xl font-black text-lg transition-all shadow-md ${
                        rating === n
                          ? 'bg-primary text-white shadow-primary/50 scale-110'
                          : 'bg-muted hover:bg-primary/10 hover:scale-105 border-2 border-border hover:border-primary'
                      }`}
                      disabled={submitting}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="What was your experience with our arctic detailing service?"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="resize-none min-h-[120px] mb-6 border-2 rounded-2xl font-semibold text-base p-5 focus:border-primary focus:ring-primary"
                  disabled={submitting}
                />
                <Button
                  onClick={async () => {
                    if (!rating || !comment.trim() || submitting) return;
                    setSubmitting(true);
                    setSuccessMsg('');
                    try {
                      const res = await api('/api/feedback', {
                        method: 'POST',
                        body: JSON.stringify({ rating, comment, customerId: null })
                      });
                      toast.success('Feedback submitted successfully! Thank you!');
                      setRating(0);
                      setComment('');
                      setSuccessMsg('Thank you for your feedback!');
                    } catch (err) {
                      toast.error('Failed to submit. Please try again.');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  disabled={!rating || !comment.trim() || submitting}
                  className="w-full h-16 bg-metallic text-primary-foreground font-black uppercase tracking-widest text-lg rounded-2xl shadow-2xl border border-primary/30 hover:scale-[1.02] disabled:opacity-50 transition-all"
                >
                  <Send className="h-6 w-6 mr-3" />
                  Submit Review
                </Button>
                {successMsg && (
                  <p className="mt-6 text-center text-emerald-600 font-black uppercase tracking-wider text-sm animate-fade-in">
                    {successMsg}
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-24 bg-card border-t-2 border-border/50 text-center space-y-12">
        <div className="flex items-center justify-center gap-4">
          <Logo className="h-12 w-12 opacity-70" alt={BRAND_NAME} />
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