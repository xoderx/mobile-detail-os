import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Hammer, User as UserIcon, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const handleQuickLogin = (role: UserRole) => {
    const mockUser = {
      id: `u-${role}`,
      name: role === 'admin' ? 'Business Owner' : role === 'tech' ? 'Lead Technician' : 'Valued Customer',
      email: `${role}@detailflow.com`,
      role,
    };
    login(mockUser);
    if (role === 'admin') navigate('/admin');
    else if (role === 'tech') navigate('/tech');
    else navigate('/');
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
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-xl bg-brand-500 flex items-center justify-center text-white mb-2">
                <Lock className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold">Portal Access</CardTitle>
              <CardDescription>Select your role to access the DetailFlow OS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <Button 
                onClick={() => handleQuickLogin('admin')}
                variant="outline" 
                className="w-full h-16 justify-start gap-4 hover:border-brand-500 hover:bg-brand-50 group transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <Shield className="h-5 w-5 text-slate-600 group-hover:text-brand-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Admin Portal</div>
                  <div className="text-xs text-muted-foreground">Manage operations & revenue</div>
                </div>
              </Button>
              <Button 
                onClick={() => handleQuickLogin('tech')}
                variant="outline" 
                className="w-full h-16 justify-start gap-4 hover:border-brand-500 hover:bg-brand-50 group transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <Hammer className="h-5 w-5 text-slate-600 group-hover:text-brand-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Technician View</div>
                  <div className="text-xs text-muted-foreground">View daily route & jobs</div>
                </div>
              </Button>
              <Button 
                onClick={() => handleQuickLogin('customer')}
                variant="outline" 
                className="w-full h-16 justify-start gap-4 hover:border-brand-500 hover:bg-brand-50 group transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <UserIcon className="h-5 w-5 text-slate-600 group-hover:text-brand-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Customer Portal</div>
                  <div className="text-xs text-muted-foreground">Book services & manage subs</div>
                </div>
              </Button>
              <div className="pt-4 text-center">
                <p className="text-[10px] text-muted-foreground">
                  In production, this would be replaced with a secure OAuth or Email/Pass login.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}