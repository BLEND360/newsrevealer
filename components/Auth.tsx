import { signIn, useSession } from "next-auth/react";
import { ReactNode } from "react";
import Loading from "./Loading";

export interface AuthProps {
  children: ReactNode;
}

export default function Auth({ children }: AuthProps) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });

  if (status === "loading") return <Loading />;

  return <>{children}</>;
}
