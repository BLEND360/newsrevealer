import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

export interface AuthenticatedApiRequest extends NextApiRequest {
  session?: Session;
}

export async function auth(
  req: AuthenticatedApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const session = await getSession({ req });

  if (session) {
    req.session = session;
    next();
  } else {
    res.status(401).send("User not authenticated");
  }
}
