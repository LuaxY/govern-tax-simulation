import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  Landmark,
  ShieldCheck,
  TrainFront,
  TreePine,
  Users,
} from "lucide-react";

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

type ServiceIconProps = {
  iconName: string;
  className?: string;
};

export function ServiceIcon({ iconName, className }: ServiceIconProps) {
  const Icon = iconMap[iconName] || HelpCircle;
  return <Icon className={className} />;
}
