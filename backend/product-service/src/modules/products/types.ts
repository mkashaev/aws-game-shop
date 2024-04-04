export type ProductPut = {
  title: string;
  description: string;
  price: number;
};

export type Product = {
  id: string;
} & ProductPut;

export type AvailableProduct = {
  count: number;
} & Product;

export type Stock = {
  product_id: string;
  count: number;
};
