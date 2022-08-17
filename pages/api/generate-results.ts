import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../lib/server/middleware";
import { GenerateError, GenerateResult, GrammarCheckResult } from "../../lib/types";
import { getResults } from "../../lib/server/s3";

export default nc<NextApiRequest, NextApiResponse>()
  .use(auth)
  .get(
    async (
      req,
      res: NextApiResponse<{
        status: "PENDING" | "DONE";
        result?: GenerateResult | GrammarCheckResult | GenerateError;
      }>
    ) => {
      const result = await getResults(
        req.query.bucket as string,
        req.query.key as string
      );
      if (result) {
        res.status(200).json({ status: "DONE", result });
      } else {
        res.status(200).json({ status: "PENDING" });
      }
    }
  );
