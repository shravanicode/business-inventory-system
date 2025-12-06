import { useState, useMemo } from "react";
import { mockProducts } from "../mock/inventory";

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
};

export default function SalesPage() {
  const [selectedId, setSelectedId] = useState<number>(mockProducts[0]?.id ?? 1);
  const [qty, setQty] = useState<number>(1);
  const [customer, setCustomer] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const product = mockProducts.find((p) => p.id === selectedId);
  const currentTotal = product ? product.sellingPrice * qty : 0;

  const { itemsInCart, unitsInCart, grandTotal } = useMemo(() => {
    const items = cart.length;
    const units = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.lineTotal, 0);
    return { itemsInCart: items, unitsInCart: units, grandTotal: total };
  }, [cart]);

  const handleAddToCart = () => {
    if (!product || qty <= 0) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        const updated = prev.map((i) =>
          i.id === product.id
            ? {
                ...i,
                quantity: i.quantity + qty,
                lineTotal: (i.quantity + qty) * i.price,
              }
            : i
        );
        return updated;
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          quantity: qty,
          price: product.sellingPrice,
          lineTotal: product.sellingPrice * qty,
        },
      ];
    });

    setQty(1);
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCompleteSale = () => {
    if (!cart.length) return;
    // Placeholder – future: send to backend API
    alert("Sale recorded (frontend demo).");
    setCart([]);
    setCustomer("");
    setQty(1);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Sales</h1>
        <p className="page-subtitle">
          Build a quick order, review the cart and record the sale.
        </p>
      </div>

      {/* KPI row similar to dashboard */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-label">Items in cart</div>
          <div className="card-value">{itemsInCart}</div>
        </div>
        <div className="card">
          <div className="card-label">Units in cart</div>
          <div className="card-value">{unitsInCart}</div>
        </div>
        <div className="card">
          <div className="card-label">Current order total</div>
          <div className="card-value">₹{grandTotal}</div>
        </div>
      </div>

      {/* Main two-column sales layout */}
      <div className="sales-layout">
        {/* Left: order form */}
        <div className="form-card">
          <div className="form-title">New order</div>

          <div className="form-field">
            <label className="form-label">Customer name</label>
            <input
              className="form-input"
              placeholder="Enter customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Product</label>
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

          <button className="add-to-cart-button" onClick={handleAddToCart}>
            <span>＋</span>
            Add to cart
          </button>

          <div style={{ marginTop: 18 }}>
            <span className="form-label">Current line total</span>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              ₹{currentTotal}
            </div>
          </div>
        </div>

        {/* Right: cart summary */}
        <div className="form-card">
          <div className="form-title">Cart items</div>

          {cart.length === 0 ? (
            <p className="cart-empty">No items in cart yet.</p>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price}</td>
                        <td>₹{item.lineTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span className="form-label">Grand total</span>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      marginTop: 4,
                    }}
                  >
                    ₹{grandTotal}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={handleClearCart}
                  >
                    Clear cart
                  </button>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={handleCompleteSale}
                  >
                    Complete sale
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
    }
