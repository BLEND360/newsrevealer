import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import {
  captureException,
  flush,
  getCurrentHub,
  Handlers,
  setUser,
  startTransaction,
} from "@sentry/nextjs";
import { extractTraceparentData, hasTracingEnabled } from "@sentry/tracing";
import {
  addExceptionMechanism,
  isString,
  objectify,
  stripUrlQueryAndFragment,
} from "@sentry/utils";
import * as domain from "domain";
import { Transaction } from "@sentry/types";
const { parseRequest } = Handlers;

export interface AuthenticatedApiRequest extends NextApiRequest {
  session?: Session;
}

export async function auth(
  req: AuthenticatedApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const session = await getSession({ req });

  if (session?.user) {
    setUser({
      email: session.user.email ?? void 0,
      username: session.user.name ?? void 0,
    });
    req.session = session;
    next();
  } else {
    res.status(401).send("User not authenticated");
  }
}

// This crap is all copy-pasted from @sentry/nextjs and refactored to work with next-connect
type AugmentedNextApiResponse = NextApiResponse & {
  __sentryTransaction?: Transaction;
};

export async function onError(
  error: unknown,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentScope = getCurrentHub().getScope();
  const objectifiedErr = objectify(error);
  if (currentScope) {
    currentScope.addEventProcessor((event) => {
      addExceptionMechanism(event, {
        type: "instrument",
        handled: true,
        data: {
          function: "withSentry",
        },
      });
      return event;
    });
    captureException(objectifiedErr);
  }
  res.statusCode = 500;
  res.statusMessage = "Internal Server Error";
  await finishSentryProcessing(res);
  console.error(error);
  res.status(500).send("Internal Server Error");
}

export const sentry = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  res.end = wrapEndMethod(res.end);
  const local = domain.create();
  local.add(req);
  local.add(res);
  const boundHandler = local.bind(async () => {
    const currentScope = getCurrentHub().getScope();
    if (currentScope) {
      currentScope.addEventProcessor((event) => parseRequest(event, req));
      if (hasTracingEnabled()) {
        let traceparentData;
        if (req.headers && isString(req.headers["sentry-trace"])) {
          traceparentData = extractTraceparentData(req.headers["sentry-trace"]);
        }
        const url = `${req.url}`;
        let reqPath = stripUrlQueryAndFragment(url);
        if (req.query) {
          for (const [key, value] of Object.entries(req.query)) {
            reqPath = reqPath.replace(`${value}`, `[${key}]`);
          }
        }
        const reqMethod = `${(req.method || "GET").toUpperCase()} `;
        const transaction = startTransaction(
          {
            name: `${reqMethod}${reqPath}`,
            op: "http.server",
            ...traceparentData,
          },
          { request: req }
        );
        currentScope.setSpan(transaction);
        (res as AugmentedNextApiResponse).__sentryTransaction = transaction;
      }
    }
    next();
  });
  return boundHandler();
};

type ResponseEndMethod = AugmentedNextApiResponse["end"];
type WrappedResponseEndMethod = AugmentedNextApiResponse["end"];

function wrapEndMethod(origEnd: ResponseEndMethod): WrappedResponseEndMethod {
  // @ts-ignore
  return async function newEnd(
    this: AugmentedNextApiResponse,
    ...args: unknown[]
  ) {
    await finishSentryProcessing(this);

    // @ts-ignore
    return origEnd.call(this, ...args);
  };
}

async function finishSentryProcessing(
  res: AugmentedNextApiResponse
): Promise<void> {
  const { __sentryTransaction: transaction } = res;
  if (transaction) {
    transaction.setHttpStatus(res.statusCode);
    const transactionFinished: Promise<void> = new Promise((resolve) => {
      setImmediate(() => {
        transaction.finish();
        resolve();
      });
    });
    await transactionFinished;
  }
  try {
    await flush(2000);
  } catch (e) {}
}
