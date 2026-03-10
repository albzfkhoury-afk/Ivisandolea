export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  available: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export type PaymentMethod = "cash" | "whish";

export interface OrderPayment {
  method: PaymentMethod;
  whishReference?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: OrderCustomer;
  payment: OrderPayment;
  total: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: "food" | "drink";
}

export const CATEGORIES: Category[] = [
  { id: "salads", name: "Salads", type: "food" },
  { id: "appetizers", name: "Appetizers", type: "food" },
  { id: "tartines", name: "Tartines", type: "food" },
  { id: "pizzas", name: "Pizzas", type: "food" },
  { id: "sandwiches", name: "Sandwiches", type: "food" },
  { id: "platters", name: "Platters", type: "food" },
  { id: "desserts", name: "Desserts", type: "food" },
  { id: "classics", name: "Classics", type: "drink" },
  { id: "highball-fizzes", name: "Highball & Fizzes", type: "drink" },
  { id: "spirit-forward", name: "Spirit Forward", type: "drink" },
  { id: "boiler-makers", name: "Boiler Makers", type: "drink" },
  { id: "wine", name: "Wine", type: "drink" },
  { id: "beers-ciders", name: "Beers & Ciders", type: "drink" },
];
