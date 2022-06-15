import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import Credentials from "next-auth/providers/credentials";
import secrets from "../../../lib/server/secrets";
import { NextApiRequest, NextApiResponse } from "next";
import * as crypto from "crypto";
import { getUser } from "../../../lib/server/db";

const nextAuth = (async () =>
  NextAuth({
    providers: [
      AzureADProvider({
        clientId: (await secrets).AZURE_CLIENT_ID,
        clientSecret: (await secrets).AZURE_SECRET,
        tenantId: (await secrets).AZURE_TENANT,
        authorization: { params: { scope: "openid profile email" } },
        name: "Microsoft",
        idToken: true,
      }),
      Credentials({
        name: "Password",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await getUser(credentials.email.toLowerCase());
          if (!user) return null;
          const hashed = crypto.scryptSync(credentials.password, user.salt, 64);
          if (crypto.timingSafeEqual(hashed, user.password)) {
            return {
              email: credentials.email.toLowerCase(),
              name: user.name,
            };
          } else {
            return null;
          }
        },
      }),
    ],
    secret: (await secrets).NEXTAUTH_SECRET,
  }))();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return (await nextAuth)(req, res);
}
