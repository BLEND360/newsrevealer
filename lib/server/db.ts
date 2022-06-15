import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(dynamoDB);

export async function getUser(email: string) {
  const response = await documentClient.send(
    new GetCommand({
      TableName: "newsrevealer-users",
      Key: { email },
    })
  );
  return response.Item as {
    email: string;
    salt: Buffer;
    password: Buffer;
    name: string;
  };
}

export async function putUser(email: string, name: string, password: string) {
  const salt = crypto.randomBytes(16);
  const hashed = crypto.scryptSync(password, salt, 64);
  await documentClient.send(
    new PutCommand({
      TableName: "newsrevealer-users",
      Item: { salt, password: hashed, email, name },
    })
  );
}
