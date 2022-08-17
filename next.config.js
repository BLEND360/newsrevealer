// @ts-check

const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  target: "experimental-serverless-trace",
  compiler: { styledComponents: true },
};

const SentryWebpackPluginOptions = {
  silent: true,
};

/** @type {import('next').NextConfig} **/
module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
