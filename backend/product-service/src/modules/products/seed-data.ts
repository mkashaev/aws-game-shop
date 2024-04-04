import {
  DynamoDBClient,
  TransactWriteItemsCommand,
  TransactWriteItemsInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuid4 } from "uuid";
import { products } from "./mock-data";

async function seed() {
  const db = new DynamoDBClient({ region: "eu-west-1" });

  const productsTable = "products-prod";
  const stocksTable = "stocks-prod";

  const promiseList = products.map((productObj, idx) => {
    const productId = uuid4();

    const { id, ...product } = productObj;

    const newProduct = {
      id: productId,
      ...product,
    };

    const params: TransactWriteItemsInput = {
      TransactItems: [
        {
          Put: {
            TableName: productsTable,
            Item: marshall(newProduct),
            ConditionExpression: "attribute_not_exists(id)",
          },
        },
        {
          Put: {
            TableName: stocksTable,
            Item: marshall({
              product_id: productId,
              count: idx + 1,
            }),
            ConditionExpression: "attribute_not_exists(product_id)",
          },
        },
      ],
    };

    return db.send(new TransactWriteItemsCommand(params));
  });

  try {
    await Promise.all(promiseList);
    console.log("=== Seeding is done ===");
  } catch (err) {
    console.log("Error: ", err);
  }
}

seed();
