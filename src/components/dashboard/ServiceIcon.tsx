import {
  HeartPulse,
  TrainFront,
  ShieldCheck,
  GraduationCap,
  TreePine,
  Users,
  Landmark,
  Banknote,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  HeartPulse,
  TrainFront,
  ShieldCheck,
  GraduationCap,
  TreePine,
  Users,
  Landmark,
  Banknote,
};

interface ServiceIconProps {
  iconName: string;
  className?: string;
}

export function ServiceIcon({ iconName, className }: ServiceIconProps) {
  const Icon = iconMap[iconName] || HelpCircle;
  return <Icon className={className} />;
}

