import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { mockProducts, Product } from "../mock/inventory";

type Sale = {
  id: number;
  invoice: string;
  customer: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
};

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

const DashboardPage: React.FC = () => {
  // --------- derived numbers from mock data ----------

  const totalProducts = mockProducts.length;

  const lowStockItems = useMemo(
    () => mockProducts.filter((p) => p.stock <= 5).length,
    []
  );

  const todayRevenue = useMemo(
    () => mockSales.reduce((sum, sale) => sum + sale.amount, 0),
    []
  );

  const averageOrderValue =
    mockSales.length > 0 ? Math.round(todayRevenue / mockSales.length) : 0;

  const ordersToday = mockSales.length;

  const totalStockValue = useMemo(
    () =>
      mockProducts.reduce(
        (sum, product) => sum + product.sellingPrice * product.stock,
        0
      ),
    []
  );

  return (
    <main className="page">
      {/* PAGE HEADER */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Inventory Management Dashboard</h1>
          <p className="page-subtitle">
            Overview of products, orders, stock health and daily sales in one
            place.
          </p>
          <p className="page-subtitle subtle">
            Data source: sample demo data. Once the backend is connected, this
            dashboard can read live metrics from the database.
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-outline-sm">Download report</button>
        </div>
      </header>

      {/* TOP STRIP – KPI CARDS (same style as products page strip) */}
      <section className="summary-strip">
        <div className="summary-card">
          <div className="summary-label">Total revenue (today)</div>
          <div className="summary-value">
            ₹{todayRevenue.toLocaleString("en-IN")}
          </div>
          <div className="summary-meta">From all recorded orders</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Orders</div>
          <div className="summary-value">{ordersToday}</div>
          <div className="summary-meta">Completed invoices</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Avg. order value</div>
          <div className="summary-value">
            ₹{averageOrderValue.toLocaleString("en-IN")}
          </div>
          <div className="summary-meta">Across today&apos;s orders</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Low stock items</div>
          <div className="summary-value">{lowStockItems}</div>
          <div className="summary-meta">Need restock soon</div>
        </div>
      </section>

      {/* REVENUE OVERVIEW (SIMPLE PLACEHOLDER, LIKE “Sample chart” TEXT) */}
      <section className="card">
        <header className="card-header">
          <div>
            <h2 className="card-title">Revenue overview</h2>
            <p className="card-meta">
              Sample chart – frontend only (ready for live data).
            </p>
          </div>
          <div className="card-header-actions pill-toggle">
            <button className="pill pill-active">Today</button>
            <button className="pill">This week</button>
            <button className="pill">This month</button>
          </div>
        </header>

        <div className="revenue-placeholder">
          <div className="revenue-row">
            <span className="revenue-label">Today</span>
            <span className="revenue-value">
              ₹{todayRevenue.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="revenue-row">
            <span className="revenue-label">This week (est.)</span>
            <span className="revenue-value">
              ₹{(todayRevenue * 5).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="revenue-row">
            <span className="revenue-label">Refund rate</span>
            <span className="revenue-value">1.4%</span>
          </div>
        </div>
      </section>

      {/* RECENT INVOICES TABLE – SAME STYLE AS PRODUCT TABLE */}
      <section className="card">
        <header className="card-header">
          <div>
            <h2 className="card-title">Recent invoices</h2>
            <p className="card-meta">Latest recorded sales.</p>
          </div>
          <div className="card-header-actions">
            <Link to="/sales" className="link-sm">
              View all
            </Link>
          </div>
        </header>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockSales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.invoice}</td>
                  <td>{sale.customer}</td>
                  <td>{sale.date}</td>
                  <td>₹{sale.amount.toLocaleString("en-IN")}</td>
                  <td>
                    <span
                      className={
                        sale.status === "Paid"
                          ? "status-pill status-success"
                          : "status-pill status-warning"
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
      </section>

      {/* TOP PRODUCTS BY STOCK VALUE – LOOKS LIKE YOUR PRODUCT TABLE */}
      <section className="card">
        <header className="card-header">
          <div>
            <h2 className="card-title">Top products by stock value</h2>
            <p className="card-meta">
              Based on selling price × current stock.
            </p>
          </div>
          <div className="card-header-actions">
            <Link to="/products" className="link-sm">
              View products
            </Link>
          </div>
        </header>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Selling price</th>
                <th>Stock</th>
                <th>Stock value</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product: Product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{product.sellingPrice.toLocaleString("en-IN")}</td>
                  <td>{product.stock}</td>
                  <td>
                    ₹{(product.sellingPrice * product.stock).toLocaleString(
                      "en-IN"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="card-footer">
        
        </footer>
      </section>
    </main>
  );
};

export default DashboardPage;
