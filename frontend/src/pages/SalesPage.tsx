import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockProducts, Product } from "../mock/inventory";

type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};

type PastOrder = {
  id: number;
  invoice: string;
  customer: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
};

const mockPastOrders: PastOrder[] = [
  {
    id: 1,
    invoice: "#INV-1019",
    customer: "Greenfield Stores",
    date: "02 Aug · 11:42",
    amount: 43200,
    status: "Paid",
  },
  {
    id: 2,
    invoice: "#INV-1018",
    customer: "Urban Mart",
    date: "01 Aug · 17:25",
    amount: 18990,
    status: "Paid",
  },
  {
    id: 3,
    invoice: "#INV-1017",
    customer: "Aarav Shah",
    date: "30 Jul · 12:07",
    amount: 8200,
    status: "Paid",
  },
  {
    id: 4,
    invoice: "#INV-1016",
    customer: "Riya Desai",
    date: "29 Jul · 09:18",
    amount: 15499,
    status: "Pending",
  },
];

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

const SalesPage: React.FC = () => {
  const [customerName, setCustomerName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNote, setOrderNote] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => mockProducts.find((p) => p.id === selectedProductId),
    [selectedProductId]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.product.sellingPrice * item.quantity,
        0
      ),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    if (quantity <= 0) {
      setFeedback("Quantity must be at least 1");
      return;
    }

    const existing = cart.find((item) => item.product.id === selectedProduct.id);

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        product: selectedProduct,
        quantity,
      };
      setCart((prev) => [...prev, newItem]);
    }

    setFeedback(null);
    setQuantity(1);
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = () => {
    if (!customerName.trim()) {
      setFeedback("Please enter a customer name");
      return;
    }
    if (cart.length === 0) {
      setFeedback("Add at least one product to the cart");
      return;
    }

    // Frontend-only: we just show a short success message.
    setFeedback(
      `Order draft created for ${customerName} · ${totalItems} items · ${formatCurrency(
        cartSubtotal
      )}`
    );

    // In real app you would send this data to the backend here.
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Sales &amp; new order</h1>
        <p>Create a new order, add items to cart and review recent invoices.</p>
      </div>

      {/* Top info row */}
      <div className="kpi-row" style={{ marginBottom: 16 }}>
        <div className="kpi-card">
          <div className="kpi-label">Active products</div>
          <div className="kpi-value">{mockProducts.length}</div>
          <div className="kpi-sub">Available in catalog</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Today&apos;s sales (sample)</div>
          <div className="kpi-value">{formatCurrency(185000)}</div>
          <div className="kpi-sub">Frontend-only sample data</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Recent invoices</div>
          <div className="kpi-value">{mockPastOrders.length}</div>
          <div className="kpi-sub">Last few orders in history</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Create new order */}
        <div className="card">
          <div className="card-header">
            <span>Create new order</span>
            <span className="card-meta">
              Draft only · no backend integration.
            </span>
          </div>

          <div className="sales-form">
            <div className="form-field">
              <label>Customer name</label>
              <input
                type="text"
                className="input"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Select product</label>
              <select
                className="input"
                value={selectedProductId === "" ? "" : selectedProductId}
                onChange={(e) =>
                  setSelectedProductId(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              >
                <option value="">Choose a product</option>
                {mockProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatCurrency(p.sellingPrice)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Quantity</label>
              <input
                type="number"
                min={1}
                className="input"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="form-field">
              <label>Notes (optional)</label>
              <textarea
                className="input"
                rows={3}
                placeholder="Add delivery or billing notes"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </div>

            {feedback && <div className="info-banner">{feedback}</div>}

            <div className="sales-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={handleAddToCart}
              >
                + Add to cart
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={handlePlaceOrder}
              >
                Save order draft
              </button>
            </div>

            <div className="sales-note">
              This page is frontend-only. When the backend is connected, this
              form can create live orders in the database.
            </div>
          </div>
        </div>

        {/* Cart + summary */}
        <div className="card">
          <div className="card-header">
            <span>Cart items</span>
            <span className="card-meta">
              {totalItems} items · {formatCurrency(cartSubtotal)}
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-state">
              <p>No items in cart</p>
              <span>
                Select a product, choose quantity and click &quot;Add to cart&quot;.
              </span>
            </div>
          ) : (
            <>
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style={{ width: 80 }}>Qty</th>
                    <th style={{ width: 120 }}>Price</th>
                    <th style={{ width: 120 }}>Amount</th>
                    <th style={{ width: 80 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const lineTotal =
                      item.product.sellingPrice * item.quantity;
                    return (
                      <tr key={item.id}>
                        <td>{item.product.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.product.sellingPrice)}</td>
                        <td>{formatCurrency(lineTotal)}</td>
                        <td>
                          <button
                            type="button"
                            className="table-link-danger"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="cart-summary-row">
                <div>
                  <div className="summary-label">Items</div>
                  <div className="summary-value">{totalItems}</div>
                </div>
                <div>
                  <div className="summary-label">Subtotal</div>
                  <div className="summary-value">
                    {formatCurrency(cartSubtotal)}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="recent-footer">
            <Link to="/products" className="link-button">
              View product inventory
            </Link>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <span>Recent sales activity</span>
          <span className="card-meta">Static sample data · no backend</span>
        </div>

        <table className="simple-table">
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
            {mockPastOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.invoice}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{formatCurrency(order.amount)}</td>
                <td>
                  <span
                    className={
                      order.status === "Paid"
                        ? "status-pill status-pill-success"
                        : "status-pill status-pill-warning"
                    }
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;
