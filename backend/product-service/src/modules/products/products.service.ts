import { products } from "./mock-data";
import { Product } from "./types";

export class ProductService {
  constructor(private _products: Product[] = products) {}

  getProductList(): Product[] {
    return this._products;
  }

  getProductById(id: string): Product | null {
    return this._products.filter((item) => item.id === id)?.[0] || null;
  }
}
