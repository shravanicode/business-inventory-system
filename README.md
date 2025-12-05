# Business Inventory & Sales Management System  
Full-stack inventory and sales management system built with **React (Vite + TypeScript)** on the frontend and **Spring Boot + H2 Database** on the backend.

This project demonstrates practical implementation of product management, sales tracking, stock updates, and real-time business metrics.

---

## 📌 Features

### 🔹 Frontend (React + Vite + TypeScript)
- Dashboard with:
  - Total Products
  - Low Stock Count
  - Monthly Revenue
- Products Page:
  - Product Listing Table
  - Category, Price, Stock View
  - Mock data fallback when backend not running
- Sales Page:
  - Product Dropdown
  - Quantity Selection
  - Auto Price Calculation
- Clean UI with simple responsive layout
- Modular folder-based architecture

---

### 🔹 Backend (Spring Boot + H2 Database)
- REST APIs:
  - `GET /api/products` – Fetch all active products
  - `GET /api/dashboard/summary` – Business metrics
  - `POST /api/sales` – Create new sales orders
- In-memory H2 Database (NO external DB required)
- Auto data seeding using DataInitializer
- JPA Entities:
  - Product
  - SalesOrder
  - SalesItem
- Automatic stock deduction after each sale
- CORS Enabled
- No API keys required

---

## 📂 Project Structure (Monorepo)

```
business-inventory-system/
│
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/inventory/...
│
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── pages/
        ├── api/
        └── mock/
```

---

## ⚙️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Axios
- CSS

### Backend
- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- H2 Database (in-memory)

---

## 🖥️ How to Run Locally

### 🔹 Backend

```bash
cd backend
mvn spring-boot:run
```

Backend URL:

```
http://localhost:8080
```

---

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

---

## 🧪 Sample API Endpoints

### Products  
```
GET /api/products
```

### Dashboard Summary  
```
GET /api/dashboard/summary
```

### Create New Sale  
```
POST /api/sales
```

Request Body:

```json
{
  "customerName": "John Doe",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

---

## 🚀 Future Enhancements
- JWT Authentication  
- Admin Panel  
- Advanced Product Search  
- PDF Invoice Generator  
- MySQL/PostgreSQL Integration  
- Graph-based Analytics Dashboard  

---

## 📜 License
MIT License

---

## 👤 Author
**Business Inventory & Sales Management System**  
Developed as a full-stack portfolio project using modern web technologies.
