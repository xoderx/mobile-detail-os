import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Globe, Palette, Eye, ShieldCheck, Lock, Activity, Server, Loader2, Sparkles, MessageSquare, Users, Snowflake
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
export default function Settings() {
  const queryClient = useQueryClient();
  const [previewScale, setPreviewScale] = useState(1);
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['config'],
    queryFn: () => api<any>('/api/cms/config'),
  });
  const updateConfig = useMutation({
    mutationFn: (data: any) => api('/api/cms/config', { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      toast.success('System configuration deployed');
    }
  });
  if (configLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="space-y-12 animate-fade-in pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-shimmer">Brand Command</h1>
          <p className="text-muted-foreground font-medium mt-2 italic">Refining the Stone Cold aesthetic and system logic.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-2 font-bold" onClick={() => setPreviewScale(prev => prev === 1 ? 0.7 : 1)}>
            <Eye className="h-4 w-4 mr-2" /> {previewScale === 1 ? 'Viewport Zoom' : 'Full Scale'}
          </Button>
          <Button variant="default" className="bg-metallic text-white font-bold shadow-lg" onClick={() => toast.info("Propagating global changes...")}>
            Deploy Manifest
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-10">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-muted/30 p-1 rounded-xl">
              <TabsTrigger value="appearance" className="font-bold uppercase text-[10px]">Style</TabsTrigger>
              <TabsTrigger value="hero" className="font-bold uppercase text-[10px]">Content</TabsTrigger>
              <TabsTrigger value="features" className="font-bold uppercase text-[10px]">Services</TabsTrigger>
              <TabsTrigger value="social" className="font-bold uppercase text-[10px]">Feedback</TabsTrigger>
              <TabsTrigger value="security" className="font-bold uppercase text-[10px]">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="appearance" className="space-y-8 pt-6">
              <Card className="border-none glass-ice rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Chromatic Identity
                  </CardTitle>
                  <CardDescription>Master palette for the Stone Cold metallic look.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest">Arctic Primary (Deep Sky Blue)</Label>
                      <div className="flex gap-3">
                        <Input type="color" className="w-14 h-12 p-1 bg-transparent border-2 rounded-xl" value={config?.brandTheme?.primaryColor || '#00BFFF'} onChange={(e) => updateConfig.mutate({ brandTheme: { ...config.brandTheme, primaryColor: e.target.value } })} />
                        <Input value={config?.brandTheme?.primaryColor || '#00BFFF'} readOnly className="font-mono text-sm border-2 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest">Metallic Accent (Silver)</Label>
                      <div className="flex gap-3">
                        <Input type="color" className="w-14 h-12 p-1 bg-transparent border-2 rounded-xl" value={config?.brandTheme?.gradientEnd || '#C0C0C0'} onChange={(e) => updateConfig.mutate({ brandTheme: { ...config.brandTheme, gradientEnd: e.target.value } })} />
                        <Input value={config?.brandTheme?.gradientEnd || '#C0C0C0'} readOnly className="font-mono text-sm border-2 rounded-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-[1.5rem] bg-muted/50 border-2 border-dashed border-primary/20 text-center">
                    <Snowflake className="h-8 w-8 text-primary/30 mx-auto mb-4 animate-crackle" />
                    <p className="text-sm text-muted-foreground italic">Current palette tuned for #000000 pitch-black dark mode contrast.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-6 pt-6">
              <Card className="border-none glass-ice rounded-[2rem]">
                <CardHeader>
                  <CardTitle>System Hardening</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-4">
                      <ShieldCheck className="h-6 w-6 text-emerald-500" />
                      <div>
                        <p className="font-black text-sm uppercase">Global Rate Limiting</p>
                        <p className="text-xs text-muted-foreground">Status: Active & Enforced</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500">PROTECTED</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-28 border border-border/50 rounded-[3rem] bg-card overflow-hidden h-[750px] shadow-2xl relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,191,255,0.05),transparent)] pointer-events-none" />
            <div className="bg-muted/50 border-b border-border/50 px-6 py-3 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/40" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest opacity-50">stone-cold.os/preview</div>
            </div>
            <div className="origin-top-left transition-all duration-500 overflow-y-auto h-full scrollbar-hide" style={{ transform: `scale(${previewScale})` }}>
              <div className="bg-background min-h-full p-12 m-6 rounded-[2rem] shadow-xl border border-border/20">
                <div className="flex items-center gap-2 mb-12">
                   <div className="h-6 w-6 bg-brand-500 rounded" />
                   <span className="text-sm font-black tracking-tighter uppercase">Stone Cold</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter leading-none text-shimmer" style={{ color: config?.brandTheme?.primaryColor }}>
                  {config?.heroTitle}
                </h1>
                <p className="text-muted-foreground mt-6 text-sm font-medium leading-relaxed opacity-80">
                  {config?.heroSubtitle}
                </p>
                <Button className="mt-10 h-12 px-8 font-black uppercase tracking-wider bg-metallic shadow-lg" style={{ backgroundColor: config?.brandTheme?.primaryColor }}>
                  {config?.ctaText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}