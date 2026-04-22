import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, ChevronLeft, Loader2, Server } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { BRAND_SHORT_NAME } from '@/lib/constants';
import { toast } from 'sonner';
export function AdminLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulation: In a real app, verify credentials with /api/auth/login
    await new Promise(r => setTimeout(r, 1000));
    login({
      id: 'admin-1',
      name: 'System Administrator',
      email: 'admin@stonecold.com',
      role: 'admin'
    });
    toast.success('System Control Access Granted');
    navigate('/admin');
  };
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.05),transparent)] pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-between items-center mb-8">
           <Link to="/" className="text-slate-500 hover:text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
              <ChevronLeft className="h-4 w-4" /> Public Site
           </Link>
           <Badge variant="outline" className="text-[9px] font-black tracking-widest text-slate-500 border-slate-800 uppercase">PORT 443 SECURE</Badge>
        </div>
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] shadow-[0_0_100px_rgba(0,191,255,0.1)] overflow-hidden">
          <CardHeader className="p-12 text-center border-b border-slate-800 bg-slate-900/50">
            <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-[0_0_40px_rgba(0,191,255,0.3)] border-2 border-white/10">
               <Server className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter uppercase text-white">{BRAND_SHORT_NAME} OPS</CardTitle>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Command Center Authentication</p>
          </CardHeader>
          <CardContent className="p-12">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Terminal ID</Label>
                <Input
                  placeholder="ADMIN_PRIMARY"
                  className="h-14 bg-slate-950 border-slate-800 rounded-2xl text-white font-mono text-sm uppercase px-6 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Key</Label>
                <Input
                  type="password"
                  className="h-14 bg-slate-950 border-slate-800 rounded-2xl text-white font-mono text-sm px-6 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Establish Connection'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="px-12 pb-12 pt-0">
             <div className="w-full flex items-center justify-center gap-4 text-[8px] text-slate-600 font-black uppercase tracking-[0.5em]">
                <Shield className="h-3 w-3" /> Hardware Attested
                <Lock className="h-3 w-3" /> RSA Encrypted
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}