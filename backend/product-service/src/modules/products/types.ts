export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type AvailableProduct = {
  count: number;
} & Product;
