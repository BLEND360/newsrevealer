import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import {
  AsyncGenerateRequest,
  AsyncGrammarCheckRequest,
  GenerateRequest,
  GenerateResponse,
  GrammarCheckRequest,
} from "../types";
import crypto from "node:crypto";
import { getConfig, AliasesConfig } from "./s3";

const lambdaClient = new LambdaClient({ region: "us-east-1" });
const te = new TextEncoder();

const aliases = getConfig("aliases.json");

// FIXME Remove later
const fixAliases = async (x: any): Promise<AliasesConfig> => {
  const al = await aliases;
  return {
    [process.env.NEXT_PUBLIC_STAGE]: {
      generateFunction: (al[process.env.NEXT_PUBLIC_STAGE] as any) as string,
      grammarCheckFunction: '',
    },
  }
};

export async function invokeGenerate(body: GenerateRequest): Promise<GenerateResponse> {
  const bucket = "newsrevealer-generation";
  const key = crypto.randomUUID();
  const payload: AsyncGenerateRequest = { ...body, bucket, key };
  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: (await fixAliases(aliases))[process.env.NEXT_PUBLIC_STAGE].generateFunction,
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

export async function invokeGrammarCheck(body: GrammarCheckRequest): Promise<GenerateResponse> {
  const bucket = "newsrevealer-generation";
  const key = crypto.randomUUID();
  const payload: AsyncGrammarCheckRequest = { ...body, bucket, key };
  await lambdaClient.send(
    new InvokeCommand({
      FunctionName: (await fixAliases(aliases))[process.env.NEXT_PUBLIC_STAGE].grammarCheckFunction,
      Payload: te.encode(
        JSON.stringify({
          body: JSON.stringify(payload),
        })
      ),
      InvocationType: "Event",
    })
  );
  return {bucket, key};
}
