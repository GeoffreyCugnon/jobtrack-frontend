// src/components/layout/PageContainer.tsx
import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`w-full max-w-5xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}