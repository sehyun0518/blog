import { Info, Lightbulb, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@blog/utils/cn";

export type CalloutType = "info" | "tip" | "warning" | "danger";

interface CalloutConfig {
  icon: React.ElementType;
  label: string;
  className: string;
  iconClassName: string;
}

const CALLOUT_CONFIG: Record<CalloutType, CalloutConfig> = {
  info: {
    icon: Info,
    label: "Info",
    className: "border-blue-500/40 bg-blue-500/10 dark:bg-blue-500/15",
    iconClassName: "text-blue-500",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    className: "border-green-500/40 bg-green-500/10 dark:bg-green-500/15",
    iconClassName: "text-green-500",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    className: "border-yellow-500/40 bg-yellow-500/10 dark:bg-yellow-500/15",
    iconClassName: "text-yellow-500",
  },
  danger: {
    icon: AlertCircle,
    label: "Danger",
    className: "border-red-500/40 bg-red-500/10 dark:bg-red-500/15",
    iconClassName: "text-red-500",
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon: Icon, label, className, iconClassName } = CALLOUT_CONFIG[type];
  const heading = title ?? label;

  return (
    <aside
      role="note"
      aria-label={heading}
      className={cn("my-6 flex gap-3 rounded-lg border p-4", className)}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconClassName)} aria-hidden="true" />
      <div className="min-w-0 flex-1 text-sm leading-relaxed">
        <p className="mb-1 font-semibold text-foreground">{heading}</p>
        <div className="text-muted-foreground [&_p]:m-0">{children}</div>
      </div>
    </aside>
  );
}
