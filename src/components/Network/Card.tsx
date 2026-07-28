import type { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
  return <div className="bg-base-200 rounded-box p-4 border border-base-300">{children}</div>;
}