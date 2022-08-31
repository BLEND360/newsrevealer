import { GenerateRequest, GenerateResponse, SummarizerRequest, TopicScanRequest } from "../types";
import { signIn } from "next-auth/react";
import bent, { StatusError } from "bent";
import { captureException } from "@sentry/nextjs";

export function client(
  type: "string",
  ...args: bent.Options[]
): bent.RequestFunction<string>;
export function client(
  type: "buffer",
  ...args: bent.Options[]
): bent.RequestFunction<Buffer | ArrayBuffer>;
export function client<T extends bent.Json = any>(
  type: "json",
  ...args: bent.Options[]
): bent.RequestFunction<T>;
export function client(
  baseUrl: string,
  type: "string",
  ...args: bent.Options[]
): bent.RequestFunction<string>;
export function client(
  baseUrl: string,
  type: "buffer",
  ...args: bent.Options[]
): bent.RequestFunction<Buffer | ArrayBuffer>;
export function client<T extends bent.Json = any>(
  baseUrl: string,
  type: "json",
  ...args: bent.Options[]
): bent.RequestFunction<T>;
export function client(
  baseUrl: string,
  ...args: bent.Options[]
): bent.RequestFunction<bent.ValidResponse>;
export function client<T extends bent.ValidResponse>(
  ...args: bent.Options[]
): bent.RequestFunction<T>;
export function client(
  ...args: bent.Options[]
): bent.RequestFunction<bent.ValidResponse> {
  const request = bent(...args, window.location.origin);
  return async (url, body, headers) => {
    try {
      return await request(url, body, headers);
    } catch (error) {
      if ((error as StatusError).statusCode === 401) {
        signIn();
      } else {
        captureException(error);
      }
      throw error;
    }
  };
}

export async function getSummaries(
  input: GenerateRequest
): Promise<GenerateResponse> {
  return await client<GenerateResponse>(
    "json",
    "POST",
    202
  )("/api/generate", input);
}

export async function getTopics(input: TopicScanRequest): Promise<GenerateResponse> {
  return await client<GenerateResponse>(
    "json",
    "POST",
    202
  )("/api/topics", input);
}

export async function runSummarizer(input: SummarizerRequest): Promise<GenerateResponse> {
  return await client<GenerateResponse>(
    "json",
    "POST",
    202
  )("/api/summarizer", input);
}
