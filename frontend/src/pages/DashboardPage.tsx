import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mockProducts } from "../mock/inventory";

/* ===============================
   Types & mock data for dashboard
   =============================== */

type Sale = {
  id: number;
  productId: number;
  productName: string;
  customerName: string;
  units: number;
  amount: number;
};

type DashboardCustomer = {
  id: number;
  name: string;
};

const mockCustomers: DashboardCustomer[] = [
  { id: 1, name: "99Store" },
  { id: 2, name: "MK Tech" },
  { id: 3, name: "Rajesh Kumar" },
  { id: 4, name: "Atul Ltd." },
  { id: 5, name: "Amit" },
];

const mockSales: Sale[] = [
  {
    id: 1,
    productId: 1,
    productName: "Dell Inspiron Laptop 14\"",
    customerName: "99Store",
    units: 2,
    amount: 120000,
  },
  {
    id: 2,
    productId: 2,
    productName: "HP Pavilion Laptop 15\"",
    customerName: "MK Tech",
    units: 3,
    amount: 75000,
  },
  {
    id: 3,
    productId: 3,
    productName: "Office Chair – Ergonomic",
    customerName: "Rajesh Kumar",
    units: 4,
    amount: 28000,
  },
  {
    id: 4,
    productId: 4,
    productName: "HP LaserJet Printer",
    customerName: "99Store",
    units: 1,
    amount: 18000,
  },
  {
    id: 5,
    productId: 5,
    productName: "Logitech Wireless Mouse M185",
    customerName: "Amit",
    units: 5,
    amount: 15000,
  },
];

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
  trendSeries?: number[]; // mini graph data (0–100 scale)
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
  trendSeries,
  onClick,
}) => {
  const borderClass = toneBorder[tone];
  const pillClass = pillTone[tone];
  const { icon, className: trendColor } = trendIconAndColor(trendDirection);

  const Base: any = onClick ? "button" : "div";

  const barColor =
    tone === "success"
      ? "bg-emerald-400/80 group-hover:bg-emerald-500"
      : tone === "danger"
      ? "bg-rose-400/80 group-hover:bg-rose-500"
      : "bg-slate-400/80 group-hover:bg-slate-500";

  return (
    <Base
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        "group relative flex flex-col justify-between",
        "rounded-2xl border bg-white/80 px-4 py-3",
        "shadow-sm ring-1 ring-black/[0.02]",
        "transition-all duration-150 ease-out",
        "hover:-translate-y-0.5 hover:shadow-lg hover:bg-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10",
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

      {/* Main value + mini graph side-by-side */}
      <div className="mb-0.5 flex items-end justify-between gap-2">
        <div className="text-2xl font-semibold tabular-nums text-slate-900">
          {value}
        </div>

        {/* Mini bar graph (sparkline style) */}
        {trendSeries && trendSeries.length > 0 && (
          <div className="flex h-10 w-16 items-end gap-[2px] opacity-80">
            {trendSeries.map((v, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-full ${barColor}`}
                style={{
                  height: `${6 + v * 0.6}px`, // 0–100 → approx 6–66px
                  transition: "height 220ms ease-out",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="mt-0.5 text-xs text-slate-500">{subtitle}</div>
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
    const totalCustomers = mockCustomers.length;

    const lowStockCount = mockProducts.filter(
      (p) => p.stockQuantity <= lowStockThreshold
    ).length;

    const totalStockValue = mockProducts.reduce(
      (sum, p) => sum + p.stockQuantity * p.buyingPrice,
      0
    );

    const totalSalesAmount = mockSales.reduce(
      (sum, s) => sum + s.amount,
      0
    );

    const purchaseAmount = totalStockValue;
    const profitLoss = totalSalesAmount - purchaseAmount;

    const productMap = new Map<string, { units: number; amount: number }>();
    mockSales.forEach((sale) => {
      const key = sale.productName;
      const existing = productMap.get(key) || { units: 0, amount: 0 };
      existing.units += sale.units;
      existing.amount += sale.amount;
      productMap.set(key, existing);
    });

    const topProducts = Array.from(productMap.entries())
      .map(([name, v]) => ({ name, units: v.units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    const customerMap = new Map<string, number>();
    mockSales.forEach((sale) => {
      const key = sale.customerName;
      customerMap.set(key, (customerMap.get(key) || 0) + sale.amount);
    });

    const topCustomers = Array.from(customerMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const stockBars = mockProducts.map((p) => ({
      name: p.name,
      stock: p.stockQuantity,
    }));

    const lowStockNotifications = mockProducts
      .filter((p) => p.stockQuantity <= lowStockThreshold)
      .map(
        (p) =>
          `${p.name} needs re-order. Stock: ${p.stockQuantity} units.`
      );

    return {
      totalProducts,
      totalCustomers,
      lowStockCount,
      totalStockValue,
      totalSalesAmount,
      purchaseAmount,
      profitLoss,
      topProducts,
      topCustomers,
      stockBars,
      lowStockNotifications,
    };
  }, []);

  const handleProductsClick = () => navigate("/products");
  const handleLowStockClick = () => navigate("/products?filter=low-stock");
  const handleSalesClick = () => navigate("/sales");
  const handleCustomersClick = () => navigate("/customers");

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Inventory Management Dashboard</h1>
        <p className="page-subtitle">
          Overview of products, customers, sales performance and stock health.
        </p>
      </div>

      {/* TOP KPI ROW – SaaS-style cards with mini graph */}
      <div className="mb-6 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Products"
          value={summary.totalProducts}
          subtitle="Active SKUs in catalog"
          tone="neutral"
          trendDirection="up"
          trendText="+3 this week"
          trendSeries={[30, 45, 55, 60, 72, 80]} // mini graph
          onClick={handleProductsClick}
        />

        <StatCard
          label="Customers"
          value={summary.totalCustomers}
          subtitle="Total unique customers"
          tone="neutral"
          trendDirection="up"
          trendText="+12% vs last month"
          trendSeries={[20, 25, 32, 40, 48, 52]}
          onClick={handleCustomersClick}
        />

        <StatCard
          label="Sales amount"
          value={`₹${summary.totalSalesAmount.toLocaleString("en-IN")}`}
          subtitle="This month (sample data)"
          tone="success"
          trendDirection="up"
          trendText="+18.4% growth"
          trendSeries={[10, 40, 55, 70, 85, 100]}
          onClick={handleSalesClick}
        />

        <StatCard
          label="Profit / Loss"
          value={`₹${summary.profitLoss.toLocaleString("en-IN")}`}
          subtitle="After inventory cost (sample)"
          tone={summary.profitLoss >= 0 ? "success" : "danger"}
          trendDirection={summary.profitLoss >= 0 ? "up" : "down"}
          trendText={summary.profitLoss >= 0 ? "Healthy margin" : "Review pricing"}
          trendSeries={[15, 30, 35, 50, 58, 65]}
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
          trendSeries={[60, 45, 40, 35, 30, 25]}
          onClick={handleLowStockClick}
        />
      </div>

      {/* MAIN GRID – charts + stock + customers + notifications */}
      <div className="dashboard-main-grid">
        <div className="dashboard-main-column">
          {/* Top products */}
          <div className="card chart-card">
            <div className="chart-title">Top 5 selling products</div>
            <div className="chart-body">
              {summary.topProducts.map((item) => (
                <div className="chart-row" key={item.name}>
                  <div className="chart-label">{item.name}</div>
                  <div className="chart-bar">
                    <div
                      className="chart-bar-fill"
                      style={{ width: `${item.units * 10}%` }}
                    />
                  </div>
                  <div className="chart-value">{item.units}</div>
                </div>
              ))}
              {summary.topProducts.length === 0 && (
                <div className="chart-empty">No sales data yet.</div>
              )}
            </div>
          </div>

          {/* Stock available */}
          <div className="card chart-card">
            <div className="chart-title">Stock available</div>
            <div className="chart-body">
              {summary.stockBars.map((item) => (
                <div className="chart-row" key={item.name}>
                  <div className="chart-label">{item.name}</div>
                  <div className="chart-bar">
                    <div
                      className="chart-bar-fill chart-bar-fill-stock"
                      style={{ width: `${item.stock * 5}%` }}
                    />
                  </div>
                  <div className="chart-value">{item.stock}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDE COLUMN */}
        <div className="dashboard-side-column">
          {/* Top customers */}
          <div className="card chart-card">
            <div className="chart-title">Top customers</div>
            <div className="chart-body">
              {summary.topCustomers.map((item) => (
                <div className="chart-row" key={item.name}>
                  <div className="chart-label">{item.name}</div>
                  <div className="chart-bar">
                    <div
                      className="chart-bar-fill chart-bar-fill-customers"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="chart-value">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
              {summary.topCustomers.length === 0 && (
                <div className="chart-empty">No customer data yet.</div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="card notifications-card">
            <div className="chart-title">Notifications</div>
            <div className="notifications-body">
              {summary.lowStockNotifications.length === 0 && (
                <div className="notification-item">
                  All products are healthy on stock.
                </div>
              )}
              {summary.lowStockNotifications.map((msg, idx) => (
                <div className="notification-item" key={idx}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="alert-bar" style={{ marginTop: 20 }}>
        Data is currently based on sample products and sample sales. When the
        backend is connected, this dashboard can read live metrics from the
        database.
      </div>
    </div>
  );
}
