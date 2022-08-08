import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://beb55e2f5e374ee187a13d1b18f36a42@o947277.ingest.sentry.io/6633189",
  tracesSampler: (samplingContext) => {
    if (
      samplingContext.transactionContext.name === "GET /api/auth/[...nextauth]"
    ) {
      return 0.01;
    } else {
      return 0.1;
    }
  },
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
});
