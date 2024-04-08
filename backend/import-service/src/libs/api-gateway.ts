import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";

type ProxyEvent<B, Q, R> = Omit<
  APIGatewayProxyEvent,
  "body" | "queryStringParameters" | "Records"
> & {
  body: B;
  queryStringParameters: Q;
  Records: R;
};

export type EventAPIGateway<B, Q, R = {}> = Handler<ProxyEvent<B, Q, R>, APIGatewayProxyResult>;

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(response),
  };
};

export const formatJSONServerError = (message: string) => {
  return {
    statusCode: 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message }),
  };
};
