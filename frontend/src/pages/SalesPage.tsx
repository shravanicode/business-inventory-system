import React, { useState } from "react";
import { mockProducts } from "../mock/inventory";

export default function SalesPage() {
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(1);

  const product = mockProducts.find((p) => p.id === selected);

  return (
    <div>
      <h2>New Sale</h2>

      <div>
        <label>Product:</label>
        <select onChange={(e) => setSelected(Number(e.target.value))}>
          {mockProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <h3>
        Total: ₹
        {product ? product.sellingPrice * quantity : 0}
      </h3>
    </div>
  );
        }
