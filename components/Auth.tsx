import { signIn, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { setUser } from "@sentry/nextjs";
import Loading from "./Loading";

export interface AuthProps {
  children: ReactNode;
}

export default function Auth({ children }: AuthProps) {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });

  useEffect(() => {
    if (session) {
      setUser({
        email: session.user?.email ?? void 0,
        username: session.user?.name ?? void 0,
      });
    }
  }, [session]);

  if (status === "loading") return <Loading />;

  return <>{children}</>;
}
