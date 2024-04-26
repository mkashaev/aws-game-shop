import { S3Client } from "@aws-sdk/client-s3";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { EventAPIGateway, formatJSONResponse, formatJSONServerError } from "@libs/api-gateway";
import { BodyType, QueryType, RecordType } from "./schema";
import { getProductRecords, mvObject } from "./utils";

const REGION = "eu-west-1";
const QUEUE_URL = "https://sqs.eu-west-1.amazonaws.com/513442799406/catalogItemsQueue";

const s3Client = new S3Client({ region: REGION });
const sqsClient = new SQSClient({ region: REGION });

const importProductsFile: EventAPIGateway<BodyType, QueryType, RecordType[]> = async (event) => {
  try {
    const record = event.Records[0];

    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    const products = await getProductRecords({ client: s3Client, bucketName, objectKey });

    for (let product of products) {
      const command = new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(product),
      });
      await sqsClient.send(command);
    }

    await mvObject({ client: s3Client, bucketName, objectKey });

    return formatJSONResponse({ msg: "Success" });
  } catch (err) {
    console.log(err);
    return formatJSONServerError("Server error from importFileParser");
  }
};

export const main = importProductsFile;
