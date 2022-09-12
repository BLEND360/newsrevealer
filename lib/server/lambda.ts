import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import {
  AsyncGenerateRequest,
  AsyncGrammarCheckRequest,
  AsyncResponse,
  AsyncTopicScanRequest,
  GenerateRequest,
  GrammarCheckRequest,
  TopicScanRequest,
} from "../types";
import crypto from "node:crypto";
import { getConfig } from "./s3";

const lambdaClient = new LambdaClient({ region: "us-east-1" });
const te = new TextEncoder();

export async function invokeGenerate(
  body: GenerateRequest
): Promise<AsyncResponse> {
  const bucket = "newsrevealer-me-generation";
  const key = crypto.randomUUID();
  const payload: AsyncGenerateRequest = { ...body, bucket, key };
  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: (
        await getConfig("aliases.json")
      )[process.env.NEXT_PUBLIC_STAGE].generate,
      Payload: te.encode(
        JSON.stringify({
          body: JSON.stringify(payload),
        })
      ),
      InvocationType: "Event",
    })
  );

  return {
    bucket,
    key,
  };
}

export async function invokeScanForTopics(
  body: TopicScanRequest
): Promise<AsyncResponse> {
  const bucket = "newsrevealer-me-generation";
  const key = crypto.randomUUID();
  const payload: AsyncTopicScanRequest = { ...body, bucket, key };
  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: (
        await getConfig("aliases.json")
      )[process.env.NEXT_PUBLIC_STAGE].topics,
      Payload: te.encode(
        JSON.stringify({
          body: JSON.stringify(payload),
        })
      ),
      InvocationType: "Event",
    })
  );
  return { bucket, key };
}

export async function invokeGrammarCheck(
  body: GrammarCheckRequest
): Promise<AsyncResponse> {
  const bucket = "newsrevealer-me-generation";
  const key = crypto.randomUUID();
  const payload: AsyncGrammarCheckRequest = { ...body, bucket, key };
  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: (
        await getConfig("aliases.json")
      )[process.env.NEXT_PUBLIC_STAGE].grammar,
      Payload: te.encode(
        JSON.stringify({
          body: JSON.stringify(payload),
        })
      ),
      InvocationType: "Event",
    })
  );
  return { bucket, key };
}
