import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mockProducts } from "../mock/inventory";

/* ===============================
   Reusable StatCard component
   =============================== */

type Tone = "neutral" | "success" | "danger";
type TrendDirection = "up" | "down" | "flat";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  tone?: Tone;
  trendDirection?: TrendDirection;
  trendText?: string;
  onClick?: () => void;
}

const toneBorder: Record<Tone, string> = {
  neutral: "border-slate-200",
  success: "border-emerald-200",
  danger: "border-rose-200",
};

const pillTone: Record<Tone, string> = {
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
  onClick,
}) => {
  const borderClass = toneBorder[tone];
  const pillClass = pillTone[tone];
  const { icon, className: trendColor } = trendIconAndColor(trendDirection);

  const Base = onClick ? "button" : "div";

  return (
    <Base
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        // layout
        "group relative flex flex-col justify-between",
        "rounded-2xl border bg-white/80 px-4 py-3",
        // subtle shadow + hover
        "shadow-sm ring-1 ring-black/[0.02]",
        "transition-all duration-150 ease-out",
        "hover:-translate-y-0.5 hover:shadow-lg hover:bg-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10",
        // tone
        borderClass,
      ].join(" ")}
    >
      {/* Top row: label + trend chip */}
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
          {label}
        </div>

        {trendText && (
          <span
            className={[
              "inline-flex items-center gap-1 rounded-full border border-black/5",
              "px-2 py-0.5 text-[11px] font-medium",
              pillClass,
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

      {/* Bottom accent bar */}
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
    </Base>
  );
};

/* ===============================
   Dashboard page
   =============================== */

export default function DashboardPage() {
  const navigate = useNavigate();
  const lowStockThreshold = 5;

  const summary = useMemo(() => {
    const totalProducts = mockProducts.length;
    const lowStockCount = mockProducts.filter(
      (p) => p.stockQuantity <= lowStockThreshold
    ).length;

    // Static / mock values for portfolio
    const totalCustomers = 24;
    const salesAmount = 485000; // mock monthly sales
    const profitLoss = 82000; // mock profit

    return {
      totalProducts,
      lowStockCount,
      totalCustomers,
      salesAmount,
      profitLoss,
    };
  }, []);

  const handleProductsClick = () => navigate("/products");
  const handleLowStockClick = () => navigate("/products?filter=low-stock");
  const handleSalesClick = () => navigate("/sales");
  const handleCustomersClick = () => navigate("/customers");

  return (
    <div>
      {/* existing header classes from your CSS */}
      <div className="page-header">
        <h1 className="page-title">Inventory Management Dashboard</h1>
        <p className="page-subtitle">
          Overview of products, customers, sales performance and stock health.
        </p>
      </div>

      {/* TOP KPI ROW – modern SaaS-style cards */}
      <div className="mb-6 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Products"
          value={summary.totalProducts}
          subtitle="Active SKUs in catalog"
          tone="neutral"
          trendDirection="up"
          trendText="+3 this week"
          onClick={handleProductsClick}
        />

        <StatCard
          label="Customers"
          value={summary.totalCustomers}
          subtitle="Total unique customers"
          tone="neutral"
          trendDirection="up"
          trendText="+12% vs last month"
          onClick={handleCustomersClick}
        />

        <StatCard
          label="Sales amount"
          value={`₹${summary.salesAmount.toLocaleString("en-IN")}`}
          subtitle="This month (sample data)"
          tone="success"
          trendDirection="up"
          trendText="+18.4% growth"
          onClick={handleSalesClick}
        />

        <StatCard
          label="Profit / Loss"
          value={`₹${summary.profitLoss.toLocaleString("en-IN")}`}
          subtitle="After inventory cost (sample)"
          tone={summary.profitLoss >= 0 ? "success" : "danger"}
          trendDirection={summary.profitLoss >= 0 ? "up" : "down"}
          trendText={summary.profitLoss >= 0 ? "Healthy margin" : "Review pricing"}
        />

        <StatCard
          label="Low stock items"
          value={summary.lowStockCount}
          subtitle={`Below ${lowStockThreshold} units`}
          tone="danger"
          trendDirection={summary.lowStockCount > 0 ? "up" : "flat"}
          trendText={
            summary.lowStockCount > 0 ? "Restock recommended" : "All good"
          }
          onClick={handleLowStockClick}
        />
      </div>

      {/* खाली तुझं आधीचं बाकी dashboard code जसं आहे तसंच ठेव */}
      {/* उदाहरण: charts, tables, notifications इ. */}
    </div>
  );
      }
