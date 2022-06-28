import { Container, Navbar, Button } from "react-bootstrap";
import { signOut } from "next-auth/react";

export default function SiteNavbar() {
  return (
    <Navbar bg="light" className="mb-3">
      <Container>
        <Navbar.Brand>News Revealer</Navbar.Brand>
        <Button
          variant="outline-secondary"
          onClick={() => signOut()}
          className="ms-auto"
        >
          Sign Out
        </Button>
      </Container>
    </Navbar>
  );
}
