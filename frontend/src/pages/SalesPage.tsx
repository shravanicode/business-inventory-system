import { useState } from "react";
import { mockProducts } from "../mock/inventory";

export default function SalesPage() {
  const [selectedId, setSelectedId] = useState<number>(mockProducts[0]?.id ?? 1);
  const [qty, setQty] = useState<number>(1);
  const [customer, setCustomer] = useState<string>("");

  const product = mockProducts.find((p) => p.id === selectedId);
  const total = product ? product.sellingPrice * qty : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sales Order</h1>
        <p className="page-subtitle">
          Create a new order and review cart items before recording the sale.
        </p>
      </div>

      <div className="sales-layout">
        <div className="form-card">
          <div className="form-title">Create New Order</div>

          <div className="form-field">
            <label className="form-label">Customer Name</label>
            <input
              className="form-input"
              placeholder="Enter customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Select Product</label>
            <select
              className="form-select"
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {mockProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Quantity</label>
            <input
              className="form-input"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
            />
          </div>

          <button className="add-to-cart-button">
            <span>＋</span>
            Add to Cart
          </button>

          <div style={{ marginTop: "18px" }}>
            <span className="form-label">Total Amount</span>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
              ₹{total}
            </div>
          </div>
        </div>

        <div className="form-card">
          <div className="form-title">Cart Items</div>
          <p className="cart-empty">No items in cart</p>
        </div>
      </div>
    </div>
  );
}
