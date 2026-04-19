import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, CreditCard, Users, Bell, Globe, 
  Settings2, Package, Plus, Trash2, ShieldCheck, 
  Smartphone, Download, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
export default function Settings() {
  const queryClient = useQueryClient();
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['config'],
    queryFn: () => api<any>('/api/cms/config'),
  });
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['cms-services'],
    queryFn: () => api<{ items: any[] }>('/api/cms/services'),
  });
  const { data: addons, isLoading: addonsLoading } = useQuery({
    queryKey: ['cms-addons'],
    queryFn: () => api<{ items: any[] }>('/api/cms/addons'),
  });
  const updateConfig = useMutation({
    mutationFn: (data: any) => api('/api/cms/config', { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      toast.success('Configuration updated');
    }
  });
  const exportConfig = () => {
    const envVars = `
SITE_TITLE="${config?.siteTitle}"
HERO_TITLE="${config?.heroTitle}"
STRIPE_PUBLIC_KEY="${config?.keys?.stripePublicKey}"
TWILIO_SID="${config?.keys?.twilioSid}"
    `.trim();
    const blob = new Blob([envVars], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'detailflow.env';
    a.click();
  };
  if (configLoading || servicesLoading || addonsLoading) return <div className="p-12 text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto" /></div>;
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground">Manage service tiers, pricing, and integrations.</p>
        </div>
        <Button variant="outline" onClick={exportConfig}>
          <Download className="h-4 w-4 mr-2" /> Export ENV
        </Button>
      </div>
      <Tabs defaultValue="cms" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl mb-8">
          <TabsTrigger value="cms">CMS</TabsTrigger>
          <TabsTrigger value="profile">Business</TabsTrigger>
          <TabsTrigger value="services">Pricing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="cms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-xs">Stripe Payments</Label>
                      <p className="text-[10px] text-muted-foreground">Secure deposits</p>
                    </div>
                    <Switch 
                      checked={config?.integrations?.stripe} 
                      onCheckedChange={(v) => updateConfig.mutate({ integrations: { ...config.integrations, stripe: v } })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-xs">Twilio SMS</Label>
                      <p className="text-[10px] text-muted-foreground">Auto notifications</p>
                    </div>
                    <Switch 
                      checked={config?.integrations?.twilio} 
                      onCheckedChange={(v) => updateConfig.mutate({ integrations: { ...config.integrations, twilio: v } })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Content</CardTitle>
                  <CardDescription>Control the public-facing copy of your landing page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hero Title</Label>
                    <Input 
                      defaultValue={config?.heroTitle} 
                      onBlur={(e) => updateConfig.mutate({ heroTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Subtitle</Label>
                    <Textarea 
                      defaultValue={config?.heroSubtitle}
                      onBlur={(e) => updateConfig.mutate({ heroSubtitle: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stripe Key Placeholder</Label>
                      <Input 
                        defaultValue={config?.keys?.stripePublicKey} 
                        onBlur={(e) => updateConfig.mutate({ keys: { ...config.keys, stripePublicKey: e.target.value } })}
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Twilio SID Placeholder</Label>
                      <Input 
                        defaultValue={config?.keys?.twilioSid} 
                        onBlur={(e) => updateConfig.mutate({ keys: { ...config.keys, twilioSid: e.target.value } })}
                        placeholder="AC..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Service Tiers</CardTitle>
                    <CardDescription>Configure packages and features.</CardDescription>
                  </div>
                  <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Tier</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {services?.items?.map((tier: any) => (
                    <div key={tier.id} className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {tier.name}
                          {tier.isPopular && <Badge className="text-[9px] h-4">Popular</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground">${tier.price} Base</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input defaultValue={config?.siteTitle} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input defaultValue="USD ($)" disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add-on Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {addons?.items?.map((addon: any) => (
                <div key={addon.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <span className="font-medium">{addon.name}</span>
                    <p className="text-[10px] text-muted-foreground">{addon.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">$</span>
                    <Input className="w-24 text-right" defaultValue={addon.price} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((id) => (
                <div key={id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center font-bold">T{id}</div>
                    <div className="text-sm font-bold">Tech #{id}</div>
                  </div>
                  <Badge variant="outline">Verified</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Push Notifications</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Email Reciepts</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}