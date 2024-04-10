import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: "arn:aws:sqs:eu-west-1:513442799406:catalogItemsQueue",
        batchSize: 5,
      },
    },
  ],
};
