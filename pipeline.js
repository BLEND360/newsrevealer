const { Stack } = require("aws-cdk-lib");
const {
  CodePipeline,
  CodePipelineSource,
  CodeBuildStep,
} = require("aws-cdk-lib/pipelines");
const NewsRevealer = require("./stage");
const { PolicyStatement } = require("aws-cdk-lib/aws-iam");

module.exports = class PipelineStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "pipeline", {
      synth: new CodeBuildStep("synth", {
        input: CodePipelineSource.connection(
          "BLEND360/newsrevealer",
          props.branch,
          {
            connectionArn: props.connection,
          }
        ),
        commands: [
          "yarn install",
          `echo NEXT_PUBLIC_STAGE=${props.stage} >> .env`,
          `echo NEXTAUTH_URL=https://${props.domain} >> .env`,
          "export $(cat .env | xargs)",
          "node build.mjs",
          "yarn cdk synth",
        ],
        rolePolicyStatements: [
          new PolicyStatement({
            actions: ["s3:GetObject"],
            resources: ["arn:aws:s3:::newsrevealer-config/*"],
          }),
        ],
      }),
    });

    pipeline.addStage(
      new NewsRevealer(this, id + "-newsrevealer", {
        env: props.env,
        domain: props.domain,
        hostedZone: props.hostedZone,
      })
    );
  }
};
