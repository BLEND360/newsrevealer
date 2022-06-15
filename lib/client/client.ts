import { GenerateError, GenerateRequest, GenerateResult } from "../types";
import bent from "bent";

export async function getSummaries(
  input: GenerateRequest,
  endpoint: string
): Promise<GenerateResult | GenerateError> {
  return await bent<GenerateResult | GenerateError>(
    "json",
    "POST",
    200,
    400
  )(endpoint, input);
}
