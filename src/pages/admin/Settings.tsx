import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Palette, Eye, ShieldCheck, Loader2, Snowflake, Image as ImageIcon, Layout, Box, Trash2, PlusCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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
  const addGalleryItem = () => {
    const newItem = { id: crypto.randomUUID(), url: '', title: 'New Capture', category: 'luxury' };
    updateConfig.mutate({ gallery: [...(config?.gallery || []), newItem] });
  };
  const removeGalleryItem = (id: string) => {
    updateConfig.mutate({ gallery: config.gallery.filter((g: any) => g.id !== id) });
  };
  return (
    <div className="max-w-7xl mx-auto px-8 py-12 space-y-12 animate-fade-in pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-shimmer">System Command</h1>
          <p className="text-muted-foreground font-medium mt-2 italic">Refining the Stone Cold aesthetic and system logic.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-2 font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl" onClick={() => setPreviewScale(prev => prev === 1 ? 0.7 : 1)}>
            <Eye className="h-4 w-4 mr-2" /> {previewScale === 1 ? 'Viewport Zoom' : 'Full Scale'}
          </Button>
          <Button variant="default" className="bg-metallic text-white font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl shadow-lg border-t border-white/20" onClick={() => toast.info("Propagating global changes...")}>
            Deploy Manifest
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/30 p-1 rounded-xl">
              <TabsTrigger value="appearance" className="font-bold uppercase text-[10px]">Identity</TabsTrigger>
              <TabsTrigger value="content" className="font-bold uppercase text-[10px]">Content</TabsTrigger>
              <TabsTrigger value="gallery" className="font-bold uppercase text-[10px]">Gallery</TabsTrigger>
              <TabsTrigger value="security" className="font-bold uppercase text-[10px]">Control</TabsTrigger>
            </TabsList>
            <TabsContent value="appearance" className="space-y-8 pt-6">
              <Card className="border-none glass-ice rounded-[2.5rem]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-black uppercase tracking-widest text-sm">
                    <Palette className="h-5 w-5 text-primary" /> Chromatic Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Arctic Primary</Label>
                      <div className="flex gap-3">
                        <Input type="color" className="w-14 h-12 p-1 bg-transparent border-2 rounded-xl cursor-pointer" value={config?.brandTheme?.primaryColor || '#00BFFF'} onChange={(e) => updateConfig.mutate({ brandTheme: { ...config.brandTheme, primaryColor: e.target.value } })} />
                        <Input value={config?.brandTheme?.primaryColor || '#00BFFF'} readOnly className="font-mono text-xs border-2 rounded-xl uppercase h-12" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Metallic Accent</Label>
                      <div className="flex gap-3">
                        <Input type="color" className="w-14 h-12 p-1 bg-transparent border-2 rounded-xl cursor-pointer" value={config?.brandTheme?.gradientEnd || '#C0C0C0'} onChange={(e) => updateConfig.mutate({ brandTheme: { ...config.brandTheme, gradientEnd: e.target.value } })} />
                        <Input value={config?.brandTheme?.gradientEnd || '#C0C0C0'} readOnly className="font-mono text-xs border-2 rounded-xl uppercase h-12" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t-2 border-primary/5">
                     <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Asset Node URLs</Label>
                     <div className="grid grid-cols-1 gap-4">
                        <Input placeholder="Logo URL (PNG/SVG)" value={config?.logoUrl || ''} onChange={(e) => updateConfig.mutate({ logoUrl: e.target.value })} className="h-12 border-2 rounded-xl text-xs font-bold" />
                        <Input placeholder="Favicon URL" value={config?.faviconUrl || ''} onChange={(e) => updateConfig.mutate({ faviconUrl: e.target.value })} className="h-12 border-2 rounded-xl text-xs font-bold" />
                     </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="content" className="space-y-8 pt-6">
              <Card className="border-none glass-ice rounded-[2.5rem]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-black uppercase tracking-widest text-sm">
                    <Layout className="h-5 w-5 text-primary" /> Hero Transmission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Hero H1 Title</Label>
                    <Input value={config?.heroTitle || ''} onChange={(e) => updateConfig.mutate({ heroTitle: e.target.value })} className="h-12 border-2 rounded-xl text-xs font-bold uppercase" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Hero H2 Subtitle</Label>
                    <Textarea value={config?.heroSubtitle || ''} onChange={(e) => updateConfig.mutate({ heroSubtitle: e.target.value })} className="min-h-[100px] border-2 rounded-xl text-xs font-bold uppercase p-4" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Hero Background Image URL</Label>
                    <Input value={config?.heroImageUrl || ''} onChange={(e) => updateConfig.mutate({ heroImageUrl: e.target.value })} className="h-12 border-2 rounded-xl text-xs font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Primary CTA Label</Label>
                    <Input value={config?.ctaText || ''} onChange={(e) => updateConfig.mutate({ ctaText: e.target.value })} className="h-12 border-2 rounded-xl text-xs font-bold uppercase" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="gallery" className="space-y-8 pt-6">
               <Card className="border-none glass-ice rounded-[2.5rem]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-3 font-black uppercase tracking-widest text-sm">
                    <ImageIcon className="h-5 w-5 text-primary" /> Detail Show Grid
                  </CardTitle>
                  <Button onClick={addGalleryItem} size="sm" variant="outline" className="h-9 px-4 font-black uppercase text-[9px] tracking-widest border-2 rounded-xl">
                    <PlusCircle className="h-3 w-3 mr-2" /> Add Asset
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config?.gallery?.map((item: any, idx: number) => (
                      <div key={item.id} className="p-5 bg-background/50 border-2 border-border/50 rounded-2xl space-y-4 group">
                        <div className="flex justify-between items-start">
                          <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest h-5 px-2">NODE {idx + 1}</Badge>
                          <Button onClick={() => removeGalleryItem(item.id)} size="icon" variant="ghost" className="h-6 w-6 text-destructive/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input placeholder="Image URL" value={item.url} onChange={(e) => {
                          const next = [...config.gallery];
                          next[idx].url = e.target.value;
                          updateConfig.mutate({ gallery: next });
                        }} className="h-10 border-2 rounded-xl text-[10px] font-bold" />
                        <Input placeholder="Asset Title" value={item.title} onChange={(e) => {
                          const next = [...config.gallery];
                          next[idx].title = e.target.value;
                          updateConfig.mutate({ gallery: next });
                        }} className="h-10 border-2 rounded-xl text-[10px] font-black uppercase" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="space-y-6 pt-6">
              <Card className="border-none glass-ice rounded-[2.5rem]">
                <CardHeader>
                  <CardTitle className="font-black uppercase tracking-widest text-sm flex items-center gap-3">
                    <Box className="h-5 w-5 text-primary" /> Integration Protocols
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Cloudinary Asset Key</Label>
                        <Input type="password" value={config?.keys?.cloudinaryKey || ''} onChange={(e) => updateConfig.mutate({ keys: { ...config.keys, cloudinaryKey: e.target.value } })} className="h-12 border-2 rounded-xl text-xs font-mono" />
                      </div>
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="flex items-center gap-4">
                          <ShieldCheck className="h-6 w-6 text-emerald-500" />
                          <div>
                            <p className="font-black text-[10px] uppercase tracking-widest">Global Handshake</p>
                            <p className="text-[9px] text-muted-foreground uppercase font-black">Status: Secure</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500 text-[8px] font-black px-2 h-5">ENFORCED</Badge>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-4">
          <div className="sticky top-28 border-2 border-border/50 rounded-[3rem] bg-card overflow-hidden h-[750px] shadow-2xl relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,191,255,0.05),transparent)] pointer-events-none" />
            <div className="bg-muted/50 border-b-2 border-border/50 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/40" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest opacity-50">stone-cold.os/preview</div>
            </div>
            <div className="origin-top-left transition-all duration-500 h-full overflow-y-auto scrollbar-hide" style={{ transform: `scale(${previewScale})` }}>
              <div className="bg-background min-h-full p-10 m-6 rounded-[2rem] shadow-xl border-2 border-border/20">
                <div className="flex items-center gap-2 mb-12">
                   <div className="h-6 w-6 bg-primary rounded shadow-lg shadow-primary/20" />
                   <span className="text-sm font-black tracking-tighter uppercase">{config?.siteTitle}</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter leading-none text-shimmer uppercase" style={{ color: config?.brandTheme?.primaryColor }}>
                  {config?.heroTitle}
                </h1>
                <p className="text-muted-foreground mt-8 text-xs font-black uppercase leading-relaxed tracking-tight opacity-70">
                  {config?.heroSubtitle}
                </p>
                <Button className="mt-10 h-14 px-8 font-black uppercase tracking-[0.2em] text-[10px] bg-metallic shadow-xl shadow-primary/20 rounded-xl" style={{ backgroundColor: config?.brandTheme?.primaryColor }}>
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