import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { db } from '../api/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function FormularioVideojuego() {
  const [nombre, setNombre] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [genero, setGenero] = useState('');
  const [año, setAño] = useState('');
  const [imagen, setImagen] = useState('');
  const [valoracion, setValoracion] = useState('');
  const [estrellas, setEstrellas] = useState(0);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const esEdicion = !!id;
  const timeoutRef = useRef(null);

  useEffect(() => {
    const obtenerVideojuego = async () => {
      if (esEdicion) {
        const docRef = doc(db, 'videojuegos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre || '');
          setPlataforma(data.plataforma || '');
          setGenero(data.genero || '');
          setAño(data.año || '');
          setImagen(data.imagen || '');
          setValoracion(data.valoracion || '');
          setEstrellas(data.estrellas || 0);
        }
      }
    };
    obtenerVideojuego();
  }, [id, esEdicion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = { nombre, plataforma, genero, año, imagen, valoracion, estrellas: Number(estrellas) };

    try {
      if (esEdicion) {
        const docRef = doc(db, 'videojuegos', id);
        await updateDoc(docRef, datos);
      } else {
        await addDoc(collection(db, 'videojuegos'), datos);
      }
      navigate('/');
    } catch (error) {
      console.error("Error al guardar el documento: ", error);
    }
  };

  const handleNombreChange = (e) => {
    const value = e.target.value;
    setNombre(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.length > 2) {
      setLoadingSearch(true);
      timeoutRef.current = setTimeout(async () => {
        try {
          const response = await axios.get(`https://api.rawg.io/api/games?key=${process.env.REACT_APP_RAWG_API_KEY}&search=${value}`);
          setSearchResults(response.data.results);
        } catch (error) {
          console.error("Error al buscar juegos: ", error);
          setSearchResults([]);
        } finally {
          setLoadingSearch(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
      setLoadingSearch(false);
    }
  };

  const fillForm = (game) => {
    setNombre(game.name || '');
    setPlataforma(game.platforms?.map(p => p.platform.name).join(', ') || '');
    setGenero(game.genres?.map(g => g.name).join(', ') || '');
    setAño(game.released?.split('-')[0] || '');
    setImagen(game.background_image || '');
    setSearchResults([]);
  };

  const renderEstrellas = () => {
    const estrellasArray = [];
    for (let i = 1; i <= 5; i++) {
      estrellasArray.push(
        <span
          key={i}
          className="star"
          onClick={() => setEstrellas(i)}
          style={{ cursor: 'pointer', color: i <= estrellas ? 'gold' : 'gray', fontSize: '24px' }}
        >
          ★
        </span>
      );
    }
    return estrellasArray;
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4 titulo-principal-neon" style={{ color: 'var(--color-rosa-neon)' }}>
        {esEdicion ? 'Editar Videojuego' : 'Añadir Nuevo Videojuego'}
      </h1>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Form onSubmit={handleSubmit} className="p-4 rounded" style={{ backgroundColor: 'var(--color-fondo-oscuro)' }}>
            
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre del Videojuego</Form.Label>
              <Form.Control 
                type="text" 
                value={nombre} 
                onChange={handleNombreChange} 
                required 
                placeholder="Ej: The Last of Us"
              />
              {loadingSearch && <Spinner animation="border" size="sm" className="mt-2" />}
            </Form.Group>

            {searchResults.length > 0 && (
              <div className="my-4">
                <h5 style={{ color: 'var(--color-blanco-brillante)' }}>Resultados de la búsqueda:</h5>
                <Row>
                  {searchResults.slice(0, 3).map(game => (
                    <Col key={game.id} xs={12} md={4} className="mb-3">
                      <Card className="h-100" bg="dark" text="white">
                        <Card.Img variant="top" src={game.background_image} />
                        <Card.Body>
                          <Card.Title>{game.name}</Card.Title>
                          <Button variant="primary" onClick={() => fillForm(game)} className="mt-2">
                            Seleccionar
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
            
            <Form.Group className="mb-3" controlId="formPlataforma">
              <Form.Label>Plataforma</Form.Label>
              <Form.Control type="text" value={plataforma} onChange={(e) => setPlataforma(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGenero">
              <Form.Label>Género</Form.Label>
              <Form.Control type="text" value={genero} onChange={(e) => setGenero(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAño">
              <Form.Label>Año de Lanzamiento</Form.Label>
              <Form.Control type="number" value={año} onChange={(e) => setAño(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formImagen">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control type="url" value={imagen} onChange={(e) => setImagen(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formValoracion">
              <Form.Label>Mi Valoración</Form.Label>
              <Form.Control type="text" value={valoracion} onChange={(e) => setValoracion(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEstrellas">
              <Form.Label>Calificación (Estrellas)</Form.Label>
              <div>{renderEstrellas()}</div>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {esEdicion ? 'Guardar Cambios' : 'Añadir Videojuego'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default FormularioVideojuego;