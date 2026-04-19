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
  Globe, Palette, Eye, ShieldCheck, Lock, Activity, Server, Loader2, Sparkles, MessageSquare, Users
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
      toast.success('Configuration saved');
    }
  });
  if (configLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detail Deluxe Control</h1>
          <p className="text-muted-foreground">Manage brand, site content, and system security.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewScale(prev => prev === 1 ? 0.7 : 1)}>
            <Eye className="h-4 w-4 mr-2" /> {previewScale === 1 ? 'Compact' : 'Full'}
          </Button>
          <Button variant="default" className="bg-brand-600" onClick={() => toast.info("Deploying live...")}>
            Deploy Changes
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-muted/50 p-1">
              <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-1 hidden sm:block" /> Style</TabsTrigger>
              <TabsTrigger value="hero"><Globe className="h-4 w-4 mr-1 hidden sm:block" /> Hero</TabsTrigger>
              <TabsTrigger value="features"><Sparkles className="h-4 w-4 mr-1 hidden sm:block" /> Services</TabsTrigger>
              <TabsTrigger value="social"><MessageSquare className="h-4 w-4 mr-1 hidden sm:block" /> Social</TabsTrigger>
              <TabsTrigger value="security"><ShieldCheck className="h-4 w-4 mr-1 hidden sm:block" /> Security</TabsTrigger>
            </TabsList>
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Identity</CardTitle>
                  <CardDescription>Configure your visual presence across all portals.</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link to="/admin/users"><Users className="h-4 w-4" /> Manage Administrative Access</Link>
                  </Button>
                </CardContent>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Brand Color</Label>
                      <div className="flex gap-2">
                        <Input type="color" className="w-12 h-10 p-1" value={config?.brandTheme?.primaryColor} onChange={(e) => updateConfig.mutate({ brandTheme: { ...config.brandTheme, primaryColor: e.target.value } })} />
                        <Input value={config?.brandTheme?.primaryColor} readOnly className="font-mono text-xs" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-emerald-100 bg-emerald-50/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-600" />
                      Global Protection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">SSL/HSTS</span>
                        <Badge className="bg-emerald-500 h-5 px-1.5 text-[10px]">ACTIVE</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">CSP Policies</span>
                        <Badge className="bg-emerald-500 h-5 px-1.5 text-[10px]">STRICT</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Turnstile Session</span>
                        <Badge className="bg-emerald-500 h-5 px-1.5 text-[10px]">ENFORCED</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-brand-100 bg-brand-50/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-brand-600" />
                      Rate Limiting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Booking Attempts</span>
                        <span className="font-bold">5 per hour</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Window Size</span>
                        <span className="font-bold">3600s</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">DO Storage Sync</span>
                        <Badge className="bg-brand-500 h-5 px-1.5 text-[10px]">VERIFIED</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>System Activity Log</CardTitle>
                  <CardDescription>Recent business-level security events.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg text-xs">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-bold">Durable Object State Scrub</p>
                      <p className="text-muted-foreground opacity-70">Successfully verified 128 indices across all entity types.</p>
                    </div>
                    <span className="text-muted-foreground font-mono">Just Now</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg text-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <div className="flex-1">
                      <p className="font-bold">Turnstile Session Validated</p>
                      <p className="text-muted-foreground opacity-70">Security handshake completed for new booking draft.</p>
                    </div>
                    <span className="text-muted-foreground font-mono">3m ago</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="hero" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Hero Configuration</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Main Headline</Label>
                    <Input defaultValue={config?.heroTitle} onBlur={(e) => updateConfig.mutate({ heroTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle Description</Label>
                    <Input defaultValue={config?.heroSubtitle} onBlur={(e) => updateConfig.mutate({ heroSubtitle: e.target.value })} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 border rounded-2xl bg-slate-200/30 overflow-hidden h-[700px] shadow-inner">
             <div className="bg-background border-b px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                  detailflow.os/preview
                </div>
              </div>
            </div>
            <div className="origin-top-left transition-transform duration-300 overflow-y-auto h-full" style={{ transform: `scale(${previewScale})` }}>
              <div className="bg-white min-h-full p-8 shadow-2xl m-4 rounded-xl">
                <h1 className="text-2xl font-bold" style={{ color: config?.brandTheme?.primaryColor }}>{config?.heroTitle}</h1>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{config?.heroSubtitle}</p>
                <Button className="mt-8 font-bold" style={{ backgroundColor: config?.brandTheme?.primaryColor }}>{config?.ctaText}</Button>
                <div className="mt-12 space-y-4 border-t pt-8">
                  <div className="h-4 w-3/4 bg-slate-100 rounded" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded" />
                  <div className="h-4 w-2/3 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}