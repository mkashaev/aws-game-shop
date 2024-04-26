import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { ProductService } from "@modules/products";
import { main } from "./handler";
import { CloudWatchLogs } from "@aws-sdk/client-cloudwatch-logs";

const snsMock = mockClient(SNSClient);
const logsMock = mockClient(CloudWatchLogs);

describe("catalogBatchProcess", () => {
  beforeEach(() => {
    snsMock.reset();
    logsMock.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should process records and publish messages", async () => {
    jest.spyOn(ProductService.prototype, "createProduct").mockImplementation();

    const product = {
      title: "Test product",
      description: "Test product description",
      price: 24,
    };

    const event = {
      Records: [{ body: JSON.stringify(product) }],
    };

    await main(event);

    expect(snsMock).toHaveReceivedCommandWith(PublishCommand, {
      Subject: "Product Creation Notification",
      Message: "Products were successfully created!",
      TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
    });
  });
});
