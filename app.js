const { App } = require("aws-cdk-lib");
const PipelineStack = require("./pipeline");

const app = new App();
new PipelineStack(app, "newsrevealer-pipeline-dev", {
  branch: "dev",
  connection:
    "arn:aws:codestar-connections:us-east-1:866336128083:connection/a64a8206-0835-4783-9875-7adc750ce82e",
  // domain: "newsrevealer.blend360dev.io",
  // hostedZone: "Z03900141YFYRDWPXTVHQ",
  env: {
    account: "866336128083",
    region: "us-east-1",
  },
  stage: "dev",
});
