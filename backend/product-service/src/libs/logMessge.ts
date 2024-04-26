import {
  CloudWatchLogs,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  DescribeLogGroupsCommand,
  DescribeLogStreamsCommand,
} from "@aws-sdk/client-cloudwatch-logs";

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

export const logMessage = async (client: CloudWatchLogs, message: string) => {
  const logGroupName = "/aws/common";
  const logStreamName = "common-log-stream";

  await readOrCreateLogStream(client, logGroupName, logStreamName);

  const params = {
    logEvents: [
      {
        message: message,
        timestamp: new Date().getTime(),
      },
    ],
    logGroupName,
    logStreamName,
  };
  await client.putLogEvents(params);
};
