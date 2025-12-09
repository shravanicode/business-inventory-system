import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { mockProducts, Product } from "../mock/inventory";

type Sale = {
  id: number;
  invoice: string;
  customer: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
};

// ---------- MOCK SALES (frontend-only right now) ----------
const mockSales: Sale[] = [
  {
    id: 1,
    invoice: "#INV-1023",
    customer: "Aarav Shah",
    date: "Today · 10:21",
    amount: 12500,
    status: "Paid",
  },
  {
    id: 2,
    invoice: "#INV-1022",
    customer: "Greenfield Stores",
    date: "Today · 09:10",
    amount: 58900,
    status: "Paid",
  },
  {
    id: 3,
    invoice: "#INV-1021",
    customer: "Urban Mart",
    date: "Yesterday",
    amount: 24800,
    status: "Paid",
  },
  {
    id: 4,
    invoice: "#INV-1020",
    customer: "Riya Desai",
    date: "2 days ago",
    amount: 8200,
    status: "Pending",
  },
];

const revenueTrendSample = [32, 52, 44, 78, 61, 55];

// ---------- TYPES FOR OPTIONAL BACKEND RESPONSE ----------
type DashboardApiResponse = {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  lowStockItems: number;
  revenueTrend: number[];
  recentSales: Sale[];
  products: Product[];
};

// ---------- HELPER: BUILD METRICS FROM MOCK DATA ----------
function buildMockMetrics(): DashboardApiResponse {
  const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalOrders = mockSales.length;
  const averageOrderValue =
    mockSales.length > 0 ? Math.round(totalRevenue / mockSales.length) : 0;

  const lowStockItems = mockProducts.filter((p) => p.stock <= 5).length;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    lowStockItems,
    revenueTrend: revenueTrendSample,
    recentSales: mockSales,
    products: mockProducts,
  };
}

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardApiResponse | null>(null);
  const [usingMock, setUsingMock] = useState(true);
  const [loading, setLoading] = useState(true);

  // ---------- TRY BACKEND → FALLBACK TO MOCK ----------
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // backend ready /api/dashboard implement
        const response = await api.get<DashboardApiResponse>("/api/dashboard");
        const data = response.data;

        setMetrics({
          ...data,
          revenueTrend:
            data.revenueTrend && data.revenueTrend.length > 0
              ? data.revenueTrend
              : revenueTrendSample,
        });
        setUsingMock(false);
      } catch (error) {
        // backend route/ error
        const mock = buildMockMetrics();
        setMetrics(mock);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // metrics load basic fallback
  const current = metrics ?? buildMockMetrics();

  const topProductsByValue = useMemo(() => {
    return [...current.products]
      .map((p) => ({
        ...p,
        stockValue: p.sellingPrice * p.stock,
      }))
      .sort((a, b) => b.stockValue - a.stockValue)
      .slice(0, 5);
  }, [current.products]);

  // ---------- SIMPLE MINI CHART BARS ----------
  const maxTrend = Math.max(...current.revenueTrend, 1);

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Inventory Management Dashboard</h1>
          <p className="page-subtitle">
            Overview of products, customers, purchases, sales and stock value.
          </p>
          <p className="page-meta">
            Data source:{" "}
            {usingMock ? "Sample demo data (frontend only)" : "Live database"}
          </p>
        </div>

        <div className="period-toggle">
          <button className="chip chip-active">This week</button>
          <button className="chip">This month</button>
          <button className="chip chip-outline">Download report</button>
        </div>
      </div>

      {/* ---------- TOP KPI ROW ---------- */}
      <section className="kpi-row">
        <article className="kpi-card">
          <div className="kpi-label">Total revenue (today)</div>
          <div className="kpi-value">
            ₹{current.totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="kpi-caption">from all recorded orders</div>
        </article>

        <article className="kpi-card">
          <div className="kpi-label">Orders</div>
          <div className="kpi-value">{current.totalOrders}</div>
          <div className="kpi-caption">Completed invoices</div>
        </article>

        <article className="kpi-card">
          <div className="kpi-label">Avg. order value</div>
          <div className="kpi-value">
            ₹{current.averageOrderValue.toLocaleString("en-IN")}
          </div>
          <div className="kpi-caption">Across today&apos;s orders</div>
        </article>

        <article className="kpi-card">
          <div className="kpi-label">Low stock items</div>
          <div className="kpi-value">{current.lowStockItems}</div>
          <div className="kpi-caption">Need restock soon</div>
        </article>
      </section>

      {/* ---------- MAIN GRID ---------- */}
      <section className="dashboard-grid">
        {/* Revenue overview */}
        <article className="panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Revenue overview</h2>
              <p className="panel-subtitle">
                Sample chart – currently frontend only. When the backend is
                connected, this graph can read live data.
              </p>
            </div>
            <div className="panel-tabs">
              <button className="chip chip-active">Today</button>
              <button className="chip">This week</button>
              <button className="chip">This month</button>
            </div>
          </header>

          <div className="mini-chart">
            {current.revenueTrend.map((value, index) => {
              const height = (value / maxTrend) * 100;
              return (
                <div key={index} className="mini-chart-bar-wrapper">
                  <div
                    className="mini-chart-bar"
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>

          <footer className="panel-footer">
            <span>Today ₹{current.totalRevenue.toLocaleString("en-IN")}</span>
            <span>This week (est.) ₹5,40,000</span>
            <span>Refund rate 1.4%</span>
          </footer>
        </article>

        {/* Recent invoices */}
        <article className="panel">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Recent invoices</h2>
              <p className="panel-subtitle">Latest recorded sales.</p>
            </div>
            <button className="link-button">View all</button>
          </header>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th className="numeric">Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {current.recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.invoice}</td>
                    <td>{sale.customer}</td>
                    <td>{sale.date}</td>
                    <td className="numeric">
                      ₹{sale.amount.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span
                        className={
                          sale.status === "Paid"
                            ? "badge badge-success"
                            : "badge badge-warning"
                        }
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Top products by stock value */}
        <article className="panel panel-full-width">
          <header className="panel-header">
            <div>
              <h2 className="panel-title">Top products by stock value</h2>
              <p className="panel-subtitle">
                Based on selling price × current stock.
              </p>
            </div>
            <Link to="/products" className="link-button">
              View products
            </Link>
          </header>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th className="numeric">Selling price</th>
                  <th className="numeric">Stock</th>
                  <th className="numeric">Stock value</th>
                </tr>
              </thead>
              <tbody>
                {topProductsByValue.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td className="numeric">
                      ₹{p.sellingPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="numeric">{p.stock}</td>
                    <td className="numeric">
                      ₹{(p.sellingPrice * p.stock).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-pill">Loading dashboard…</div>
        </div>
      )}
    </main>
  );
};

export default DashboardPage;
