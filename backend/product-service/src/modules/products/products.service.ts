import { DynamoDB } from "aws-sdk";
import { availableProducts, products } from "./mock-data";
import { AvailableProduct, Product } from "./types";

export class ProductService {
  productTableName: string;
  stocksTableName: string;
  _db: DynamoDB.DocumentClient;

  constructor(
    private _products: Product[] = products,
    private _availableProducts: AvailableProduct[] = availableProducts
  ) {
    this.productTableName = process.env.PRODUCTS_TABLE_NAME;
    this.stocksTableName = process.env.STOCKS_TABLE_NAME;

    this._db = new DynamoDB.DocumentClient();
  }

  async getProductList(): Promise<Product[]> {
    const params = {
      TableName: this.productTableName,
    };

    const result = await this._db.scan(params).promise();
    return result.Items as Product[];
  }

  async getProductById(id: string): Promise<Product | null> {
    // return this._products.filter((item) => item.id === id)?.[0] || null;
    const productParams = {
      TableName: this.productTableName,
      Key: {
        id,
      },
    };

    const stockParams = {
      TableName: this.stocksTableName,
      Key: {
        product_id: id,
      },
    };

    const productPromise = this._db.query(productParams).promise();
    const stockPromise = this._db.query(stockParams).promise();

    const result = await Promise.all([productPromise, stockPromise]);

    return result.Items[0] as Product;
  }

  getAvailableProducts(): AvailableProduct[] {
    const products = this.getProductList();
    return this._availableProducts;
  }
}
