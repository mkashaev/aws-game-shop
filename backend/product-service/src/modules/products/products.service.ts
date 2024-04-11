import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuid4 } from "uuid";
import { AvailableProduct, Product, ProductPut, Stock } from "./types";

export class ProductService {
  static dbInstance: DynamoDBClient;

  private _productTableName: string;
  private _stocksTableName: string;
  private _db: DynamoDBClient;

  constructor({
    db = new DynamoDBClient(),
    productTableName = process.env.PRODUCTS_TABLE_NAME,
    stocksTableName = process.env.STOCKS_TABLE_NAME,
  }) {
    this._productTableName = productTableName;
    this._stocksTableName = stocksTableName;

    if (ProductService.dbInstance) {
      this._db = ProductService.dbInstance;
    } else {
      ProductService.dbInstance = db;
      this._db = db;
    }
  }

  async getProductList(): Promise<Product[]> {
    const params: ScanCommandInput = {
      TableName: this._productTableName,
    };

    const result = await this._db.send(new ScanCommand(params));
    return result.Items.map((item) => unmarshall(item)) as Product[];
  }

  async getStockListAssoc(): Promise<Record<string, Stock>> {
    const params: ScanCommandInput = {
      TableName: this._stocksTableName,
    };

    const result = await this._db.send(new ScanCommand(params));
    const stocks = result.Items.map((item) => unmarshall(item)) as Stock[];

    const assocMap = {};

    stocks.forEach((stock) => {
      assocMap[stock.product_id] = stock;
    });

    return assocMap;
  }

  async getProductById(id: string): Promise<AvailableProduct | null> {
    const productParams: GetItemCommandInput = {
      TableName: this._productTableName,
      Key: marshall({ id }),
    };

    const stockParams: GetItemCommandInput = {
      TableName: this._stocksTableName,
      Key: marshall({ product_id: id }),
    };

    const productPromise = this._db.send(new GetItemCommand(productParams));
    const stockPromise = this._db.send(new GetItemCommand(stockParams));

    const result = await Promise.all([productPromise, stockPromise]);

    if (!result[0].Item) {
      return null;
    }

    let stock;
    if (!result[1].Item) {
      stock = { count: 0 };
    } else {
      stock = <Stock>unmarshall(result[1].Item);
    }

    const product = <Product>unmarshall(result[0].Item);

    return {
      ...product,
      count: stock?.count || 0,
    };
  }

  async getAvailableProducts(): Promise<AvailableProduct[]> {
    const productsPromise = this.getProductList();
    const assocStocksPromise = this.getStockListAssoc();

    const [products, assocStocks] = await Promise.all([productsPromise, assocStocksPromise]);

    return products.map((product) => ({
      ...product,
      count: assocStocks?.[product.id]?.count || 0,
    }));
  }

  async createProduct(product: ProductPut) {
    const newProduct = {
      id: uuid4(),
      ...product,
    };

    const params: PutItemCommandInput = {
      TableName: this._productTableName,
      Item: marshall(newProduct),
      ReturnValues: "NONE",
    };
    await this._db.send(new PutItemCommand(params));
    return { message: "Success" };
  }
}
