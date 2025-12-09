// src/pages/ProductsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { mockProducts, Product } from "../mock/inventory";
import { fetchProductsFromBackend } from "../api/products";
import "../styles/products.css"; //

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- Load products from backend ----------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const backendProducts = await fetchProductsFromBackend();

        if (backendProducts.length > 0) {
          setProducts(backendProducts);
        } else {
          // backend empty -> fallback to mock
          setProducts(mockProducts);
        }
      } catch (err) {
        console.error("Error loading products", err);
        setError("Could not load products. Showing sample data.");
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Which list to show
  const displayProducts: Product[] = products ?? mockProducts;

  // Small metrics like top bar cards
  const totalProducts = displayProducts.length;
  const lowStockCount = displayProducts.filter((p) => p.stock <= 5).length;

  const totalStockValue = useMemo(
    () =>
      displayProducts.reduce(
        (sum, p) => sum + p.sellingPrice * p.stock,
        0
      ),
    [displayProducts]
  );

  return (
    <div className="page-root">
      <header className="page-header">
        <div>
          <h1 className="page-title">Product inventory</h1>
          <p className="page-subtitle">
            Search, review and manage items available in the store.
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn-outline">Open sales</button>
          <button className="btn-primary">+ Add product</button>
        </div>
      </header>

      {/* Top stat cards */}
      <section className="product-stats">
        <div className="stat-card">
          <div className="stat-label">Total products</div>
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-caption">Items in catalogue</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low stock</div>
          <div className="stat-value">{lowStockCount}</div>
          <div className="stat-caption">Stock ≤ 5 units</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Stock value</div>
          <div className="stat-value">
            ₹{totalStockValue.toLocaleString("en-IN")}
          </div>
          <div className="stat-caption">Based on selling price</div>
        </div>
      </section>

      {/* Search + summary line */}
      <section className="product-toolbar">
        <div className="product-summary">
          {displayProducts.length} products · {lowStockCount} low stock
        </div>
        <input
          className="search-input"
          placeholder="Search by name or category"
        />
      </section>

      {/* Table */}
      <section className="product-table-card">
        {loading && (
          <div className="table-status">Loading products from server…</div>
        )}
        {error && <div className="table-status warning">{error}</div>}

        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Buying price</th>
              <th>Selling price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.buyingPrice.toLocaleString("en-IN")}</td>
                <td>₹{p.sellingPrice.toLocaleString("en-IN")}</td>
                <td className={p.stock <= 5 ? "stock-low" : ""}>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-footer">
          This page is using data from{" "}
          {products ? "the database (backend)" : "sample mock data"}. When the
          backend is connected fully, this table can display live products from
          the database.
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
