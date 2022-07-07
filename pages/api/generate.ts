import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { invoke } from "../../lib/server/lambda";
import { auth } from "../../lib/server/middleware";
import { GenerateError, GenerateResponse } from "../../lib/types";

export default nc<NextApiRequest, NextApiResponse>()
  .use(auth)
  .post(async (req, res: NextApiResponse<GenerateResponse | GenerateError>) => {
    const body = await invoke(req.body);
    res.status(202).json(body);
  });
