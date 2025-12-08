export type Product = {
  id: number;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
};

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Dell Inspiron Laptop 14"',
    category: "Laptops",
    buyingPrice: 52000,
    sellingPrice: 62000,
    stock: 8,
  },
  {
    id: 2,
    name: "HP Pavilion Laptop 15",
    category: "Laptops",
    buyingPrice: 48000,
    sellingPrice: 58000,
    stock: 4,
  },
  {
    id: 3,
    name: "Samsung Galaxy A55",
    category: "Mobiles",
    buyingPrice: 26000,
    sellingPrice: 30500,
    stock: 12,
  },
  {
    id: 4,
    name: "Redmi Note 13 Pro",
    category: "Mobiles",
    buyingPrice: 19000,
    sellingPrice: 22999,
    stock: 3,
  },
  {
    id: 5,
    name: "Logitech Wireless Mouse M185",
    category: "Accessories",
    buyingPrice: 450,
    sellingPrice: 799,
    stock: 25,
  },
  {
    id: 6,
    name: "Dell Wireless Keyboard",
    category: "Accessories",
    buyingPrice: 900,
    sellingPrice: 1499,
    stock: 5,
  },
  {
    id: 7,
    name: "Office Chair – Ergonomic",
    category: "Furniture",
    buyingPrice: 3200,
    sellingPrice: 4499,
    stock: 6,
  },
  {
    id: 8,
    name: "Gaming Chair – High Back",
    category: "Furniture",
    buyingPrice: 7200,
    sellingPrice: 9999,
    stock: 2,
  },
  {
    id: 9,
    name: "HP LaserJet Printer",
    category: "Printers",
    buyingPrice: 8200,
    sellingPrice: 10499,
    stock: 7,
  },
  {
    id: 10,
    name: "A4 Paper Pack (500 Sheets)",
    category: "Stationery",
    buyingPrice: 210,
    sellingPrice: 349,
    stock: 40,
  },
];
