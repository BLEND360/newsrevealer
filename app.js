const { App } = require("aws-cdk-lib");
const PipelineStack = require("./pipeline");

const app = new App();
new PipelineStack(app, "newsrevealer-pipeline-dev", {
  branch: "dev",
  connection:
    "arn:aws:codestar-connections:us-east-1:866336128083:connection/a64a8206-0835-4783-9875-7adc750ce82e",
  domain: "newsrevealer.blend360dev.io",
  hostedZone: "Z0676559WUV0H51Y9P04",
  env: {
    account: "866336128083",
    region: "us-east-1",
  },
  stage: "dev",
});
new PipelineStack(app, "newsrevealer-pipeline-alpha", {
  branch: "alpha",
  connection:
    "arn:aws:codestar-connections:us-east-1:866336128083:connection/a64a8206-0835-4783-9875-7adc750ce82e",
  domain: "newsrevealer.blend360dev.io",
  hostedZone: "Z0676559WUV0H51Y9P04",
  env: {
    account: "866336128083",
    region: "us-east-1",
  },
  stage: "alpha",
});
new PipelineStack(app, "newsrevealer-pipeline-beta", {
  branch: "beta",
  connection:
    "arn:aws:codestar-connections:us-east-1:866336128083:connection/a64a8206-0835-4783-9875-7adc750ce82e",
  domain: "newsrevealer.blend360dev.io",
  hostedZone: "Z0676559WUV0H51Y9P04",
  env: {
    account: "866336128083",
    region: "us-east-1",
  },
  stage: "beta",
});
new PipelineStack(app, "newsrevealer-pipeline-stable", {
  branch: "main",
  connection:
    "arn:aws:codestar-connections:us-east-1:866336128083:connection/a64a8206-0835-4783-9875-7adc750ce82e",
  domain: "newsrevealer.blend360dev.io",
  hostedZone: "Z0676559WUV0H51Y9P04",
  env: {
    account: "866336128083",
    region: "us-east-1",
  },
  stage: "stable",
});
