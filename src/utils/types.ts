
export interface Product {
  id: string;
  name: string;
  category: string;
  price?: number;
  quantity: number;
  checked: boolean;
  unit: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  products: Omit<Product, 'quantity' | 'checked'>[];
}
