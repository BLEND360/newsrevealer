import { GenerateError, GenerateRequest, GenerateResult } from "../types";
import bent from "bent";

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
  return async (url, body, headers) => {
    return await bent(...args, window.location.origin)(url, body, headers);
  };
}

export async function getSummaries(
  input: GenerateRequest,
): Promise<GenerateResult | GenerateError> {
  return await client<GenerateResult | GenerateError>(
    "json",
    "POST",
    200,
    400
  )("/api/invoke", input);
}
