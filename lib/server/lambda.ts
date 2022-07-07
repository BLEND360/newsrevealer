import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import {
  AsyncGenerateRequest,
  GenerateRequest,
  GenerateResponse,
} from "../types";
import crypto from "node:crypto";

const lambdaClient = new LambdaClient({ region: "us-east-1" });
const te = new TextEncoder();

export async function invoke(body: GenerateRequest): Promise<GenerateResponse> {
  const bucket = "newsrevealer-generation";
  const key = crypto.randomUUID();
  const payload: AsyncGenerateRequest = { ...body, bucket, key };
  await lambdaClient.send(
    new InvokeCommand({
      FunctionName:
        "arn:aws:lambda:us-east-1:169196863399:function:avrioc_docker:async_response",
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
