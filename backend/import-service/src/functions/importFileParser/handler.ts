import { CloudWatchLogs } from "@aws-sdk/client-cloudwatch-logs";
import { S3Client } from "@aws-sdk/client-s3";
import { EventAPIGateway, formatJSONResponse, formatJSONServerError } from "@libs/api-gateway";
import { BodyType, QueryType, RecordType } from "./schema";
import { getProductRecords, readOrCreateLogStream } from "./utils";

const REGION = "eu-west-1";

const logsClient = new CloudWatchLogs({ region: REGION });
const s3Client = new S3Client({ region: REGION });

const importProductsFile: EventAPIGateway<BodyType, QueryType, RecordType[]> = async (event) => {
  const logGroupName = "/aws/lambda/importFileParse";
  const logStreamName = "products-log-stream";

  try {
    let params;
    let message;

    const record = event.Records[0];

    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    const products = await getProductRecords({ client: s3Client, bucketName, objectKey });

    await readOrCreateLogStream(logsClient, logGroupName, logStreamName);

    for (let product of products) {
      message = JSON.stringify(product, null, 2);
      params = {
        logEvents: [
          {
            message,
            timestamp: new Date().getTime(),
          },
        ],
        logGroupName,
        logStreamName,
      };
      await logsClient.putLogEvents(params);
    }

    return formatJSONResponse({ msg: "Success" });
  } catch (err) {
    console.log(err);
    return formatJSONServerError("Server error from importFileParser");
  }
};

export const main = importProductsFile;
