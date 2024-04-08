import { handlerPath } from "@libs/handler-resolver";

const BUCKET_NAME = "game-shop-app-a8f5390a1732";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET_NAME,
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: "uploaded/" }, { suffix: ".csv" }],
        existing: true,
      },
    },
  ],
};
