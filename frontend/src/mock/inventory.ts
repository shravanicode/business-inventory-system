// frontend/src/mock/inventory.ts

export type Product = {
  id: number;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  stockQuantity: number;
};

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Dell Inspiron Laptop 14\"",
    category: "Laptops",
    buyingPrice: 52000,
    sellingPrice: 62000,
    stockQuantity: 8,
  },
  {
    id: 2,
    name: "HP Pavilion Laptop 15\"",
    category: "Laptops",
    buyingPrice: 48000,
    sellingPrice: 58000,
    stockQuantity: 4, // low stock
  },
  {
    id: 3,
    name: "Samsung Galaxy A55",
    category: "Mobiles",
    buyingPrice: 26000,
    sellingPrice: 30500,
    stockQuantity: 12,
  },
  {
    id: 4,
    name: "Redmi Note 13 Pro",
    category: "Mobiles",
    buyingPrice: 19000,
    sellingPrice: 22999,
    stockQuantity: 3, // low stock
  },
  {
    id: 5,
    name: "Logitech Wireless Mouse M185",
    category: "Accessories",
    buyingPrice: 450,
    sellingPrice: 799,
    stockQuantity: 25,
  },
  {
    id: 6,
    name: "Dell Wireless Keyboard",
    category: "Accessories",
    buyingPrice: 900,
    sellingPrice: 1499,
    stockQuantity: 5, // border line
  },
  {
    id: 7,
    name: "Office Chair – Ergonomic",
    category: "Furniture",
    buyingPrice: 3200,
    sellingPrice: 4499,
    stockQuantity: 6,
  },
  {
    id: 8,
    name: "Gaming Chair – High Back",
    category: "Furniture",
    buyingPrice: 7200,
    sellingPrice: 9999,
    stockQuantity: 2, // low stock
  },
  {
    id: 9,
    name: "HP LaserJet Printer",
    category: "Printers",
    buyingPrice: 8200,
    sellingPrice: 10499,
    stockQuantity: 7,
  },
  {
    id: 10,
    name: "A4 Paper Pack (500 Sheets)",
    category: "Stationery",
    buyingPrice: 210,
    sellingPrice: 349,
    stockQuantity: 40,
  },
];
