import "../styles/globals.scss";
import { AppProps } from "next/app";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { SessionProvider } from "next-auth/react";
import Auth from "../components/Auth";
import SiteNavbar from "../components/SiteNavbar";

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>News Revealer</title>
      </Head>
      <SessionProvider>
        <Auth>
          <SiteNavbar />
          <Component {...pageProps} />
        </Auth>
      </SessionProvider>
    </>
  );
}
