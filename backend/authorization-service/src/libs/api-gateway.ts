import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const formatJSONResponse = (response: Record<string, unknown>) => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST",
    "Access-Control-Expose-Headers": "*",
  },
  body: JSON.stringify(response),
});

export const formatUnauthorized = () => ({
  statusCode: 401,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST",
    "Access-Control-Expose-Headers": "*",
  },
  body: JSON.stringify({ message: "Custom Unauthorized" }),
});

export const formatAccessDenied = () => ({
  statusCode: 403,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST",
    "Access-Control-Expose-Headers": "*",
  },
  body: JSON.stringify({ message: "Access is denied" }),
});
