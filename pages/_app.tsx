import "../styles/globals.scss";
import { AppProps } from "next/app";
import Head from "next/head";
import { Alert, Container, Modal, Navbar } from "react-bootstrap";
import Select from "react-select";
import deployments from "../lib/deployments";
import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(process.env.NEXT_PUBLIC_STAGE !== "stable");
  }, []);

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
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Alert
          variant="danger"
          className="mb-0"
          dismissible
          onClose={() => setShowAlert(false)}
        >
          <Alert.Heading>This is a non-production release.</Alert.Heading>
          <p className="mb-0">Bla bla bla. Bla bla BlA bLa BlA.</p>
        </Alert>
      </Modal>
    </>
  );
}
