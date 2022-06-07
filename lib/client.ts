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
    "https://dzvi3lni3ix3yzdjcsteia6mne0mkvrq.lambda-url.us-east-1.on.aws/",
    input
  );
}
