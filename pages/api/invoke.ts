import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { invoke } from "../../lib/server/lambda";
import { auth } from "../../lib/server/middleware";
import { GenerateError, GenerateResult } from "../../lib/types";

export default nc<NextApiRequest, NextApiResponse>()
  .use(auth)
  .post(async (req, res: NextApiResponse<GenerateResult | GenerateError>) => {
    const { body, statusCode } = await invoke(req.body);
    res.status(statusCode).json(body);
  });
