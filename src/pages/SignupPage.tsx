import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { ShieldCheck, Snowflake, ArrowRight, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';
import { BRAND_SHORT_NAME } from '@/lib/constants';
const signupSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
  phoneNumber: z.string().optional(),
});
type SignupValues = z.infer<typeof signupSchema>;
export function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema)
  });
  const onSubmit = async (data: SignupValues) => {
    setLoading(true);
    try {
      await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ ...data, role: 'customer' })
      });
      toast.success('Member vault created. Welcome to the elite fleet.');
      navigate('/login');
    } catch (err) {
      toast.error('Registry failure. Use a different email node.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="absolute inset-0 ice-crack-pattern opacity-[0.05] pointer-events-none" />
      <ThemeToggle />
      <Link to="/" className="mb-10 flex items-center gap-3 relative z-10">
        <Logo className="h-10 w-10" />
        <span className="text-xl font-black uppercase tracking-tighter text-shimmer">{BRAND_SHORT_NAME}</span>
      </Link>
      <Card className="w-full max-w-md border-2 border-primary/10 rounded-[3rem] glass-ice relative z-10 overflow-hidden shadow-2xl">
        <CardHeader className="p-10 text-center border-b border-primary/5 bg-primary/[0.02]">
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">Member Vault</CardTitle>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-2">Initialize your Stone Cold Detailing profile</p>
        </CardHeader>
        <CardContent className="p-10 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Full Name</Label>
              <Input 
                {...register('name')}
                placeholder="John Doe"
                className={`h-14 border-2 rounded-2xl bg-background/50 font-bold px-6 ${errors.name ? 'border-destructive' : 'border-border focus:border-primary'}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Email Address</Label>
              <Input 
                type="email"
                {...register('email')}
                placeholder="john@fleet.com"
                className={`h-14 border-2 rounded-2xl bg-background/50 font-bold px-6 ${errors.email ? 'border-destructive' : 'border-border focus:border-primary'}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Secure Password</Label>
              <Input 
                type="password"
                {...register('password')}
                className={`h-14 border-2 rounded-2xl bg-background/50 px-6 ${errors.password ? 'border-destructive' : 'border-border focus:border-primary'}`}
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.01] transition-transform"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Create Vault Access'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="p-10 pt-0 flex flex-col gap-6">
           <div className="text-center">
             <span className="text-xs text-muted-foreground font-black uppercase tracking-widest">Already a member? </span>
             <Link to="/login" className="text-xs text-primary font-black uppercase tracking-widest hover:underline">Log In</Link>
           </div>
           <div className="flex items-center justify-center gap-4 text-[9px] text-primary font-black uppercase tracking-[0.4em] opacity-60">
             <ShieldCheck className="h-3 w-3" /> Encrypted Registry
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}