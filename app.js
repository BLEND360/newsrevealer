const { App } = require("aws-cdk-lib");
const PipelineStack = require("./pipeline");

const app = new App();
new PipelineStack(app, "newsrevealer-pipeline-dev", {
  branch: "dev",
  connection:
    "arn:aws:codestar-connections:us-east-1:169196863399:connection/b8443c0f-0bc7-4918-8fa4-7d4158b67897",
  domain: "dev.newsrevealer.blend360dev.io",
  hostedZone: "Z0721626FLL4MCQSWB0S",
  env: {
    account: "169196863399",
    region: "us-east-1",
  },
  stage: "dev",
  environment: "dev",
});
new PipelineStack(app, "newsrevealer-pipeline-stable", {
  branch: "main",
  connection:
    "arn:aws:codestar-connections:us-east-1:169196863399:connection/b8443c0f-0bc7-4918-8fa4-7d4158b67897",
  domain: "news-revealer.io",
  hostedZone: "Z09265032BUJ9IJM9SA8U",
  env: {
    account: "169196863399",
    region: "us-east-1",
  },
  stage: "stable",
  environment: "stable",
});
// new PipelineStack(app, "newsrevealer-pipeline-prod", {
//   branch: "main",
//   connection:
//     "arn:aws:codestar-connections:us-east-1:169196863399:connection/b8443c0f-0bc7-4918-8fa4-7d4158b67897",
//   domain: "news-revealer.io",
//   hostedZone: "Z09265032BUJ9IJM9SA8U",
//   env: {
//     account: "169196863399",
//     region: "us-east-1",
//   },
//   stage: "stable",
//   environment: "stable",
// });
// comment3
