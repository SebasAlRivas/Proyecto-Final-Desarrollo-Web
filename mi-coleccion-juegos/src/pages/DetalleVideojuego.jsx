import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../api/firebase';
import axios from 'axios';
import { Container, Spinner, Row, Col, Button } from 'react-bootstrap';

function DetalleVideojuego() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [juego, setJuego] = useState(null);
  const [youtubeId, setYoutubeId] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Variable de entorno
  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  useEffect(() => {
    const obtenerDetalles = async () => {
      setCargando(true);
      try {
        // 1. Obtener datos del juego desde Firebase
        const docRef = doc(db, 'videojuegos', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const datosFirebase = docSnap.data();
          setJuego(datosFirebase);

          // 2. Usar el nombre del juego para buscar un tráiler en YouTube
          const nombreJuego = datosFirebase.nombre;
          const youtubeRes = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${nombreJuego} official trailer&type=video&key=${YOUTUBE_API_KEY}`
          );
          
          if (youtubeRes.data.items && youtubeRes.data.items.length > 0) {
            setYoutubeId(youtubeRes.data.items[0].id.videoId);
          } else {
            setYoutubeId(null);
          }
        } else {
          console.log("No se encontró el videojuego en Firebase.");
          setJuego(null);
        }
      } catch (error) {
        console.error("Error al obtener los detalles del videojuego: ", error);
        setJuego(null);
        setYoutubeId(null);
      } finally {
        setCargando(false);
      }
    };
    obtenerDetalles();
  }, [id, YOUTUBE_API_KEY]);

  if (!juego && !cargando) {
    return (
      <Container className="my-5 text-center">
        <p style={{ color: 'var(--color-blanco-brillante)' }}>No se pudo cargar la información del videojuego.</p>
        <Button onClick={() => navigate('/')} variant="primary">Volver a la página principal</Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {cargando ? (
        <div className="text-center">
          <Spinner animation="border" variant="light" />
          <p className="mt-2" style={{ color: 'var(--color-blanco-brillante)' }}>Cargando detalles del juego...</p>
        </div>
      ) : (
        <div className="p-4 rounded" style={{ backgroundColor: 'var(--color-fondo-oscuro)' }}>
          <Button onClick={() => navigate(-1)} variant="primary" className="mb-3">
            ← Volver
          </Button>
          <h1 className="text-center mb-4 titulo-principal-neon" style={{ color: 'var(--color-rosa-neon)' }}>{juego.nombre}</h1>
          <Row>
            <Col md={6} className="text-center mb-4">
              <img src={juego.imagen} alt={juego.nombre} className="img-fluid rounded" style={{ maxWidth: '400px', height: 'auto' }} />
            </Col>
            <Col md={6}>
              <div style={{ color: 'var(--color-blanco-brillante)' }}>
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
              </div>
            </Col>
          </Row>
          {youtubeId ? (
            <div className="mt-5 text-center">
              <h3 style={{ color: 'var(--color-rosa-neon)' }}>Tráiler del Juego</h3>
              <div className="embed-responsive embed-responsive-16by9 mt-3" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  className="embed-responsive-item"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0`}
                  title={`${juego.nombre} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="mt-5 text-center">
              <p style={{ color: 'var(--color-gris-claro-formulario)' }}>No hay un tráiler disponible para este videojuego.</p>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

export default DetalleVideojuego;