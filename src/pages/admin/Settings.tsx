import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Globe, Settings2, Package, Plus, Trash2, 
  Download, Loader2, Sparkles, MessageSquare, 
  Palette, Eye
} from 'lucide-react';
import { toast } from 'sonner';
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
      toast.success('Configuration updated');
    }
  });
  const handleListItemUpdate = (field: 'features' | 'testimonials', id: string, data: any) => {
    const newList = config[field].map((item: any) => item.id === id ? { ...item, ...data } : item);
    updateConfig.mutate({ [field]: newList });
  };
  const handleListItemDelete = (field: 'features' | 'testimonials', id: string) => {
    const newList = config[field].filter((item: any) => item.id !== id);
    updateConfig.mutate({ [field]: newList });
  };
  const handleListItemAdd = (field: 'features' | 'testimonials', defaultItem: any) => {
    const newList = [...(config[field] || []), { ...defaultItem, id: crypto.randomUUID() }];
    updateConfig.mutate({ [field]: newList });
  };
  if (configLoading) return <div className="p-12 text-center flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin h-8 w-8 text-brand-500" /></div>;
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Command Center</h1>
          <p className="text-muted-foreground">Manage your brand, content, and system logic.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewScale(prev => prev === 1 ? 0.7 : 1)}>
            <Eye className="h-4 w-4 mr-2" /> {previewScale === 1 ? 'Compact Preview' : 'Full Preview'}
          </Button>
          <Button variant="default" className="bg-brand-600">
            Deploy Changes
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/50 p-1">
              <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" /> Style</TabsTrigger>
              <TabsTrigger value="hero" className="gap-2"><Globe className="h-4 w-4" /> Hero</TabsTrigger>
              <TabsTrigger value="features" className="gap-2"><Sparkles className="h-4 w-4" /> Services</TabsTrigger>
              <TabsTrigger value="social" className="gap-2"><MessageSquare className="h-4 w-4" /> Social</TabsTrigger>
            </TabsList>
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Identity</CardTitle>
                  <CardDescription>Customize the visual personality of DetailFlow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Brand Color</Label>
                      <div className="flex gap-2">
                        <Input type="color" className="w-12 h-10 p-1" value={config?.brandTheme?.primaryColor} onChange={(e) => updateConfig.mutate({ brandTheme: { ...config.brandTheme, primaryColor: e.target.value } })} />
                        <Input value={config?.brandTheme?.primaryColor} onChange={(e) => updateConfig.mutate({ brandTheme: { ...config.brandTheme, primaryColor: e.target.value } })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Gradient Accent</Label>
                      <div className="flex gap-2">
                        <Input type="color" className="w-12 h-10 p-1" value={config?.brandTheme?.gradientStart} onChange={(e) => updateConfig.mutate({ brandTheme: { ...config.brandTheme, gradientStart: e.target.value } })} />
                        <Input value={config?.brandTheme?.gradientStart} onChange={(e) => updateConfig.mutate({ brandTheme: { ...config.brandTheme, gradientStart: e.target.value } })} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="hero" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Main Headline</Label>
                    <Input defaultValue={config?.heroTitle} onBlur={(e) => updateConfig.mutate({ heroTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sub-headline</Label>
                    <Textarea defaultValue={config?.heroSubtitle} onBlur={(e) => updateConfig.mutate({ heroSubtitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Call to Action Button</Label>
                    <Input defaultValue={config?.ctaText} onBlur={(e) => updateConfig.mutate({ ctaText: e.target.value })} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="features" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Feature Grid</h3>
                <Button size="sm" onClick={() => handleListItemAdd('features', { title: 'New Feature', description: 'Feature description', iconName: 'SprayCan' })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Feature
                </Button>
              </div>
              {config?.features?.map((item: any) => (
                <Card key={item.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Icon Name (Lucide)</Label>
                          <Input defaultValue={item.iconName} onBlur={(e) => handleListItemUpdate('features', item.id, { iconName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input defaultValue={item.title} onBlur={(e) => handleListItemUpdate('features', item.id, { title: e.target.value })} />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleListItemDelete('features', item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea defaultValue={item.description} onBlur={(e) => handleListItemUpdate('features', item.id, { description: e.target.value })} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="social" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Client Testimonials</h3>
                <Button size="sm" onClick={() => handleListItemAdd('testimonials', { author: 'Client Name', role: 'Verified Customer', content: 'Great service!', rating: 5 })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Review
                </Button>
              </div>
              {config?.testimonials?.map((item: any) => (
                <Card key={item.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Author</Label>
                          <Input defaultValue={item.author} onBlur={(e) => handleListItemUpdate('testimonials', item.id, { author: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Rating (1-5)</Label>
                          <Input type="number" min="1" max="5" defaultValue={item.rating} onBlur={(e) => handleListItemUpdate('testimonials', item.id, { rating: parseInt(e.target.value) })} />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleListItemDelete('testimonials', item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea placeholder="Review content..." defaultValue={item.content} onBlur={(e) => handleListItemUpdate('testimonials', item.id, { content: e.target.value })} />
                  </CardContent>
                </Card>
              ))}
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
                  localhost:3000/preview
                </div>
              </div>
            </div>
            <div className="origin-top-left transition-transform duration-300 overflow-y-auto h-full" style={{ transform: `scale(${previewScale})` }}>
              <div className="bg-white min-h-full">
                <div className="p-8 space-y-12">
                  <header className="flex justify-between items-center border-b pb-4">
                    <div className="font-bold text-xl" style={{ color: config?.brandTheme?.primaryColor }}>{config?.siteTitle}</div>
                    <Button size="sm" style={{ backgroundColor: config?.brandTheme?.primaryColor }}>Book</Button>
                  </header>
                  <section className="text-center space-y-4">
                    <h1 className="text-3xl font-bold leading-tight">{config?.heroTitle}</h1>
                    <p className="text-sm text-muted-foreground">{config?.heroSubtitle}</p>
                    <Button className="h-10 px-6 font-bold" style={{ background: `linear-gradient(135deg, ${config?.brandTheme?.gradientStart}, ${config?.brandTheme?.gradientEnd})` }}>
                      {config?.ctaText}
                    </Button>
                  </section>
                  <div className="grid grid-cols-2 gap-4">
                    {config?.features?.slice(0, 2).map((f: any) => (
                      <div key={f.id} className="p-4 border rounded-xl text-xs space-y-2">
                        <div className="font-bold">{f.title}</div>
                        <p className="opacity-70">{f.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                     {config?.testimonials?.slice(0, 1).map((t: any) => (
                       <div key={t.id} className="bg-muted/30 p-4 rounded-xl text-xs italic">
                         "{t.content}" - <strong>{t.author}</strong>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-muted-foreground">Preview updates in real-time as you edit fields.</p>
          </div>
        </div>
      </div>
    </div>
  );
}