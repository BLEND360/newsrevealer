import { GenerateError, GenerateRequest, GenerateResult } from "./types";
import bent from "bent";

export async function getSummaries(
  input: GenerateRequest
): Promise<GenerateResult | GenerateError> {
  return await bent<GenerateResult | GenerateError>(
    "json",
    "POST",
    200,
    400
  )(
    "https://yqecfhf4pczaevfcfej6wognsy0ifmbf.lambda-url.us-east-1.on.aws/",
    input
  );
}
