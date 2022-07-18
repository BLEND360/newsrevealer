import { Button, Col, Modal, Row } from "react-bootstrap";
import { useState } from "react";

export interface DomainsButtonProps {
  domains: string[];
}

export default function DomainsButton({ domains }: DomainsButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button variant="outline-secondary" onClick={() => setShowModal(true)}>
        ?
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Domains</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <strong>
            News Revealer only supports articles from the following domains:
          </strong>
        </Modal.Body>
        <Modal.Body>
          <Row>
            <Col xs={6}>
              <ul>
                {domains.slice(0, domains.length / 2).map((domain) => (
                  <li key={domain}>{domain}</li>
                ))}
              </ul>
            </Col>
            <Col xs={6}>
              <ul>
                {domains.slice(domains.length / 2).map((domain) => (
                  <li key={domain}>{domain}</li>
                ))}
              </ul>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
