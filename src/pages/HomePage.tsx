import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ThemeToggle } from '@/components/ThemeToggle';

export function HomePage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

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
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <SheetClose asChild>
                <a href="#services" className="text-lg font-medium flex items-center gap-2 py-2">
                  Services
                </a>
              </SheetClose>
              <SheetClose asChild>
                <a href="#about" className="text-lg font-medium flex items-center gap-2 py-2">
                  About
                </a>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="w-full justify-start">
                  <Link to="/booking">Book Now</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                  View Our Packages
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Our Service Packages</DialogTitle>
                  <DialogDescription>
                    Choose the perfect package for your vehicle. All prices include mobile service.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-3 gap-6 py-6">
                  <div className="border rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <SprayCan className="h-8 w-8 text-brand-500" />
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">Basic</h3>
                    <p className="text-3xl font-bold text-brand-500 text-center mb-4">$99</p>
                    <ul className="space-y-2 mb-6 text-sm">
                      <li className="flex items-center gap-2">✓ Exterior wash & wax</li>
                      <li className="flex items-center gap-2">✓ Tire shine</li>
                      <li className="flex items-center gap-2">✓ Wheel cleaning</li>
                    </ul>
                    <Button asChild className="w-full">
                      <Link to="/booking">Book Basic</Link>
                    </Button>
                  </div>
                  <div className="border rounded-xl p-6 hover:shadow-lg transition-all bg-brand-50/50">
                    <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CarFront className="h-8 w-8 text-brand-500" />
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">Premium</h3>
                    <p className="text-3xl font-bold text-brand-500 text-center mb-4">$199</p>
                    <ul className="space-y-2 mb-6 text-sm">
                      <li className="flex items-center gap-2">✓ Full exterior detail</li>
                      <li className="flex items-center gap-2">✓ Interior vacuum & wipe-down</li>
                      <li className="flex items-center gap-2">✓ Leather conditioning</li>
                      <li className="flex items-center gap-2">✓ Engine bay cleaning</li>
                    </ul>
                    <Button asChild className="w-full">
                      <Link to="/booking">Book Premium</Link>
                    </Button>
                  </div>
                  <div className="border rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-br from-brand-50 to-brand-100">
                    <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="h-8 w-8 text-brand-500" />
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">Ultimate</h3>
                    <p className="text-3xl font-bold text-brand-500 text-center mb-4">$349</p>
                    <ul className="space-y-2 mb-6 text-sm">
                      <li className="flex items-center gap-2">✓ Everything in Premium</li>
                      <li className="flex items-center gap-2">✓ Ceramic coating</li>
                      <li className="flex items-center gap-2">✓ Paint correction</li>
                      <li className="flex items-center gap-2">✓ Headlight restoration</li>
                      <li className="flex items-center gap-2">✓ Odor elimination</li>
                    </ul>
                    <Button asChild className="w-full bg-brand-500 hover:bg-brand-600">
                      <Link to="/booking">Book Ultimate</Link>
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button asChild>
                    <Link to="/booking">Start Booking</Link>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

      {/* Services Section */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Precision detailing tailored to your vehicle's needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group hover:shadow-xl transition-all duration-300 border rounded-2xl p-8 hover:-translate-y-2">
              <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-500/20 transition-colors">
                <SprayCan className="h-10 w-10 text-brand-500 group-hover:text-brand-500 group-hover:scale-110 transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Exterior Perfection</h3>
              <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                Flawless paint correction, ceramic coatings, and showroom shine that lasts.
              </p>
            </div>
            <div className="group hover:shadow-xl transition-all duration-300 border rounded-2xl p-8 hover:-translate-y-2">
              <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-500/20 transition-colors">
                <CarFront className="h-10 w-10 text-brand-500 group-hover:text-brand-500 group-hover:scale-110 transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Interior Sanctuary</h3>
              <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                Deep cleaning, leather restoration, and odor elimination for pristine cabins.
              </p>
            </div>
            <div className="group hover:shadow-xl transition-all duration-300 border rounded-2xl p-8 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-500/20 transition-colors">
                <ShieldCheck className="h-10 w-10 text-brand-500 group-hover:text-brand-500 group-hover:scale-110 transition-all" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Protective Coatings</h3>
              <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                Advanced ceramic protection with lifetime warranties against environmental damage.
              </p>
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

      {/* About Section */}
      <section id="about" className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              About DetailFlow
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mobile detailing redefined. We bring automotive artistry to your driveway.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Founded by automotive enthusiasts with 10+ years of professional detailing experience,
                DetailFlow combines cutting-edge techniques with premium products to deliver unmatched results.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-lg">
                Our certified technicians use waterless cleaning systems, professional-grade ceramic coatings,
                and eco-friendly products to protect and preserve your investment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="flex-1">
                  <Link to="/booking">Book Now</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-8 text-center border">
                <Users className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">500+</div>
                <div className="text-muted-foreground font-medium">Happy Customers</div>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-8 text-center border">
                <Award className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">1000+</div>
                <div className="text-muted-foreground font-medium">Vehicles Detailed</div>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-8 text-center border">
                <MapPin className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">Tri-State</div>
                <div className="text-muted-foreground font-medium">Area Coverage</div>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-8 text-center border">
                <Shield className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">100%</div>
                <div className="text-muted-foreground font-medium">Satisfaction</div>
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
//