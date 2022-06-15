import { Container, Navbar, Button } from "react-bootstrap";
import Select from "react-select";
import deployments from "../lib/deployments";
import { signOut } from "next-auth/react";

export default function SiteNavbar() {
  return (
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
        <Button
          variant="outline-secondary"
          onClick={() => signOut()}
          className="ms-3"
        >
          Sign Out
        </Button>
      </Container>
    </Navbar>
  );
}
