import React from "react";

export default function DashboardPage() {
  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "15px" }}>
        <div style={{ background: "white", padding: 20 }}>
          Total Products: 20
        </div>
        <div style={{ background: "white", padding: 20 }}>
          Low Stock: 3
        </div>
        <div style={{ background: "white", padding: 20 }}>
          Monthly Revenue: ₹1,20,000
        </div>
      </div>
    </div>
  );
        }
