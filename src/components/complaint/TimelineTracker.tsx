"use client";

import { Clock } from "lucide-react";

type TimelineEvent = {
  id: string;
  status: string;
  timestamp: string; // ISO
  note?: string;
};

type Props = {
  events: TimelineEvent[];
  title?: string;
};

export default function TimelineTracker({ events, title = "Case timeline" }: Props) {
  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <span className="text-xs text-slate-400">{events.length} events</span>
      </div>

      <ol className="relative border-l border-white/5">
        {events.map((ev, idx) => (
          <li key={ev.id} className="mb-6 ml-6">
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white ring-4 ring-white/5">
              <Clock className="h-3 w-3" />
            </span>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{ev.status}</p>
                {ev.note && <p className="mt-1 text-xs text-slate-400">{ev.note}</p>}
              </div>
              <time className="text-xs text-slate-400">{new Date(ev.timestamp).toLocaleString()}</time>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
