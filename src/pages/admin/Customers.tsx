import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Mail, Phone, MoreHorizontal, UserPlus, Users2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api<{ items: any[] }>('/api/customers'),
  });
  const customers = customersData?.items ?? [];
  const filteredCustomers = customers.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Relations</h1>
          <p className="text-muted-foreground">Manage service history and customer lifetime value.</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700 h-11">
          <UserPlus className="h-4 w-4 mr-2" /> New Client
        </Button>
      </div>
      <div className="flex items-center gap-4 bg-background p-3 rounded-xl border shadow-sm sticky top-20 z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, email, or phone..."
            className="pl-10 h-10 border-none shadow-none focus-visible:ring-1 focus-visible:ring-brand-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-10">Export CSV</Button>
      </div>
      <div className="border rounded-xl bg-background shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold py-4">Customer Name</TableHead>
                <TableHead className="font-bold">Contact Details</TableHead>
                <TableHead className="font-bold">Last Detail</TableHead>
                <TableHead className="font-bold">Total LTV</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="w-[80px] text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="h-16 animate-pulse bg-muted/10"></TableCell>
                  </TableRow>
                ))
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/30 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs border border-brand-100 shadow-sm">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <div className="font-bold text-foreground">
                          {customer.firstName} {customer.lastName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" /> {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {customer.lastServiceDate ? format(new Date(customer.lastServiceDate), 'MMM d, yyyy') : 'No History'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-brand-600">$1,240.00</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 uppercase font-bold px-2 py-0.5">
                        Active Client
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="cursor-pointer">View Profile</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Booking History</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-brand-600 font-bold">New Appointment</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive cursor-pointer">Archive Client</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 bg-muted/5">
                    <div className="flex flex-col items-center gap-3">
                       <Users2 className="h-10 w-10 text-muted-foreground opacity-20" />
                       <div className="text-muted-foreground">No customers found matching your search.</div>
                       <Button variant="link" onClick={() => setSearchTerm('')}>Clear search</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}