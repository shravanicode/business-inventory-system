// frontend/src/pages/DashboardPage.tsx

import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

type Product = {
  id: number | string;
  name: string;
  category: string;
  buying_price: number;
  selling_price: number;
  stock: number;
};

type Sale = {
  id: number | string;
  invoice: string;
  customer: string;
  amount: number;
  status: "Paid" | "Pending" | string;
  created_at?: string;
};

const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productsResult, salesResult] = await Promise.allSettled([
          api.get<Product[]>("/products"),
          api.get<Sale[]>("/sales"), // if not implemented yet, this will fail gracefully
        ]);

        if (productsResult.status === "fulfilled") {
          setProducts(productsResult.value.data || []);
        } else {
          console.error("Failed to load products:", productsResult.reason);
        }

        if (salesResult.status === "fulfilled") {
          setSales(salesResult.value.data || []);
        } else {
          console.warn(
            "Sales API not available yet. Sales KPIs will show 0 by default."
          );
          setSales([]);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // -------- Derived metrics from live data --------

  const totalProducts = useMemo(
    () => products.length,
    [products]
  );

  const lowStockItems = useMemo(
    () => products.filter((p) => Number(p.stock) <= 5).length,
    [products]
  );

  const inventoryValue = useMemo(
    () =>
      products.reduce(
        (sum, p) => sum + Number(p.selling_price || 0) * Number(p.stock || 0),
        0
      ),
    [products]
  );

  const totalRevenue = useMemo(
    () => sales.reduce((sum, s) => sum + Number(s.amount || 0), 0),
    [sales]
  );

  const totalOrders = useMemo(() => sales.length, [sales]);

  const avgOrderValue = useMemo(
    () =>
      sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0,
    [totalRevenue, sales.length]
  );

  const recentSales = useMemo(
    () => sales.slice(0, 5),
    [sales]
  );

  const topProducts = useMemo(() => {
    const ranked = products
      .map((p) => ({
        product: p,
        value:
          Number(p.selling_price || 0) *
          Number(p.stock || 0),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return ranked;
  }, [products]);

  const revenueTrendSample = useMemo(() => {
    if (sales.length === 0) {
      return [32, 48, 44, 52, 61, 55];
    }
    const buckets = [0, 0, 0, 0, 0, 0];
    sales.forEach((s, index) => {
      const bucketIndex = index % buckets.length;
      buckets[bucketIndex] += Number(s.amount || 0);
    });
    const max = Math.max(...buckets, 1);
    return buckets.map((v) => Math.round((v / max) * 100));
  }, [sales]);

  // -------- UI rendering --------

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">Loading dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Top header */}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Inventory overview</h1>
          <p className="dashboard-subtitle">
            Live inventory, sales snapshots and low stock insights powered by your
            connected database.
          </p>
        </div>
        <div className="dashboard-header-actions">
          <Link to="/sales" className="primary-cta">
            New invoice
          </Link>
          <Link to="/products" className="ghost-cta">
            View products
          </Link>
        </div>
      </header>

      {/* KPI grid */}
      <section className="dashboard-kpi-grid">
        <div className="kpi-card kpi-card-primary">
          <div className="kpi-label">Total products</div>
          <div className="kpi-value">{totalProducts}</div>
          <div className="kpi-subtext">
            {lowStockItems} items are currently in low stock
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Inventory value</div>
          <div className="kpi-value">
            ₹{inventoryValue.toLocaleString("en-IN")}
          </div>
          <div className="kpi-subtext">
            Calculated from selling price × live stock levels
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Total revenue</div>
          <div className="kpi-value">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="kpi-subtext">
            Based on sales records available in the system
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Orders</div>
          <div className="kpi-value">{totalOrders}</div>
          <div className="kpi-subtext">
            Avg. order value ₹{avgOrderValue.toLocaleString("en-IN")}
          </div>
        </div>
      </section>

      {/* Middle layout: revenue trend + top products */}
      <section className="dashboard-main-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Revenue trend</h2>
            <span className="panel-tag">Live snapshot</span>
          </div>
          <p className="panel-subtitle">
            Relative revenue distribution across recent sales entries.
          </p>

          <div className="mini-chart">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none">
              {revenueTrendSample.map((value, index) => {
                const x = (index / (revenueTrendSample.length - 1 || 1)) * 100;
                const y = 40 - (value / 100) * 30 - 5;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={1.5}
                    className="mini-chart-dot"
                  />
                );
              })}
              {revenueTrendSample.length > 1 && (
                <polyline
                  fill="none"
                  className="mini-chart-line"
                  points={revenueTrendSample
                    .map((value, index) => {
                      const x =
                        (index / (revenueTrendSample.length - 1 || 1)) * 100;
                      const y = 40 - (value / 100) * 30 - 5;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              )}
            </svg>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Top value products</h2>
          </div>
          <p className="panel-subtitle">
            Ranked by selling price × current stock quantity.
          </p>

          <div className="top-products-list">
            {topProducts.length === 0 && (
              <div className="empty-state">
                No products found. Add products to see rankings here.
              </div>
            )}

            {topProducts.map(({ product, value }) => (
              <div className="top-product-row" key={product.id}>
                <div className="top-product-main">
                  <div className="top-product-avatar">
                    {String(product.name).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="top-product-name">{product.name}</div>
                    <div className="top-product-meta">
                      {product.category} • Stock: {product.stock}
                    </div>
                  </div>
                </div>
                <div className="top-product-value">
                  ₹{value.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom: recent sales */}
      <section className="dashboard-bottom-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent sales</h2>
            <Link to="/sales" className="panel-link">
              View all
            </Link>
          </div>
          <p className="panel-subtitle">
            Latest recorded invoices from your sales register.
          </p>

          {recentSales.length === 0 ? (
            <div className="empty-state">
              No sales records available yet. New invoices will appear here.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.invoice}</td>
                      <td>{sale.customer}</td>
                      <td>₹{Number(sale.amount).toLocaleString("en-IN")}</td>
                      <td>
                        <span
                          className={
                            sale.status === "Paid"
                              ? "status-pill status-pill-success"
                              : "status-pill status-pill-warning"
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
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
