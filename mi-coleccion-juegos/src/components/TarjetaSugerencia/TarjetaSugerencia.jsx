import React from 'react';
import { Card } from 'react-bootstrap';

function TarjetaSugerencia({ sugerencia }) {
  return (
    <Card bg="dark" text="white" className="h-100">
      <Card.Body>
        <Card.Title>{sugerencia.nombre}</Card.Title>
        <Card.Text>
          <strong>Email:</strong> {sugerencia.email}
          <br />
          <strong>Sugerencia:</strong> {sugerencia.sugerencia}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default TarjetaSugerencia;