import type { AWS } from "@serverless/typescript";

import getProductList from "@functions/getProductList";
import getProductById from "@functions/getProductById";
import getAvailableProducts from "@functions/getAvailableProducts";
import createProduct from "@functions/createProduct";

const REGION = "eu-west-1";
const ACCOUNT_ID = "513442799406";

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCTS_TABLE_NAME: "products-prod",
      STOCKS_TABLE_NAME: "stocks-prod",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: [
              `arn:aws:dynamodb:${REGION}:${ACCOUNT_ID}:table/products-prod`,
              `arn:aws:dynamodb:${REGION}:${ACCOUNT_ID}:table/stocks-prod`,
            ],
          },
        ],
      },
    },
  },
  functions: { getProductList, getProductById, getAvailableProducts, createProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      products: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "products-prod",
          AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          BillingMode: "PAY_PER_REQUEST",
        },
      },
      stocks: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "stocks-prod",
          AttributeDefinitions: [{ AttributeName: "product_id", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "product_id", KeyType: "HASH" }],
          BillingMode: "PAY_PER_REQUEST",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
