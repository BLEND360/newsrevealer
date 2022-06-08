const { Stage } = require("aws-cdk-lib");
const AppStack = require("./stack");

module.exports = class NewsRevealer extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    new AppStack(this, "app", {
      domain: props.domain,
      hostedZone: props.hostedZone,
    });
  }
};
