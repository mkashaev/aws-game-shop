import {
  CloudWatchLogs,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  DescribeLogGroupsCommand,
  DescribeLogStreamsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { parse } from "csv-parse";
import { Stream } from "stream";

export async function readOrCreateLogStream(
  client: CloudWatchLogs,
  logGroupName: string,
  logStreamName: string
) {
  const groupCommand = new DescribeLogGroupsCommand({
    logGroupNamePrefix: logGroupName,
  });

  const groupResp = await client.send(groupCommand);
  const logGroups = groupResp.logGroups;
  const isGroupExists = logGroups.some((group) => group.logGroupName === logGroupName);

  if (!isGroupExists) {
    const command = new CreateLogGroupCommand({
      logGroupName,
    });
    await client.send(command);
  }

  const logCommand = new DescribeLogStreamsCommand({
    logGroupName,
    logStreamNamePrefix: logStreamName,
  });
  const response = await client.send(logCommand);
  const logStreams = response.logStreams;
  const isLogExists = logStreams.some((group) => group.logStreamName === logStreamName);

  if (!isLogExists) {
    const command = new CreateLogStreamCommand({
      logGroupName,
      logStreamName,
    });
    await client.send(command);
  }
}

const mapFromArrayToObject = (records: string[][]): Record<string, string>[] => {
  const result = [];

  const header = records[0];
  records.slice(1, records.length).map((elem) => {
    let res = {};
    header.forEach((key, idx) => {
      res[key] = elem[idx];
    });
    result.push(res);
  });

  return result;
};

export const parseCSVStream = async (data: string): Promise<Array<Record<string, string>>> =>
  new Promise((resolve, reject) => {
    const parser = parse({
      delimiter: ",",
    });

    const records = [];

    parser.on("data", (data: string[]) => {
      records.push(data);
    });

    parser.on("close", () => {
      const obj = mapFromArrayToObject(records);
      resolve(obj);
    });

    parser.on("error", (err) => {
      reject(err);
    });

    parser.write(data);
    parser.end();
  });

export const getFromBlobStream = async (body: Stream) =>
  new Promise((resolve, reject) => {
    const result = [] as string[];
    body.on("data", (data: Buffer) => {
      result.push(data.toString());
    });

    body.on("close", () => {
      resolve(result);
    });

    body.on("error", (err) => {
      reject(err);
    });
  });

type GetBucketDataArgs = {
  client: S3Client;
  bucketName: string;
  objectKey: string;
};

export async function getProductRecords({
  client,
  bucketName,
  objectKey,
}: GetBucketDataArgs): Promise<Record<string, string>[]> {
  const getObjectParams = { Bucket: bucketName, Key: objectKey };
  const { Body } = await client.send(new GetObjectCommand(getObjectParams));

  const result = await getFromBlobStream(Body);

  return parseCSVStream(result[0]);
}

type MvObjectArgs = {
  client: S3Client;
  bucketName: string;
  objectKey: string;
};

export const mvObject = async ({ client, bucketName, objectKey }: MvObjectArgs) => {
  const newKey = objectKey.replace("uploaded/", "parsed/");

  await client.send(
    new CopyObjectCommand({
      Bucket: bucketName,
      CopySource: encodeURIComponent(`${bucketName}/${objectKey}`),
      Key: newKey,
    })
  );

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    })
  );
};
