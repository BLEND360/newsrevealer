import "../styles/globals.scss";
import { AppProps } from "next/app";
import Head from "next/head";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { SessionProvider } from "next-auth/react";
import Auth from "../components/Auth";
import SiteNavbar from "../components/SiteNavbar";
import { ErrorBoundary } from "@sentry/nextjs";

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>News Revealer</title>
      </Head>
      <SessionProvider>
        <ErrorBoundary
          fallback={
            <div className="d-flex align-items-center justify-content-center flex-column flex-grow-1">
              <h2>A fatal error occurred</h2>
              <p className="lead">Try refreshing the page.</p>
            </div>
          }
        >
          <Auth>
            <SiteNavbar />
            <Component {...pageProps} />
          </Auth>
        </ErrorBoundary>
      </SessionProvider>
    </>
  );
}
