import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import TarjetaSugerencia from '../components/TarjetaSugerencia/TarjetaSugerencia';
import { db } from '../api/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function Sugerencias() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [sugerencia, setSugerencia] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const obtenerSugerencias = async () => {
    setCargando(true);
    try {
      const coleccionSugerencias = collection(db, 'sugerencias');
      const docsSugerencias = await getDocs(coleccionSugerencias);
      const listaSugerencias = docsSugerencias.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSugerencias(listaSugerencias);
    } catch (error) {
      console.error("Error al obtener las sugerencias: ", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerSugerencias();
  }, []);

  useEffect(() => {
    if (sugerencias.length > 3) {
      const timer = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % (sugerencias.length));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [sugerencias]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'sugerencias'), {
        nombre,
        email,
        sugerencia,
        fecha: new Date().toISOString()
      });
      setMensaje({ tipo: 'success', texto: '¡Gracias por tu sugerencia! Ha sido enviada correctamente.' });
      setNombre('');
      setEmail('');
      setSugerencia('');
      obtenerSugerencias();
    } catch (error) {
      console.error("Error al enviar la sugerencia: ", error);
      setMensaje({ tipo: 'danger', texto: 'Ocurrió un error al enviar la sugerencia. Por favor, inténtalo de nuevo.' });
    }
  };

  const visibleSugerencias = sugerencias.slice(currentIndex, currentIndex + 3);
  if (sugerencias.length - currentIndex < 3 && sugerencias.length > 3) {
    visibleSugerencias.push(...sugerencias.slice(0, 3 - (sugerencias.length - currentIndex)));
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4 titulo-principal-neon" style={{ color: 'var(--color-rosa-neon)' }}>
        Sugerencias
      </h1>
      <div className="d-flex justify-content-center">
        <div style={{ backgroundColor: 'var(--color-fondo-oscuro)', padding: '2rem', borderRadius: '8px', maxWidth: '600px', width: '100%' }}>
          {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Ingresa tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" placeholder="Ingresa tu correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSugerencia">
              <Form.Label>Tu Sugerencia</Form.Label>
              <Form.Control as="textarea" rows={5} placeholder="Escribe tu sugerencia aquí..." value={sugerencia} onChange={(e) => setSugerencia(e.target.value)} required />
            </Form.Group>
            
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Enviar Sugerencia
            </Button>
          </Form>
        </div>
      </div>
      
      <hr className="my-5" style={{ borderColor: 'var(--color-gris-intermedio)' }} />

      <h2 className="text-center mb-4 titulo-principal-neon" style={{ color: 'var(--color-rosa-neon)' }}>
        Sugerencias de Usuarios
      </h2>
      {cargando ? (
        <div className="text-center">
          <Spinner animation="border" variant="light" />
          <p className="mt-2" style={{ color: 'var(--color-blanco-brillante)' }}>Cargando sugerencias...</p>
        </div>
      ) : sugerencias.length > 0 ? (
        <div className="slider-container-sugerencias">
          <div className="slider-wrapper-sugerencias" style={{ transform: `translateX(-${currentIndex * 33.3333}%)` }}>
            {sugerencias.map((sugerencia) => (
              <div className="slider-item-sugerencias" key={sugerencia.id}>
                <TarjetaSugerencia sugerencia={sugerencia} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center" style={{ color: 'var(--color-gris-intermedio)' }}>Aún no hay sugerencias. ¡Sé el primero en enviar una!</p>
      )}
    </Container>
  );
}

export default Sugerencias;