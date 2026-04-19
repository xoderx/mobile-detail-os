import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Snowflake, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export function GallerySection() {
  const { data: config } = useQuery({
    queryKey: ['config'],
    queryFn: () => api<any>('/api/cms/config'),
  });
  const gallery = config?.gallery || [];
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 ice-crack-pattern opacity-[0.03] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Camera className="h-3.5 w-3.5" /> <span>Visual Archive</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-shimmer">
            Detail Show
          </h2>
          <p className="text-muted-foreground text-xs font-black uppercase tracking-widest opacity-60">
            Real deployments. Precision results. Stone Cold standard.
          </p>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {gallery.map((item: any, idx: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group rounded-[2rem] overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all shadow-lg hover:shadow-2xl"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 flex flex-col justify-end">
                <div className="glass-ice p-6 rounded-2xl border-white/20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <Badge className="bg-primary text-[8px] font-black uppercase tracking-widest mb-3 h-5 border-none">
                    {item.category}
                  </Badge>
                  <h3 className="text-white text-lg font-black uppercase tracking-tight leading-none mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-primary text-[8px] font-black uppercase tracking-widest mt-3">
                    <Snowflake className="h-3 w-3 animate-crackle" /> Verified Frozen Finish
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}