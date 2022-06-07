import lambda from "@sls-next/lambda-at-edge";

const builder = new lambda.Builder(".", "./build", {
  args: ["build"],
  useServerlessTraceTarget: true,
  env: {
    NEXT_PUBLIC_STAGE: process.env.NEXT_PUBLIC_STAGE,
  },
});
await builder.build();
