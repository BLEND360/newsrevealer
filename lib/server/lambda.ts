import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import {
  AsyncGenerateRequest,
  GenerateRequest,
  GenerateResponse,
} from "../types";
import crypto from "node:crypto";
import { getConfig } from "./s3";

const lambdaClient = new LambdaClient({ region: "us-east-1" });
const te = new TextEncoder();

const aliases = getConfig("aliases.json");

export async function invoke(body: GenerateRequest): Promise<GenerateResponse> {
  const bucket = "newsrevealer-generation";
  const key = crypto.randomUUID();
  const payload: AsyncGenerateRequest = { ...body, bucket, key };
  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: (await aliases)[process.env.NEXT_PUBLIC_STAGE],
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
