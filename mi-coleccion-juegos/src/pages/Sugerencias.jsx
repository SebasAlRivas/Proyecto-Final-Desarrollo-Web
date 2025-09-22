import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { db } from '../api/firebase';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import styles from './Sugerencias.module.css';

function Sugerencias() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    sugerencia: '',
  });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(false);
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerSugerencias();
  }, []);

  const obtenerSugerencias = async () => {
    try {
      const q = query(collection(db, 'sugerencias'), orderBy('fecha', 'desc'));
      const querySnapshot = await getDocs(q);
      const listaSugerencias = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSugerencias(listaSugerencias);
    } catch (e) {
      console.error("Error al obtener las sugerencias: ", e);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.nombre && formData.sugerencia) {
      try {
        await addDoc(collection(db, 'sugerencias'), {
          ...formData,
          fecha: new Date(),
        });
        setEnviado(true);
        setError(false);
        setFormData({
          nombre: '',
          email: '',
          sugerencia: '',
        });
        console.log("Sugerencia enviada y guardada en Firestore.");
        obtenerSugerencias();
      } catch (e) {
        console.error("Error al guardar la sugerencia: ", e);
        setError(true);
        setEnviado(false);
      }
    } else {
      setError(true);
      setEnviado(false);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center" style={{ color: 'var(--color-rosa-neon)' }}>Formulario de Sugerencias</h1>
      <p className="text-center" style={{ color: 'var(--color-blanco-brillante)' }}>
        ¿Qué videojuego nos sugieres añadir?
      </p>

      {enviado && (
        <Alert variant="success">
          ¡Gracias por tu sugerencia!
        </Alert>
      )}

      {error && (
        <Alert variant="danger">
          Por favor, completa los campos obligatorios del formulario.
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group className="mb-3" controlId="formNombre">
          <Form.Label>Tu Nombre</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ingresa tu nombre" 
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Tu Correo Electrónico (opcional)</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Ingresa tu correo" 
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSugerencia">
          <Form.Label>Videojuego Sugerido</Form.Label>
          <Form.Control 
            type="text"
            placeholder="Escribe el nombre del juego aquí" 
            name="sugerencia"
            value={formData.sugerencia}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Enviar Sugerencia
        </Button>
      </Form>

      <h2 className="text-center mt-5" style={{ color: 'var(--color-rosa-neon)' }}>Sugerencias de la Comunidad</h2>
      {cargando ? (
          <div className="text-center">
              <Spinner animation="border" variant="light" />
              <p className="mt-2" style={{ color: 'var(--color-blanco-brillante)' }}>Cargando sugerencias...</p>
          </div>
      ) : (
        <div className="mt-4">
          {sugerencias.length > 0 ? (
            sugerencias.map(sug => (
              <Card key={sug.id} bg="dark" text="white" className={`${styles.sugerenciaCard} mb-3`}>
                <Card.Body>
                  <Card.Title>{sug.sugerencia}</Card.Title>
                  <Card.Text>
                    Sugerido por: **{sug.nombre}**
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p className="text-center" style={{ color: 'var(--color-gris-intermedio)' }}>Aún no hay sugerencias. ¡Sé el primero!</p>
          )}
        </div>
      )}
    </Container>
  );
}

export default Sugerencias;