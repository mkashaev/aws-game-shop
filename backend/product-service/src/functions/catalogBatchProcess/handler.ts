import { CloudWatchLogs } from "@aws-sdk/client-cloudwatch-logs";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { formatJSONResponse, formatJSONServerError } from "@libs/api-gateway";
import { logMessage } from "@libs/logMessge";
import { ProductService } from "@modules/products";
import { ProductPut } from "@modules/products/types";
import * as Joi from "joi";

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().integer().required(),
}).required();

const REGION = "eu-west-1";

const logsClient = new CloudWatchLogs({ region: REGION });
const snsClient = new SNSClient({ region: REGION });

const catalogBatchProcess = async (event) => {
  try {
    const productService = new ProductService({});
    const records = event.Records;

    for (const record of records) {
      const product: ProductPut = JSON.parse(record.body);
      const { error } = schema.validate(product);

      if (error) {
        const message = JSON.stringify(
          {
            event: "lambda: catalogBatchProcess",
            payload: {
              msg: "product validation error",
              product,
            },
          },
          null,
          2
        );

        await logMessage(logsClient, message);
        continue;
      }
      await productService.createProduct(product);
    }

    const message = {
      Subject: "Product Creation Notification",
      Message: "Products were successfully created!",
      TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
    };

    await snsClient.send(new PublishCommand(message));

    return formatJSONResponse({ msg: "Done" });
  } catch (err) {
    return formatJSONServerError("Catalog batch process server error");
  }
};

export const main = catalogBatchProcess;
