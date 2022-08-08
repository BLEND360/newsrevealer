import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { auth, onError, sentry } from "../../lib/server/middleware";
import { GenerateError, GenerateResult } from "../../lib/types";
import { getResults } from "../../lib/server/s3";

export default nc<NextApiRequest, NextApiResponse>({ onError })
  .use(sentry)
  .use(auth)
  .get(
    async (
      req,
      res: NextApiResponse<{
        status: "PENDING" | "DONE";
        result?: GenerateResult | GenerateError;
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
