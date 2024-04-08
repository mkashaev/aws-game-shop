import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { EventAPIGateway, formatJSONResponse, formatJSONServerError } from "@libs/api-gateway";
import { Body, Query } from "./schema";
import { generateFileName } from "./utils";

const REGION = "eu-west-1";
const BUCKET_NAME = "game-shop-app-a8f5390a1732";

const s3Client = new S3Client({ region: REGION });

const importProductsFile: EventAPIGateway<Body, Query> = async (event) => {
  const fileName = generateFileName(event.queryStringParameters.name, "uploaded");

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const expiresIn = 5 * 60;

    const url = await getSignedUrl(s3Client, command, { expiresIn });

    return formatJSONResponse({ msg: "success", data: url });
  } catch (err) {
    console.error(err);
    return formatJSONServerError("Failed to upload file.");
  }
};

export const main = importProductsFile;
