// src/pages/DashboardPage.tsx
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

// Fallback sales used when backend is not available
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

const DashboardPage: React.FC = () => {
  // animation flag for mini chart
  const [animateChart, setAnimateChart] = useState(false);

  // state that will hold REAL data if backend works
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [loading, setLoading] = useState<boolean>(true);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  // 1) small delay so chart animates smoothly
  useEffect(() => {
    const t = setTimeout(() => setAnimateChart(true), 150);
    return () => clearTimeout(t);
  }, []);

  // 2) fetch from backend on first load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ping overview endpoint to check backend
        const [productsRes, salesRes] = await Promise.all([
          api.get<Product[]>("/api/products"),
          api.get<Sale[]>("/api/sales/recent"),
        ]);

        if (Array.isArray(productsRes.data) && productsRes.data.length > 0) {
          setProducts(productsRes.data);
        }

        if (Array.isArray(salesRes.data) && salesRes.data.length > 0) {
          setSales(salesRes.data);
        }

        setBackendOnline(true);
      } catch (err) {
        // fallback: keep mock data, but do not break UI
        console.error("Dashboard: falling back to mock data", err);
        setBackendOnline(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ------- Derived metrics from CURRENT state (real or mock) -------

  const totalProducts = products.length;

  const lowStockItems = useMemo(
    () => products.filter((p) => p.stock <= 5).length,
    [products]
  );

  const todayRevenue = useMemo(
    () => sales.reduce((sum, sale) => sum + sale.amount, 0),
    [sales]
  );

  const averageOrderValue =
    sales.length > 0 ? Math.round(todayRevenue / sales.length) : 0;

  const totalOrders = sales.length;

  const topProductsByValue = useMemo(() => {
    // simple "sellingPrice * stock" metric
    const ranked = products.map((p) => ({
      product: p,
      value: p.sellingPrice * p.stock,
    }));

    ranked.sort((a, b) => b.value - a.value);
    return ranked.slice(0, 5);
  }, [products]);

  const revenueChangeVsYesterday = +12.4; // static for now
  const avgOrderChangeVsLastWeek = +5.2; // static for now
  const lowStockChange = -1; // static indicator

  return (
    <div className="page page-dashboard">
      <header className="page-header">
        <div>
          <h1 className="page-title">Inventory Management Dashboard</h1>
          <p className="page-subtitle">
            Overview of products, customers, purchases, sales and stock value.
          </p>
          {!loading && (
            <p className="page-subtitle subtle">
              Data source:{" "}
              <span className={backendOnline ? "tag-success" : "tag-muted"}>
                {backendOnline ? "Live database" : "Sample demo data"}
              </span>
            </p>
          )}
        </div>

        <div className="page-header-actions">
          <button className="btn btn-outline">This week</button>
          <button className="btn btn-outline">This month</button>
          <button className="btn btn-primary">Download report</button>
        </div>
      </header>

      {/* KPI summary row */}
      <section className="dashboard-kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Total revenue (today)</div>
          <div className="kpi-value">
            ₹{todayRevenue.toLocaleString("en-IN")}
          </div>
          <div className="kpi-meta">
            From all recorded orders •{" "}
            <span className="trend trend-up">
              ▲ {revenueChangeVsYesterday}% vs yesterday
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Orders</div>
          <div className="kpi-value">{totalOrders}</div>
          <div className="kpi-meta">
            Completed invoices •{" "}
            <span className="trend trend-neutral">Stable volume</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Avg. order value</div>
          <div className="kpi-value">
            ₹{averageOrderValue.toLocaleString("en-IN")}
          </div>
          <div className="kpi-meta">
            Across today&apos;s orders •{" "}
            <span className="trend trend-up">
              ▲ {avgOrderChangeVsLastWeek}% vs last week
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Low stock items</div>
          <div className="kpi-value">{lowStockItems}</div>
          <div className="kpi-meta">
            Need restock soon •{" "}
            <span className="trend trend-down">
              {lowStockChange >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(lowStockChange)} vs yesterday
            </span>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <section className="dashboard-grid">
        {/* Revenue chart */}
        <article className="card card-lg">
          <header className="card-header">
            <div>
              <h2 className="card-title">Revenue overview</h2>
              <p className="card-subtitle">
                Sample chart · frontend only (ready for live data).
              </p>
            </div>
            <div className="chip-group">
              <button className="chip chip-active">Today</button>
              <button className="chip">This week</button>
              <button className="chip">This month</button>
            </div>
          </header>

          <div className="mini-area-chart">
            {revenueTrendSample.map((value, index) => (
              <div
                key={index}
                className={
                  "mini-area-bar" +
                  (animateChart ? " mini-area-bar-animate" : "")
                }
                style={{ height: `${value}%` }}
              />
            ))}
          </div>

          <footer className="card-footer">
            <div className="kpi-inline">
              <span className="kpi-inline-label">Today</span>
              <span className="kpi-inline-value">
                ₹{todayRevenue.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="kpi-inline">
              <span className="kpi-inline-label">This week (est.)</span>
              <span className="kpi-inline-value">₹5,40,000</span>
            </div>
            <div className="kpi-inline">
              <span className="kpi-inline-label">Refund rate</span>
              <span className="kpi-inline-value">1.4%</span>
            </div>
          </footer>
        </article>

        {/* Recent invoices */}
        <article className="card card-lg">
          <header className="card-header">
            <div>
              <h2 className="card-title">Recent invoices</h2>
              <p className="card-subtitle">Latest recorded sales.</p>
            </div>
            <Link to="/sales" className="link-muted">
              View all
            </Link>
          </header>

          <div className="table-wrapper">
            <table className="table table-compact">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.invoice}</td>
                    <td>{sale.customer}</td>
                    <td>{sale.date}</td>
                    <td className="text-right">
                      ₹{sale.amount.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span
                        className={
                          "status-pill " +
                          (sale.status === "Paid"
                            ? "status-pill-success"
                            : "status-pill-warning")
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
        <article className="card card-lg card-full-width">
          <header className="card-header">
            <div>
              <h2 className="card-title">Top products by stock value</h2>
              <p className="card-subtitle">
                Based on selling price × current stock.
              </p>
            </div>
            <Link to="/products" className="link-muted">
              View products
            </Link>
          </header>

          <div className="table-wrapper">
            <table className="table table-compact">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th className="text-right">Selling price</th>
                  <th className="text-right">Stock</th>
                  <th className="text-right">Stock value</th>
                </tr>
              </thead>
              <tbody>
                {topProductsByValue.map(({ product, value }) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td className="text-right">
                      ₹{product.sellingPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="text-right">{product.stock}</td>
                    <td className="text-right">
                      ₹{value.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
};

export default DashboardPage;
