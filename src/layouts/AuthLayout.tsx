import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary-glow flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-stretch">
        <section className={cn('hidden md:flex flex-col justify-between rounded-2xl p-8 text-white shadow-elegant bg-gradient-hero')}>
          <header>
            <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">Ekic University</p>
            <h1 className="text-3xl font-bold leading-tight mb-3">
              Mitaboni&apos;s first fully digital university experience.
            </h1>
            <p className="text-sm text-white/80 max-w-md">
              Built for Kenyan students on real-world networks: mobile-first, offline-capable, and M-Pesa-ready from day one.
            </p>
          </header>
          <footer className="space-y-2 text-xs text-white/75">
            <p>
              “Welcome to Ekic University, a beacon of opportunity for Mitaboni and beyond.”
            </p>
            <p className="text-white/60">
              On your first login you&apos;ll see a welcome note from the President and a snapshot of what Ekic means for the local community.
            </p>
          </footer>
        </section>
        <section className="bg-card/95 backdrop-blur-md border border-white/5 rounded-2xl shadow-card p-6 md:p-8">
          {children}
        </section>
      </div>
    </div>
  );
}

