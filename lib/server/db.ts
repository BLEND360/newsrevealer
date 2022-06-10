import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";

const dynamoDB = new DynamoDBClient({ region: "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(dynamoDB);

export async function allTopics() {
  let result: { key: string }[] = [];
  let key;
  do {
    const response: ScanCommandOutput = await documentClient.send(
      new ScanCommand({
        TableName: "newsrevealer-topics",
        ExclusiveStartKey: key,
      })
    );
    if (response.Items) {
      result = [...result, ...(response.Items as { key: string }[])];
    }
    key = response.LastEvaluatedKey;
  } while (key);
  return result;
}

export async function putTopic(key: string) {
  await documentClient.send(
    new PutCommand({
      TableName: "newsrevealer-topics",
      Item: { key },
    })
  );
}
