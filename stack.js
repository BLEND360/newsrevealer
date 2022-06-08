const { Stack } = require("aws-cdk-lib");
const { HostedZone } = require("aws-cdk-lib/aws-route53");
const {
  Certificate,
  CertificateValidation,
} = require("aws-cdk-lib/aws-certificatemanager");
const { NextJSLambdaEdge } = require("@sls-next/cdk-construct");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
const { PolicyStatement } = require("aws-cdk-lib/aws-iam");

module.exports = class AppStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, "hostedZone", {
      hostedZoneId: props.hostedZone,
      zoneName: props.domain,
    });
    const certificate = new Certificate(this, "certificate", {
      domainName: props.domain,
      validation: CertificateValidation.fromDns(hostedZone),
    });
    const app = new NextJSLambdaEdge(this, "app", {
      serverlessBuildOutDir: "./build",
      domain: {
        domainNames: [props.domain],
        hostedZone,
        certificate,
      },
      runtime: Runtime.NODEJS_14_X,
    });
    app.edgeLambdaRole.addToPolicy(
      new PolicyStatement({
        actions: ["s3:GetObject"],
        resources: ["arn:aws:s3:::newsrevealer-config/*"],
      })
    );
  }
};
