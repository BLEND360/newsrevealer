const { Stack } = require("aws-cdk-lib");
const {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} = require("aws-cdk-lib/pipelines");
const NewsRevealer = require("./stage");

module.exports = class PipelineStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "pipeline", {
      synth: new ShellStep("synth", {
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
          "export $(cat .env | xargs)",
          "node build.mjs",
          "yarn cdk synth",
        ],
      }),
    });

    pipeline.addStage(
      new NewsRevealer(this, "newsrevealer", {
        env: props.env,
        // domain: props.domain,
        // hostedZone: props.hostedZone,
      })
    );
  }
};
