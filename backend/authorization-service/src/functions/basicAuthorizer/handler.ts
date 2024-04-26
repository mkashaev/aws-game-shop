import { formatUnauthorized } from "@libs/api-gateway";

const isValidCredentials = (username: string, password: string): boolean => {
  return username === "mkashaev" && password === process.env.PASSWORD;
};

const basicAuthorizer = async (event: any) => {
  const authHeader = event.headers.Authorization || event.headers.authorization;

  if (!authHeader) {
    return formatUnauthorized();
  }

  const encodedCreds = authHeader.split(" ")[1];
  const buff = Buffer.from(encodedCreds, "base64");
  const [username, password] = buff.toString("utf8").split(":");

  if (isValidCredentials(username, password)) {
    return generatePolicy(encodedCreds, "Allow", event.methodArn);
  }

  return generatePolicy(encodedCreds, "Deny", event.methodArn);
};

const generatePolicy = (principalId: string, effect: "Allow" | "Deny", resource: string) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});

export const main = basicAuthorizer;
