import React from "react";

const DashboardPage: React.FC = () => {
  const totalRevenue = 185000;
  const ordersToday = 32;
  const avgOrderValue = Math.round(totalRevenue / ordersToday);
  const lowStockItems = 7;

  const recentSales = [
    { id: 1, invoice: "#INV-1023", customer: "Aarav Shah", total: 12500, time: "Today · 10:21" },
    { id: 2, invoice: "#INV-1022", customer: "Greenfield Stores", total: 58900, time: "Today · 09:10" },
    { id: 3, invoice: "#INV-1021", customer: "Urban Mart", total: 24300, time: "Yesterday" },
    { id: 4, invoice: "#INV-1020", customer: "Riya Desai", total: 8200, time: "2 days ago" },
  ];

  const topProducts = [
    { id: 1, name: "Premium rice 10kg", category: "Grocery", revenue: 82000, share: "32%" },
    { id: 2, name: "Sunflower oil 1L", category: "Grocery", revenue: 43000, share: "17%" },
    { id: 3, name: "Almonds 500g", category: "Dry fruits", revenue: 35500, share: "14%" },
    { id: 4, name: "Green tea pack", category: "Beverages", revenue: 24200, share: "9%" },
  ];

  return (
    <div className="page">
      {/* Header row */}
      <div className="dashboard-header-row">
        <div className="page-header">
          <h1>Overview</h1>
          <p>Daily snapshot of revenue, orders and inventory health.</p>
        </div>

        <div className="dashboard-header-actions">
          <div className="dashboard-pill-group">
            <button className="dashboard-pill dashboard-pill-muted">Today</button>
            <button className="dashboard-pill">This week</button>
            <button className="dashboard-pill">This month</button>
          </div>
          <button className="dashboard-export-btn">Download report</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Total revenue (today)</div>
          <div className="kpi-value">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="kpi-sub">From all recorded orders</div>
          <div className="kpi-trend kpi-trend-up">▲ 12.4% vs yesterday</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Orders</div>
          <div className="kpi-value">{ordersToday}</div>
          <div className="kpi-sub">Completed invoices</div>
          <div className="kpi-trend kpi-trend-neutral">→ Stable volume</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Avg. order value</div>
          <div className="kpi-value">
            ₹{avgOrderValue.toLocaleString("en-IN")}
          </div>
          <div className="kpi-sub">Across today&apos;s orders</div>
          <div className="kpi-trend kpi-trend-up">▲ 5.2% vs last week</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Low stock items</div>
          <div className="kpi-value kpi-danger">{lowStockItems}</div>
          <div className="kpi-sub">Need restock soon</div>
          <div className="kpi-trend kpi-trend-down">▼ Restocked yesterday</div>
        </div>
      </div>

      {/* Middle row: revenue overview + recent activity */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span>Revenue overview</span>
            <span className="card-meta">Sample chart · frontend only</span>
          </div>

          <div className="dashboard-mini-chart">
            <div className="dashboard-mini-chart-bars">
              <div className="chart-bar" style={{ height: "32%" }} />
              <div className="chart-bar" style={{ height: "52%" }} />
              <div className="chart-bar" style={{ height: "44%" }} />
              <div className="chart-bar chart-bar-accent" style={{ height: "78%" }} />
              <div className="chart-bar" style={{ height: "61%" }} />
              <div className="chart-bar" style={{ height: "55%" }} />
            </div>
            <div className="dashboard-mini-chart-legend">
              <span>Today</span>
              <span>Last 7 days</span>
            </div>
          </div>

          <div className="dashboard-summary-row">
            <div>
              <div className="summary-label">Today</div>
              <div className="summary-value">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <div className="summary-label">This week (est.)</div>
              <div className="summary-value">₹5,40,000</div>
            </div>
            <div>
              <div className="summary-label">Refund rate</div>
              <div className="summary-value">1.4%</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span>Recent activity</span>
            <span className="card-meta">Latest 4 invoices</span>
          </div>

          <ul className="list">
            {recentSales.map((s) => (
              <li key={s.id} className="activity-row">
                <div>
                  <div className="list-title">
                    {s.invoice} · {s.customer}
                  </div>
                  <div className="list-sub">{s.time}</div>
                </div>
                <div className="activity-amount">
                  ₹{s.total.toLocaleString("en-IN")}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom row: top products table */}
      <div className="card">
        <div className="card-header">
          <span>Top products by revenue</span>
          <span className="card-meta">Static demo data · no backend</span>
        </div>

        <table className="simple-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Revenue</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.revenue.toLocaleString("en-IN")}</td>
                <td>{p.share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
