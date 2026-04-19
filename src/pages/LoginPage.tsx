import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Hammer, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const handleQuickLogin = (role: 'admin' | 'tech' | 'customer') => {
    const mockUser = {
      id: role === 'admin' ? 'admin-1' : role === 'tech' ? 'tech-1' : 'cust-1',
      name: role === 'admin' ? 'Admin User' : role === 'tech' ? 'James Tech' : 'Demo Customer',
      email: `${role}@detaildeluxe.com`,
      role,
    };
    login(mockUser);
    if (role === 'admin') navigate('/admin');
    else if (role === 'tech') navigate('/tech');
    else navigate('/my-bookings');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center space-y-2 bg-slate-50 border-b py-8">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-brand-500 flex items-center justify-center text-white mb-2 shadow-lg shadow-brand-500/20">
                <Shield className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Detail Deluxe Access</CardTitle>
              <CardDescription>Select your portal to continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-8">
              <Button
                onClick={() => handleQuickLogin('admin')}
                variant="outline"
                className="w-full h-16 justify-start gap-4 hover:border-brand-500 hover:bg-brand-50 group transition-all rounded-xl"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <Shield className="h-5 w-5 text-slate-600 group-hover:text-brand-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Admin Portal</div>
                  <div className="text-xs text-muted-foreground">Operations & Finance</div>
                </div>
              </Button>
              <Button
                onClick={() => handleQuickLogin('tech')}
                variant="outline"
                className="w-full h-16 justify-start gap-4 hover:border-brand-500 hover:bg-brand-50 group transition-all rounded-xl"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <Hammer className="h-5 w-5 text-slate-600 group-hover:text-brand-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Technician View</div>
                  <div className="text-xs text-muted-foreground">Route & Job Management</div>
                </div>
              </Button>
              <Button
                onClick={() => handleQuickLogin('customer')}
                variant="outline"
                className="w-full h-16 justify-start gap-4 hover:border-brand-500 hover:bg-brand-50 group transition-all rounded-xl"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <UserIcon className="h-5 w-5 text-slate-600 group-hover:text-brand-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Customer Portal</div>
                  <div className="text-xs text-muted-foreground">My Bookings & Profile</div>
                </div>
              </Button>
              <div className="pt-6 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  Demo Environment Only
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}