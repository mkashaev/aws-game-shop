// import { config } from "aws-sdk";
// import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import {
  DynamoDBClient,
  // PutItemCommand,
  // PutItemCommandInput,
  // ScanCommand,
  // ScanCommandInput,
  TransactWriteItemsCommand,
  TransactWriteItemsInput,
} from "@aws-sdk/client-dynamodb";
// import { unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuid4 } from "uuid";

// config.update({
//   region: "eu-west-1",
//   accessKeyId: "AKIAXPC4TL4XJYKORBSP",
//   secretAccessKey: "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",
// });

async function seed() {
  // const db = DynamoDBDocument.from(new DynamoDB());
  const db = new DynamoDBClient({ region: "eu-west-1" });

  const productsTable = "Products";
  const stocksTable = "Stocks";

  const productId = uuid4();

  const params: TransactWriteItemsInput = {
    TransactItems: [
      {
        Put: {
          TableName: productsTable,
          Item: {
            id: { S: productId },
            description: { S: "Short Product Description1" },
            price: { N: "24" },
            title: { S: "ProductOne" },
          },
          ConditionExpression: "attribute_not_exists(id)",
        },
      },
      {
        Put: {
          TableName: stocksTable,
          Item: {
            id: { S: productId },
            count: { N: "10" },
          },
          ConditionExpression: "attribute_not_exists(product_id)",
        },
      },
    ],
  };

  await db.send(new TransactWriteItemsCommand(params));

  // const params: PutItemCommandInput = {
  //   TableName: productsTable,
  //   Item: {
  //     id: { S: productId },
  //     description: { S: "Short Product Description1" },
  //     price: { N: "24" },
  //     title: { S: "ProductOne" },
  //   },
  //   ReturnValues: "NONE",
  // };

  // const params: ScanCommandInput = {
  //   TableName: productsTable,
  // };

  try {
    // await db.send(new PutItemCommand(params));

    // const data = await db.send(new ScanCommand(params));

    // console.log(data.Items.map((item) => unmarshall(item)));
    // console.log(data.Items.map(mapItems));

    // await db.transactWrite(params);
    console.log("=== Seeding is done ===");
  } catch (err) {
    console.log("Error: ", err);
  }
}

// function mapItems(item) {
//   console.log(item);
//   return {
//     id: item.id.S,
//     titile: item.title.S,
//     description: item.description.S,
//     price: item.price.N,
//   };
// }

seed();
