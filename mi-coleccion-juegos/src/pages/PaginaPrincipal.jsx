import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { db } from '../api/firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function PaginaPrincipal() {
  const [videojuegos, setVideojuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const coleccion = collection(db, 'videojuegos');
    const unsubscribe = onSnapshot(coleccion, (querySnapshot) => {
      const listaVideojuegos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVideojuegos(listaVideojuegos);
      setCargando(false);
    }, (error) => {
      console.error("Error al obtener los documentos: ", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este videojuego?");
    if (confirmar) {
      try {
        await deleteDoc(doc(db, "videojuegos", id));
        console.log("Documento eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el documento: ", error);
      }
    }
  };

  return (
    <Container fluid className="my-5">
      <h1 className="text-center mb-4 titulo-principal-neon" style={{ color: 'var(--color-rosa-neon)' }}>Mi Colección de Videojuegos</h1>
      {cargando ? (
        <div className="text-center">
          <Spinner animation="border" variant="light" />
          <p className="mt-2" style={{ color: 'var(--color-blanco-brillante)' }}>Cargando videojuegos...</p>
        </div>
      ) : videojuegos.length > 0 ? (
        <Row>
          {videojuegos.map(juego => (
            <Col xs={12} sm={6} md={4} key={juego.id} className="mb-4">
              <Card bg="dark" text="white" className="h-100 card-glow-effect">
                <div className="hologram-effect"></div>
                <Card.Img variant="top" src={juego.imagen} alt={juego.nombre} className="card-img-custom" />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{juego.nombre}</Card.Title>
                  <Card.Text>
                    <p><strong>Plataformas:</strong> {juego.plataforma}</p>
                    <p><strong>Géneros:</strong> {juego.genero}</p>
                    <p><strong>Año:</strong> {juego.año}</p>
                    {juego.valoracion && <p><strong>Mi Valoración:</strong> {juego.valoracion}</p>}
                    {juego.estrellas > 0 && (
                      <p>
                        <strong>Calificación: </strong>
                        {[...Array(juego.estrellas)].map((_, i) => (
                          <span key={i} style={{ color: 'gold' }}>★</span>
                        ))}
                      </p>
                    )}
                  </Card.Text>
                  <div className="mt-auto">
                    <Button 
                      variant="warning" 
                      size="sm" 
                      className="me-2"
                      onClick={() => navigate(`/editar/${juego.id}`)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleEliminar(juego.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center" style={{ color: 'var(--color-gris-intermedio)' }}>No hay videojuegos en la colección. ¡Añade uno para empezar!</p>
      )}
    </Container>
  );
}

export default PaginaPrincipal;