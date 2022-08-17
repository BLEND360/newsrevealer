import * as Sentry from "@sentry/nextjs";
import { NextPage } from "next";

const ErrorPage: NextPage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center flex-column flex-grow-1">
      <h2>A fatal error occurred</h2>
      <p className="lead">Try refreshing the page.</p>
    </div>
  );
};

ErrorPage.getInitialProps = async ({ err, asPath }) => {
  if (err) {
    Sentry.captureException(err);
  } else {
    Sentry.captureException(
      new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
    );
  }
  await Sentry.flush(2000);
  return {};
};

export default ErrorPage;
