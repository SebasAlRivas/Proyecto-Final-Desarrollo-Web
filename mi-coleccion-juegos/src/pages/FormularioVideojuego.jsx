import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { db } from '../api/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';

function FormularioVideojuego() {
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const esEdicion = !!id;
  const timeoutRef = useRef(null);

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm();

  useEffect(() => {
    const obtenerVideojuego = async () => {
      if (esEdicion) {
        const docRef = doc(db, 'videojuegos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setValue('nombre', data.nombre);
          setValue('plataforma', data.plataforma);
          setValue('genero', data.genero);
          setValue('año', data.año);
          setValue('imagen', data.imagen);
          setValue('valoracion', data.valoracion);
          setValue('estrellas', data.estrellas);
        }
      }
    };
    obtenerVideojuego();
  }, [id, esEdicion, setValue]);

  const onSubmit = async (data) => {
    try {
      if (esEdicion) {
        const docRef = doc(db, 'videojuegos', id);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, 'videojuegos'), data);
      }
      navigate('/');
    } catch (error) {
      console.error("Error al guardar el documento: ", error);
    }
  };

  const handleNombreChange = (e) => {
    const value = e.target.value;
    setValue('nombre', value);

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
    setValue('nombre', game.name || '');
    setValue('plataforma', game.platforms?.map(p => p.platform.name).join(', ') || '');
    setValue('genero', game.genres?.map(g => g.name).join(', ') || '');
    setValue('año', game.released?.split('-')[0] || '');
    setValue('imagen', game.background_image || '');
    setSearchResults([]);
  };

  const renderEstrellas = (estrellas) => {
    const estrellasArray = [];
    for (let i = 1; i <= 5; i++) {
      estrellasArray.push(
        <span
          key={i}
          className="star"
          onClick={() => setValue('estrellas', i)}
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
          <Form onSubmit={handleSubmit(onSubmit)} className="p-4 rounded" style={{ backgroundColor: 'var(--color-fondo-oscuro)' }}>
            
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre del Videojuego</Form.Label>
              <Form.Control 
                type="text" 
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                onChange={handleNombreChange} 
                placeholder="Ej: The Last of Us"
              />
              {errors.nombre && <p className="text-danger mt-1">{errors.nombre.message}</p>}
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
              <Form.Control type="text" {...register('plataforma', { required: 'La plataforma es obligatoria' })} />
              {errors.plataforma && <p className="text-danger mt-1">{errors.plataforma.message}</p>}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formGenero">
              <Form.Label>Género</Form.Label>
              <Form.Control type="text" {...register('genero', { required: 'El género es obligatorio' })} />
              {errors.genero && <p className="text-danger mt-1">{errors.genero.message}</p>}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formAño">
              <Form.Label>Año de Lanzamiento</Form.Label>
              <Form.Control type="number" {...register('año', { required: 'El año es obligatorio' })} />
              {errors.año && <p className="text-danger mt-1">{errors.año.message}</p>}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formImagen">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control type="url" {...register('imagen', { required: 'La URL de la imagen es obligatoria' })} />
              {errors.imagen && <p className="text-danger mt-1">{errors.imagen.message}</p>}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formValoracion">
              <Form.Label>Mi Valoración</Form.Label>
              <Form.Control type="text" {...register('valoracion')} />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formEstrellas">
              <Form.Label>Calificación (Estrellas)</Form.Label>
              <div>{renderEstrellas(watch('estrellas'))}</div>
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