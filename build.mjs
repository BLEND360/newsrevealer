import lambda from "@sls-next/lambda-at-edge";

const builder = new lambda.Builder(".", "./build", {
  args: ["build"],
  useServerlessTraceTarget: true,
  env: {
    NEXT_PUBLIC_STAGE: process.env.NEXT_PUBLIC_STAGE,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT
  },
});
await builder.build();
