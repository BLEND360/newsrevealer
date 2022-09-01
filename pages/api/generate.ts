import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { invokeGenerate } from "../../lib/server/lambda";
import { auth, onError, sentry } from "../../lib/server/middleware";
import { AsyncResponse, ResponseError } from "../../lib/types";

export default nc<NextApiRequest, NextApiResponse>({ onError })
  .use(sentry)
  .use(auth)
  .post(async (req, res: NextApiResponse<AsyncResponse | ResponseError>) => {
    const body = await invokeGenerate(req.body);
    res.status(202).json(body);
  });
