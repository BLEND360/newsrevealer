import {
  GetObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import {
  TopicScanResult,
  GenerateResult,
  GrammarCheckResult,
  ResponseError,
} from "../types";

const s3Client = new S3Client({ region: "us-east-1" });

export async function getConfig(key: string): Promise<any> {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: "newsrevealer-me-config",
      Key: key,
    })
  );
  const chunks = [];
  for await (const chunk of response.Body as Readable) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}

export async function getResults(
  bucket: string,
  key: string
): Promise<
  GenerateResult | GrammarCheckResult | TopicScanResult | ResponseError | null
> {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    const chunks = [];
    for await (const chunk of response.Body as Readable) {
      chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch (error) {
    if ((error as S3ServiceException).name === "NoSuchKey") {
      return null;
    }
    throw error;
  }
}
