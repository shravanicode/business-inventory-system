import React, { useMemo, useState } from "react";
import { mockProducts } from "../mock/inventory";
import { Link } from "react-router-dom";

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const lowStockCount = useMemo(
    () => mockProducts.filter((p) => p.stock <= 5).length,
    []
  );

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return mockProducts;

    const term = search.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Product inventory</h1>
          <p>Search, review and manage items available in the store.</p>
        </div>
        <div className="header-actions">
          <Link to="/sales" className="secondary-btn">
            Open sales
          </Link>
          <button className="primary-btn">+ Add product</button>
        </div>
      </div>

      {/* Small summary row */}
      <div className="kpi-row" style={{ marginBottom: 12 }}>
        <div className="kpi-card">
          <div className="kpi-label">Total products</div>
          <div className="kpi-value">{mockProducts.length}</div>
          <div className="kpi-sub">Items in catalog</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Low stock</div>
          <div className="kpi-value">{lowStockCount}</div>
          <div className="kpi-sub">Stock ≤ 5 units</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Search status</div>
          <div className="kpi-value">{filteredProducts.length}</div>
          <div className="kpi-sub">Matching current filter</div>
        </div>
      </div>

      {/* Search + table */}
      <div className="card">
        <div className="products-header-row">
          <div className="products-summary">
            {mockProducts.length} products · {lowStockCount} low stock
          </div>

          <div className="products-search">
            <input
              type="text"
              className="input"
              placeholder="Search by name or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="simple-table">
          <thead>
            <tr>
              <th style={{ minWidth: 210 }}>Name</th>
              <th>Category</th>
              <th>Buying price</th>
              <th>Selling price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{formatCurrency(p.buyingPrice)}</td>
                <td>{formatCurrency(p.sellingPrice)}</td>
                <td
                  style={
                    p.stock <= 5
                      ? { color: "#b91c1c", fontWeight: 600 }
                      : undefined
                  }
                >
                  {p.stock}
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                  No products found for this search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="products-footer-note">
          This page is using mock data. Once the backend is connected, this
          table can display live products from the database.
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
