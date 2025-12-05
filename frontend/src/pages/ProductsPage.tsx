import React from "react";
import { mockProducts } from "../mock/inventory";

export default function ProductsPage() {
  return (
    <div>
      <h2>Products</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Selling Price</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {mockProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹{p.sellingPrice}</td>
              <td>{p.stockQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
                }
