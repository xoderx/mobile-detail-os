import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Building2, CreditCard, Users, Bell } from 'lucide-react';
export default function Settings() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your business operations and team.</p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your public detailing business profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input defaultValue="DetailFlow OS" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input defaultValue="support@detailflow.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Address</Label>
                <Input defaultValue="789 Detailing Way, Shine City, NY 10001" />
              </div>
              <Button className="bg-brand-600">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Base Pricing</CardTitle>
              <CardDescription>Manage the starting price for each vehicle category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {['Sedan', 'SUV', 'Truck', 'Luxury/Exotic'].map((cat) => (
                  <div key={cat} className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium">{cat}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">$</span>
                      <Input className="w-24 text-right" defaultValue="89" />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="bg-brand-600">Update Prices</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage your detailing technicians and dispatch roles.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((id) => (
                  <div key={id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center font-bold">T{id}</div>
                      <div>
                        <div className="font-bold">Technician #{id}</div>
                        <div className="text-xs text-muted-foreground">Level {id === 1 ? 'Senior' : 'Junior'}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed">Add New Member</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Hub</CardTitle>
              <CardDescription>Manage how you and your team receive job updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Job Alerts</Label>
                  <p className="text-xs text-muted-foreground">Alert technicians when a job is assigned.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Revenue Email</Label>
                  <p className="text-xs text-muted-foreground">Receive a summary of today's earnings at 9 PM.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}