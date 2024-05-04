import type { AWS } from '@serverless/typescript';

const REGION = "eu-west-1";

const serverlessConfiguration: AWS = {
  service: 'nestjs-app',
  frameworkVersion: '3',
  plugins: [
    // 'serverless-webpack',
    'serverless-offline',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: REGION,
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'execute-api:Invoke',
            ],
            Resource: '*',
          },
        ]
      }
    },
  },
  functions: {
    app: {
      handler: 'dist/src/main.handler',
      events: [
        {
          http: {
            path: '/',
            method: 'ANY',
            cors: true,
          },
        },
        {
          http: {
            path: '/{proxy+}',
            method: 'ANY',
            cors: true,
          },
        },
      ],
    },
  },
  custom: {
    dotenv: {
      basePath: '.',
      include: [
        `./configs/.env.${process.env.NODE_ENV}`
      ],
    },
    // webpack: {
    //   webpackConfig: './webpack.config.js',
    //   includeModules: true,
    // },
  },
};

module.exports = serverlessConfiguration;