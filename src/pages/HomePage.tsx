import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">D</div>
          <span className="text-xl font-bold tracking-tight">DetailFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium hover:text-brand-500 transition-colors">Services</a>
          <a href="#about" className="text-sm font-medium hover:text-brand-500 transition-colors">About</a>
          <Button asChild className="bg-brand-500 hover:bg-brand-600">
            <Link to="/booking">Book Now</Link>
          </Button>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-brand-50/50 dark:bg-brand-950/10 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold mb-8 animate-fade-in">
            <Star className="h-3 w-3 fill-current" />
            <span>TOP RATED IN THE TRI-STATE AREA</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
            Showroom quality <br />
            <span className="text-brand-500">at your doorstep.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Mobile auto detailing reimagined. We bring premium care, high-end equipment, and obsessive attention to detail directly to your driveway.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 bg-brand-500 hover:bg-brand-600 text-lg">
              <Link to="/booking">Book Your Detail <ChevronRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
              View Our Packages
            </Button>
          </div>
        </div>
      </section>
      {/* Trust Badges */}
      <section className="py-12 border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-background border flex items-center justify-center text-brand-500 shadow-sm">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Fully Insured</h3>
                <p className="text-sm text-muted-foreground">Peace of mind guaranteed for your asset.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-background border flex items-center justify-center text-brand-500 shadow-sm">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Eco-Friendly</h3>
                <p className="text-sm text-muted-foreground">Water-saving tech and premium biodegradable supplies.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-background border flex items-center justify-center text-brand-500 shadow-sm">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">100% Satisfaction</h3>
                <p className="text-sm text-muted-foreground">If you aren't happy, we'll make it right.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Showcase Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aspect-video w-full rounded-2xl bg-muted overflow-hidden relative group">
             <img 
               src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=2000" 
               className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
               alt="Car detailing"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
               <div className="text-white">
                 <h2 className="text-3xl font-bold">Elite Performance</h2>
                 <p className="text-white/80">Every ceramic coating we apply comes with a lifetime guarantee.</p>
               </div>
             </div>
          </div>
        </div>
      </section>
      <footer className="py-12 border-t text-center text-muted-foreground text-sm">
        <p>&copy; 2024 DetailFlow OS. All rights reserved.</p>
      </footer>
    </div>
  );
}