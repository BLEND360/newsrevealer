# News Revealer

## AWS

```shell
aws configure sso
aws sso login
```

Copy profile `sso_*` lines from `~/.aws/config` to the correct section in `~/.aws/credentials`.

## Running the app

```shell
export AWS_PROFILE=...
export NEXT_PUBLIC_STAGE=dev
yarn
yarn dev
```

## Add users

```javascript
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  ScanCommandOutput,
} = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(dynamoDB);

const passwords = {
  1: '',
  // ...
};
const p = [];

const putUser = async (email, name, password) => {
  console.log(email, name, password);
  const salt = crypto.randomBytes(16);
  const hashed = crypto.scryptSync(password, salt, 64);
  await documentClient.send(
    new PutCommand({
      TableName: "newsrevealer-users",
      Item: { salt, password: hashed, email, name },
    })
  );
};

for (const x of Object.keys(passwords)) {
  p.push(putUser(`user${x}@news-revealer.com`, `User${x}`, passwords[x]));
}

Promise.all(p)
  .then((x) => console.log(x))
  .catch((e) => console.log("Failed", e));
```
