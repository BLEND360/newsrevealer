import "../styles/globals.scss";
import { AppProps } from "next/app";
import Head from "next/head";
import { Container, Navbar } from "react-bootstrap";
import Select from "react-select";
import deployments from "../lib/deployments";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>News Revealer</title>
      </Head>
      <Navbar bg="light" className="mb-3">
        <Container>
          <Navbar.Brand>News Revealer</Navbar.Brand>
          <Select
            className="ms-auto"
            onChange={(value) => value && (window.location.host = value.url)}
            value={{
              value: process.env.NEXT_PUBLIC_STAGE,
              label: deployments[process.env.NEXT_PUBLIC_STAGE]?.label ?? "",
              url: deployments[process.env.NEXT_PUBLIC_STAGE]?.url,
            }}
            options={Object.entries(deployments).map(
              ([value, { label, url }]) => ({
                value,
                label,
                url,
              })
            )}
          />
        </Container>
      </Navbar>
      <Component {...pageProps} />
    </>
  );
}
