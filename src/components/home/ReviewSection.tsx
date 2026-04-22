import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Star, Send, MessageSquare, ShieldCheck, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function ReviewSection() {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: feedbackData } = useQuery({
    queryKey: ['feedback-public'],
    queryFn: () => api<{ items: any[] }>('/api/feedback'),
  });
  const featured = feedbackData?.items?.filter(f => f.featured) || [];
  const submitFeedback = useMutation({
    mutationFn: (data: any) => api('/api/feedback', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback-public'] });
      toast.success('Frequency Transmitted. Thank you for the Intel.');
      setComment('');
      setRating(5);
    }
  });
  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    submitFeedback.mutate({ rating, comment });
  };
  return (
    <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,191,255,0.05),transparent)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                <MessageSquare className="h-3.5 w-3.5" /> <span>Customer Intel</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-shimmer">
                Fleet Status
              </h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-loose opacity-70 max-w-lg">
                The collective verdict from the elite fleet. Deploy your feedback to the command center.
              </p>
            </div>
            <form onSubmit={handleRatingSubmit} className="glass-ice p-10 rounded-[3rem] border-white/5 space-y-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="space-y-4 relative z-10">
                 <label className="text-[10px] font-black uppercase tracking-widest text-primary block mb-2">Service Rating</label>
                 <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-all active:scale-90"
                      >
                        <Star className={cn(
                          "h-10 w-10 transition-all",
                          (hover || rating) >= star ? "text-primary fill-primary drop-shadow-[0_0_10px_rgba(0,191,255,0.4)]" : "text-slate-800"
                        )} />
                      </button>
                    ))}
                 </div>
               </div>
               <div className="space-y-4 relative z-10">
                 <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Observations</label>
                 <Textarea
                   value={comment}
                   onChange={(e) => setComment(e.target.value)}
                   placeholder="TRANSMIT YOUR EXPERIENCE..."
                   className="min-h-[120px] bg-slate-900/50 border-2 border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest focus:border-primary transition-all p-6 placeholder:text-slate-700"
                 />
               </div>
               <Button
                 type="submit"
                 disabled={submitFeedback.isPending || !comment.trim()}
                 className="w-full h-20 bg-primary text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-95 border-t border-white/20"
               >
                 {submitFeedback.isPending ? 'Transmitting...' : <><Send className="h-5 w-5 mr-3" /> Transmit Intel</>}
               </Button>
               <div className="flex items-center justify-center gap-3 text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] pt-4">
                  <ShieldCheck className="h-3 w-3" /> Encrypted Transmission
               </div>
            </form>
          </div>
          <div className="space-y-12">
             <div className="grid grid-cols-1 gap-8">
               {featured.length > 0 ? featured.map((f, i) => (
                 <motion.div
                   key={f.id}
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="relative"
                 >
                   <div className="absolute -top-4 -left-4 text-primary opacity-20">
                     <Quote className="h-16 w-16" />
                   </div>
                   <Card className="glass-ice border-white/10 rounded-[2.5rem] p-10 relative z-10 overflow-hidden group">
                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <CardContent className="p-0 space-y-6">
                        <div className="flex gap-1">
                          {Array.from({ length: f.rating }).map((_, idx) => (
                            <Star key={idx} className="h-4 w-4 text-primary fill-primary animate-crackle" />
                          ))}
                        </div>
                        <p className="text-lg md:text-xl font-black uppercase tracking-tight leading-snug text-white italic">
                          "{f.comment}"
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-xs text-primary">SC</div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">Fleet Member</p>
                                <p className="text-[8px] text-primary font-black uppercase tracking-[0.2em]">Verified Client</p>
                              </div>
                           </div>
                           <Badge variant="outline" className="text-[8px] font-black text-slate-500 border-slate-800 uppercase tracking-widest h-5">NODE_LOG: {f.id.slice(0, 4)}</Badge>
                        </div>
                     </CardContent>
                   </Card>
                 </motion.div>
               )) : (
                 <div className="p-20 text-center border-4 border-dashed border-slate-800 rounded-[3rem] opacity-30">
                    <MessageSquare className="h-12 w-12 mx-auto mb-6 text-slate-700" />
                    <p className="font-black uppercase tracking-[0.3em] text-slate-600">Awaiting External Signals</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}