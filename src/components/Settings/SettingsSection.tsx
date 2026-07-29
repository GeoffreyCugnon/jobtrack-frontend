import type { ReactNode } from "react";
import { SectionCard } from "../Layout/SectionCard";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <SectionCard title={title} collapsible={false}>
      <div className="-m-4">{children}</div>
    </SectionCard>
  );
}
