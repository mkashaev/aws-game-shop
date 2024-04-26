import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        authorizer: {
          type: "REQUEST",
          arn: "arn:aws:lambda:eu-west-1:513442799406:function:authorization-service-dev-basicAuthorizer",
        },
        cors: {
          origin: "*",
          headers: [
            "Content-Type",
            "X-Amz-Date",
            "Authorization",
            "X-Api-Key",
            "X-Amz-Security-Token",
            "*",
          ],
          allowCredentials: true,
        },
      },
    },
  ],
};
