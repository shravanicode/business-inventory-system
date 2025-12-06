import React from "react";

type Tone = "neutral" | "success" | "danger";
type TrendDirection = "up" | "down" | "flat";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  tone?: Tone;
  trendDirection?: TrendDirection;
  trendText?: string;
  className?: string;
  onClick?: () => void;
}

const toneClasses: Record<Tone, string> = {
  neutral: "border-slate-200",
  success: "border-emerald-200",
  danger: "border-rose-200",
};

const pillToneClasses: Record<Tone, string> = {
  neutral: "bg-slate-50 text-slate-700",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-rose-50 text-rose-700",
};

const trendIconAndColor = (
  direction: TrendDirection | undefined
): { icon: string; className: string } => {
  switch (direction) {
    case "up":
      return { icon: "↑", className: "text-emerald-600" };
    case "down":
      return { icon: "↓", className: "text-rose-600" };
    case "flat":
    default:
      return { icon: "→", className: "text-slate-500" };
  }
};

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  tone = "neutral",
  trendDirection = "flat",
  trendText,
  className = "",
  onClick,
}) => {
  const toneBorder = toneClasses[tone];
  const pillTone = pillToneClasses[tone];
  const { icon, className: trendColor } = trendIconAndColor(trendDirection);

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        "group relative flex flex-col justify-between rounded-2xl border bg-white/80",
        "px-4 py-3 shadow-sm ring-1 ring-black/[0.02]",
        "transition-all duration-150 ease-out",
        "hover:-translate-y-0.5 hover:shadow-lg hover:bg-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10",
        toneBorder,
        className,
      ].join(" ")}
    >
      {/* Top row: label + trend pill */}
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
          {label}
        </div>

        {trendText && (
          <span
            className={[
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              "border border-black/5",
              pillTone,
            ].join(" ")}
          >
            <span className={trendColor}>{icon}</span>
            <span>{trendText}</span>
          </span>
        )}
      </div>

      {/* Main value */}
      <div className="mb-0.5 text-2xl font-semibold tabular-nums text-slate-900">
        {value}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="mt-0.5 text-xs text-slate-500">
          {subtitle}
        </div>
      )}

      {/* Subtle bottom accent bar */}
      <div className="pointer-events-none mt-3 h-0.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={[
            "h-full w-1/2 rounded-full bg-gradient-to-r",
            tone === "success" && "from-emerald-400/90 to-emerald-500/80",
            tone === "danger" && "from-rose-400/90 to-rose-500/80",
            tone === "neutral" && "from-slate-400/70 to-slate-500/70",
            "transition-all duration-300 group-hover:w-4/5",
          ].join(" ")}
        />
      </div>
    </Component>
  );
};

export default StatCard;
