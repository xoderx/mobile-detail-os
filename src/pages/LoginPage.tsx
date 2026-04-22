import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Hammer, User as UserIcon, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAABNmlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjarY7NDkBAFIWnL6UoWfFndm7szm9jY2f9XIsomfU6Oje85fSce78AIEZTo8HWBGfFzPImRkdXV6pG9AByDAm50rUe1yV8FshWAsmYq9v1U2A2mD8tYFpZ/6y/668pXUv6LNAshZJx67vAaiB/XMC0sv6OvxPshSREvGReSjr6vAtshLREvGRedLzI95AdEJYIH5kvOT/kfMhOxEvGRS5X6M6M+AaxH8IKscAUEC30L6I/hBXigYknWuhfRH8IK8QDE0+00L+I/hBWiwZ6p+u8AOKF/UX0h7BOPLD3RAv9S+9A+vK76H5X96B7L3XvX+X65f6N7o8Y+P4IAAAAOGVYSWZNTQAqAAAACAAHAQYAAwAAAAEAAQAAAREABAAAAAEAAABAAREQAEAAAAAEAAAAUAAAAABBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykAAAADAAAABwAAAAEAAA== ";
export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const handleQuickLogin = (role: 'admin' | 'tech' | 'customer') => {
    const mockUser = {
      id: role === 'admin' ? 'admin-1' : role === 'tech' ? 'tech-1' : 'cust-1',
      name: role === 'admin' ? 'System Administrator' : role === 'tech' ? 'Lead Technician' : 'Elite Member',
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
        <Card className="border-border/50 shadow-2xl rounded-[2.5rem] overflow-hidden glass-ice">
          <CardHeader className="text-center space-y-4 py-12 border-b border-border/20 bg-muted/30">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-primary flex items-center justify-center text-white mb-2 shadow-[0_0_30px_rgba(30,144,255,0.4)] animate-shimmer relative">
              <img src={LOGO_BASE64} alt="Stone Cold" className="h-10 w-10 brightness-200" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter uppercase text-shimmer">Stone Cold Ops</CardTitle>
            <CardDescription className="font-bold text-muted-foreground/80">AUTHENTICATE TO ACCESS COMMAND PORTALS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-10">
            <Button
              onClick={() => handleQuickLogin('admin')}
              variant="outline"
              className="w-full h-20 justify-start gap-5 hover:border-primary hover:bg-primary/5 group transition-all rounded-2xl border-border/30"
            >
              <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <Shield className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="font-black text-sm uppercase tracking-wider">COMMAND CENTER</div>
                <div className="text-xs text-muted-foreground font-medium">Business Administration</div>
              </div>
            </Button>
            <Button
              onClick={() => handleQuickLogin('tech')}
              variant="outline"
              className="w-full h-20 justify-start gap-5 hover:border-primary hover:bg-primary/5 group transition-all rounded-2xl border-border/30"
            >
              <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <Hammer className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="font-black text-sm uppercase tracking-wider">ARCTIC FIELD OPS</div>
                <div className="text-xs text-muted-foreground font-medium">Technician Dispatch & Workflow</div>
              </div>
            </Button>
            <Button
              onClick={() => handleQuickLogin('customer')}
              variant="outline"
              className="w-full h-20 justify-start gap-5 hover:border-primary hover:bg-primary/5 group transition-all rounded-2xl border-border/30"
            >
              <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <UserIcon className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="font-black text-sm uppercase tracking-wider">ELITE MEMBER PORTAL</div>
                <div className="text-xs text-muted-foreground font-medium">Personal Vehicle Vault</div>
              </div>
            </Button>
            <div className="pt-8 text-center">
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Snowflake className="h-3 w-3 animate-crackle" />
                SECURE ARCTIC ENCRYPTION ACTIVE
                <Snowflake className="h-3 w-3 animate-crackle" />
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}