// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ProductService } from "./products.service";

describe("product.service", () => {
  afterEach(() => {
    jest.resetAllMocks();
    ProductService.dbInstance = null;
  });

  describe("getProductList", () => {
    test("should return data", async () => {
      const mockData = {
        Items: [
          {
            id: { S: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
            title: { S: "ProductOne" },
            description: { S: "Short Product Description1" },
            price: { N: "24" },
          },
        ],
      };

      const expected = [
        {
          id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
          title: "ProductOne",
          description: "Short Product Description1",
          price: 24,
        },
      ];

      const args = {
        db: {
          send: jest.fn().mockResolvedValue(mockData),
        },
        productTableName: "Products",
        stocksTableName: "Stocks",
      } as any;

      const service = new ProductService(args);

      const result = await service.getProductList();
      expect(result).toEqual(expected);
    });
  });

  describe("getAvailablePorducts", () => {
    test("should return data", async () => {
      const productMockData = {
        Items: [
          {
            id: { S: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
            title: { S: "ProductOne" },
            description: { S: "Short Product Description1" },
            price: { N: "24" },
          },
        ],
      };

      const stockMockData = {
        Items: [
          {
            product_id: { S: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
            count: { N: "2" },
          },
        ],
      };

      const args = {
        db: {
          send: jest.fn().mockImplementation(({ input: { TableName } }) => {
            if (TableName === "Products") {
              return Promise.resolve(productMockData);
            }
            if (TableName === "Stocks") {
              return Promise.resolve(stockMockData);
            }
            return null;
          }),
        },
        productTableName: "Products",
        stocksTableName: "Stocks",
      } as any;

      const expected = [
        {
          id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
          title: "ProductOne",
          description: "Short Product Description1",
          price: 24,
          count: 2,
        },
      ];

      const service = new ProductService(args);

      const result = await service.getAvailableProducts();
      expect(result).toEqual(expected);
    });
  });

  describe("getProductById", () => {
    test("should return product with stock count", async () => {
      const productMockData = {
        Item: {
          id: { S: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
          title: { S: "ProductOne" },
          description: { S: "Short Product Description1" },
          price: { N: "24" },
        },
      };

      const stockMockData = {
        Item: {
          product_id: { S: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
          count: { N: "2" },
        },
      };

      const expected = {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        title: "ProductOne",
        description: "Short Product Description1",
        price: 24,
        count: 2,
      };

      const args = {
        db: {
          send: jest.fn().mockImplementation(({ input: { TableName } }) => {
            if (TableName === "Products") {
              return Promise.resolve(productMockData);
            }
            if (TableName === "Stocks") {
              return Promise.resolve(stockMockData);
            }
            return null;
          }),
        },
        productTableName: "Products",
        stocksTableName: "Stocks",
      } as any;

      const service = new ProductService(args);

      const result = await service.getProductById("7567ec4b-b10c-48c5-9345-fc73c48a80aa");
      expect(result).toEqual(expected);
    });
  });
});
