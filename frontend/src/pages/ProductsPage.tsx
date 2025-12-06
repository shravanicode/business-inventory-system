import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { mockProducts } from "../mock/inventory";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();

  const lowStockThreshold = 5;
  const filterParam = searchParams.get("filter");
  const lowStockFilterActive = filterParam === "low-stock";

  const totalProducts = mockProducts.length;
  const lowStockCount = mockProducts.filter(
    (p) => p.stockQuantity <= lowStockThreshold
  ).length;
  const totalStockValue = mockProducts.reduce(
    (sum, p) => sum + p.stockQuantity * p.buyingPrice,
    0
  );

  const filteredProducts = useMemo(() => {
    const base = lowStockFilterActive
      ? mockProducts.filter((p) => p.stockQuantity <= lowStockThreshold)
      : mockProducts;

    if (!search.trim()) return base;

    const q = search.toLowerCase();
    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [lowStockFilterActive, search]);

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">
          Search, filter and review all items in your inventory.
        </p>
      </div>

      {/* KPI row – similar style to dashboard */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-label">Total products</div>
          <div className="card-value">{totalProducts}</div>
        </div>
        <div className="card">
          <div className="card-label">Low stock items</div>
          <div className="card-value">{lowStockCount}</div>
        </div>
        <div className="card">
          <div className="card-label">Inventory value</div>
          <div className="card-value">
            ₹{totalStockValue.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {lowStockFilterActive && (
        <div className="products-filter-banner">
          Showing only low stock items (≤ {lowStockThreshold} units). Clear the
          filter to view all products.
        </div>
      )}

      {/* Main products card */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <div className="section-title">Product inventory</div>
            <p
              style={{
                marginTop: 4,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              {totalProducts} products · {lowStockCount} low stock
            </p>
          </div>

          <div className="section-actions">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search by name or category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="primary-button" type="button">
              <span>＋</span> Add product
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Buying price</th>
                <th>Selling price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isLow = p.stockQuantity <= lowStockThreshold;
                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.buyingPrice.toLocaleString("en-IN")}</td>
                    <td>₹{p.sellingPrice.toLocaleString("en-IN")}</td>
                    <td className={isLow ? "stock-low" : ""}>
                      {p.stockQuantity}
                    </td>
                    <td>
                      <span className="badge-status">
                        {isLow ? "Low stock" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-button" type="button">
                          ✏️
                        </button>
                        <button className="icon-button" type="button">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ paddingTop: 12, fontSize: 13 }}>
                    No products found.
                    {lowStockFilterActive && " Try clearing the low stock filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
                }
