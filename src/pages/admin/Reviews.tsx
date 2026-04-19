import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Star, MessageSquare, Trash2, CheckCircle2, MoreHorizontal, 
  TrendingUp, StarOff, Loader2, Quote
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { toast } from 'sonner';
export default function Reviews() {
  const queryClient = useQueryClient();
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api<any>('/api/stats'),
  });
  const { data: feedbackData, isLoading } = useQuery({
    queryKey: ['feedback'],
    queryFn: () => api<{ items: any[] }>('/api/feedback'),
  });
  const updateFeedback = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      api(`/api/feedback/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      toast.success('Feedback node updated');
    }
  });
  const deleteFeedback = useMutation({
    mutationFn: (id: string) => api(`/api/feedback/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      toast.success('Feedback node purged');
    }
  });
  const reviews = feedbackData?.items ?? [];
  const avgRating = stats?.satisfactionScore ?? 0;
  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Center</h1>
          <p className="text-muted-foreground">Monitor brand sentiment and feature high-impact testimonials.</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-primary/10 text-primary border-2 border-primary/20 px-4 py-2 font-black text-[10px] tracking-widest uppercase">
            <Star className="h-3 w-3 mr-2 fill-primary" /> {avgRating} Global Average
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-ice border-2 border-border/50 rounded-3xl shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sentiment Index</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-black tracking-tighter">ELITE</div>
             <p className="text-[10px] text-emerald-600 font-black uppercase mt-2">Optimal Brand Health</p>
           </CardContent>
        </Card>
        <Card className="glass-ice border-2 border-border/50 rounded-3xl shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Transmissions</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-black tracking-tighter">{reviews.length}</div>
             <p className="text-[10px] text-primary font-black uppercase mt-2">Incoming Feed Active</p>
           </CardContent>
        </Card>
        <Card className="glass-ice border-2 border-border/50 rounded-3xl shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conversion Impact</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-black tracking-tighter">+18.4%</div>
             <p className="text-[10px] text-muted-foreground font-black uppercase mt-2">Review-to-Booking Lift</p>
           </CardContent>
        </Card>
      </div>
      <div className="border-2 border-border/50 rounded-3xl bg-background shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-black uppercase text-[10px] tracking-widest py-5">Intel Profile</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Rating</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Observations</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Deployment Date</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
              <TableHead className="text-right pr-6 w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               Array.from({ length: 3 }).map((_, i) => (
                 <TableRow key={i}><TableCell colSpan={6} className="h-20 animate-pulse bg-muted/10"></TableCell></TableRow>
               ))
            ) : reviews.map((review) => (
              <TableRow key={review.id} className="group hover:bg-muted/20 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-xs text-primary border border-primary/10">SC</div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-tight">Fleet Entity {review.id.slice(0, 4)}</div>
                      <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">ID: {review.id.slice(-6)}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`h-3 w-3 ${idx < review.rating ? 'text-primary fill-primary' : 'text-muted/50'}`} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                   <p className="text-xs font-bold text-foreground line-clamp-2 italic uppercase">"{review.comment}"</p>
                </TableCell>
                <TableCell className="text-[10px] font-black uppercase text-muted-foreground opacity-60">
                   {format(new Date(review.createdAt), 'MMM d, HH:mm')}
                </TableCell>
                <TableCell>
                  {review.featured ? (
                    <Badge className="bg-emerald-500 text-[8px] font-black px-2 h-5 tracking-widest uppercase border-none">FEATURED</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[8px] font-black px-2 h-5 tracking-widest uppercase border-slate-200">QUEUED</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                      <DropdownMenuItem 
                        className="cursor-pointer gap-2 font-bold text-xs uppercase"
                        onClick={() => updateFeedback.mutate({ id: review.id, payload: { featured: !review.featured } })}
                      >
                        {review.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                        {review.featured ? 'Unfeature Asset' : 'Feature Asset'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer gap-2 font-bold text-xs uppercase text-destructive"
                        onClick={() => deleteFeedback.mutate(review.id)}
                      >
                        <Trash2 className="h-4 w-4" /> Purge Intel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}