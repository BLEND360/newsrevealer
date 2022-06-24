import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { allTopics, putTopic } from "../../lib/server/db";

export default nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    res.status(200).json(await allTopics());
  })
  .post(async (req, res) => {
    for (const topic of req.body) {
      await putTopic(topic);
    }
    res.status(204).end();
  });
