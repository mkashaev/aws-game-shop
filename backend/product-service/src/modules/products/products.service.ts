import { availableProducts, products } from "./mock-data";
import { AvailableProduct, Product } from "./types";

export class ProductService {
  constructor(
    private _products: Product[] = products,
    private _availableProducts: AvailableProduct[] = availableProducts
  ) {}

  getProductList(): Product[] {
    return this._products;
  }

  getProductById(id: string): Product | null {
    return this._products.filter((item) => item.id === id)?.[0] || null;
  }

  getAvailableProducts(): AvailableProduct[] {
    return this._availableProducts;
  }
}
