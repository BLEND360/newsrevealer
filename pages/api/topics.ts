import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { auth, onError, sentry } from "../../lib/server/middleware";
import { invokeScanForTopics } from "../../lib/server/lambda";
import { GenerateResponse, TopicScanError } from "../../lib/types";

export default nc<NextApiRequest, NextApiResponse>({ onError })
  .use(sentry)
  .use(auth)
  .post(async (req, res: NextApiResponse<GenerateResponse | TopicScanError>) => {
    const body = await invokeScanForTopics(req.body);
    res.status(202).json(body);
  });
