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
    <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
        <span className="text-xs text-[var(--color-text-muted)]">{events.length} events</span>
      </div>

      <ol className="relative border-l border-[var(--color-border-subtle)]">
        {events.map((ev, idx) => (
          <li key={ev.id} className="mb-6 ml-6">
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)] ring-4 ring-[var(--color-bg-elevated)]">
              <Clock className="h-3 w-3" />
            </span>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{ev.status}</p>
                {ev.note && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{ev.note}</p>}
              </div>
              <time className="text-xs text-[var(--color-text-muted)]">{new Date(ev.timestamp).toLocaleString()}</time>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
