import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Hammer, User as UserIcon, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';
import { LOGO_BASE64, BRAND_SHORT_NAME } from '@/lib/constants';
export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const handleQuickLogin = (role: 'admin' | 'tech' | 'customer') => {
    const mockUser = {
      id: role === 'admin' ? 'admin-1' : role === 'tech' ? 'tech-1' : 'cust-1',
      name: role === 'admin' ? 'System Admin' : role === 'tech' ? 'Lead Technician' : 'Elite Member',
      email: `${role}@stonecold.com`,
      role,
    };
    login(mockUser);
    if (role === 'admin') navigate('/admin');
    else if (role === 'tech') navigate('/tech');
    else navigate('/my-bookings');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 min-h-screen flex items-center justify-center relative bg-background">
      <div className="absolute inset-0 ice-crack-pattern opacity-[0.05] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 border-primary/10 shadow-2xl rounded-[3rem] overflow-hidden glass-ice">
          <CardHeader className="text-center space-y-4 py-12 border-b-2 border-primary/10 bg-muted/30">
            <div className="mx-auto h-20 w-20 rounded-[2rem] bg-primary flex items-center justify-center text-white mb-2 shadow-[0_0_40px_rgba(30,144,255,0.4)] animate-shimmer relative overflow-hidden border-2 border-white/20">
              <img src={LOGO_BASE64} alt={BRAND_SHORT_NAME} className="h-10 w-10 brightness-200" />
            </div>
            <CardTitle className="text-4xl font-black tracking-tighter uppercase text-shimmer">{BRAND_SHORT_NAME} OPS</CardTitle>
            <CardDescription className="font-black text-[10px] uppercase tracking-widest text-muted-foreground/80">AUTHENTICATE COMMAND PORTAL ACCESS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-10">
            <Button
              onClick={() => handleQuickLogin('admin')}
              variant="outline"
              className="w-full h-24 justify-start gap-6 hover:border-primary hover:bg-primary/5 group transition-all rounded-[1.5rem] border-2 border-border/30 px-6"
            >
              <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all border border-border/20 shadow-sm">
                <Shield className="h-7 w-7" />
              </div>
              <div className="text-left">
                <div className="font-black text-xs uppercase tracking-widest">COMMAND CENTER</div>
                <div className="text-[10px] text-muted-foreground font-black uppercase opacity-60 mt-1">Admin Registry</div>
              </div>
            </Button>
            <Button
              onClick={() => handleQuickLogin('tech')}
              variant="outline"
              className="w-full h-24 justify-start gap-6 hover:border-primary hover:bg-primary/5 group transition-all rounded-[1.5rem] border-2 border-border/30 px-6"
            >
              <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all border border-border/20 shadow-sm">
                <Hammer className="h-7 w-7" />
              </div>
              <div className="text-left">
                <div className="font-black text-xs uppercase tracking-widest">ARCTIC FIELD OPS</div>
                <div className="text-[10px] text-muted-foreground font-black uppercase opacity-60 mt-1">Dispatch & Workflow</div>
              </div>
            </Button>
            <Button
              onClick={() => handleQuickLogin('customer')}
              variant="outline"
              className="w-full h-24 justify-start gap-6 hover:border-primary hover:bg-primary/5 group transition-all rounded-[1.5rem] border-2 border-border/30 px-6"
            >
              <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all border border-border/20 shadow-sm">
                <UserIcon className="h-7 w-7" />
              </div>
              <div className="text-left">
                <div className="font-black text-xs uppercase tracking-widest">MEMBER VAULT</div>
                <div className="text-[10px] text-muted-foreground font-black uppercase opacity-60 mt-1">Client Profile Access</div>
              </div>
            </Button>
            <div className="pt-10 text-center">
              <p className="text-[9px] text-primary font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4">
                <Snowflake className="h-3 w-3 animate-crackle" />
                SECURE ARCTIC PROTOCOLS ACTIVE
                <Snowflake className="h-3 w-3 animate-crackle" />
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}