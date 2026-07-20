import React from "react";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-base-content/50">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-base-200 bg-base-100">
        {children}
      </div>
    </div>
  );
}