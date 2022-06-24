import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { GenerateError, GenerateRequest, GenerateResult } from "../types";

const lambdaClient = new LambdaClient({ region: "us-east-1" });
const te = new TextEncoder();
const td = new TextDecoder();

export async function invoke(
  body: GenerateRequest
): Promise<{ body: GenerateResult | GenerateError; statusCode: number }> {
  const response = await lambdaClient.send(
    new InvokeCommand({
      FunctionName:
        "arn:aws:lambda:us-east-1:169196863399:function:avrioc_docker:main_runner",
      Payload: te.encode(JSON.stringify({ body: JSON.stringify(body) })),
    })
  );
  return JSON.parse(td.decode(response.Payload));
}
