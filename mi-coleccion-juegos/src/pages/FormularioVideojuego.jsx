import { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { db } from '../api/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;

function FormularioVideojuego() {
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [plataforma, setPlataforma] = useState('');
    const [genero, setGenero] = useState('');
    const [año, setAño] = useState('');
    const [imagen, setImagen] = useState('');
    const [valoracion, setValoracion] = useState(''); // Nuevo estado para la valoración
    const [estrellas, setEstrellas] = useState(0); // Nuevo estado para las estrellas
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
    const navigate = useNavigate();
    const [esEditando, setEsEditando] = useState(false);

    useEffect(() => {
        if (id) {
            setEsEditando(true);
            const obtenerVideojuego = async () => {
                const docRef = doc(db, 'videojuegos', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const datos = docSnap.data();
                    setNombre(datos.nombre || '');
                    setPlataforma(datos.plataforma || '');
                    setGenero(datos.genero || '');
                    setAño(datos.año || '');
                    setImagen(datos.imagen || '');
                    setValoracion(datos.valoracion || '');
                    setEstrellas(datos.estrellas || 0);
                } else {
                    console.log("No existe el documento");
                }
            };
            obtenerVideojuego();
        }
    }, [id]);

    const buscarJuego = async (query) => {
        if (query.length < 3) {
            setResultadosBusqueda([]);
            return;
        }

        setCargandoBusqueda(true);
        try {
            const response = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${query}`);
            setResultadosBusqueda(response.data.results);
        } catch (error) {
            console.error("Error al buscar el juego: ", error);
            setResultadosBusqueda([]);
        } finally {
            setCargandoBusqueda(false);
        }
    };

    const seleccionarJuego = (juego) => {
        setNombre(juego.name);
        setPlataforma(juego.platforms ? juego.platforms.map(p => p.platform.name).join(', ') : 'N/A');
        setGenero(juego.genres ? juego.genres.map(g => g.name).join(', ') : 'N/A');
        setAño(juego.released ? juego.released.split('-')[0] : 'N/A');
        setImagen(juego.background_image);
        setResultadosBusqueda([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const datos = {
                nombre,
                plataforma,
                genero,
                año,
                imagen,
                valoracion, // Incluye la nueva valoración
                estrellas, // Incluye las nuevas estrellas
            };

            if (esEditando) {
                const docRef = doc(db, 'videojuegos', id);
                await updateDoc(docRef, datos);
                console.log("Documento actualizado con ID: ", id);
            } else {
                const docRef = await addDoc(collection(db, 'videojuegos'), datos);
                console.log("Documento escrito con ID: ", docRef.id);
            }
            navigate('/');
        } catch (e) {
            console.error("Error al procesar el documento: ", e);
        }
    };
    
    // Función para manejar el clic en una estrella
    const handleEstrellasClick = (numEstrellas) => {
        setEstrellas(numEstrellas);
    };

    return (
        <Container className="my-5">
            <h1 className="text-center" style={{ color: 'var(--color-rosa-neon)' }}>
                {esEditando ? "Editar Videojuego" : "Añadir Nuevo Videojuego"}
            </h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formNombre">
                    <Form.Label>Nombre del Videojuego</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Ingresa el nombre del videojuego" 
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            buscarJuego(e.target.value);
                        }}
                    />
                    {cargandoBusqueda ? (
                        <p>Buscando...</p>
                    ) : (
                        <ListGroup className="mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {resultadosBusqueda.map(juego => (
                                <ListGroup.Item 
                                    key={juego.id} 
                                    action 
                                    onClick={() => seleccionarJuego(juego)}
                                    style={{ backgroundColor: 'var(--color-fondo-oscuro)', color: 'var(--color-blanco-brillante)', borderColor: 'var(--color-gris-intermedio)' }}
                                >
                                    {juego.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPlataforma">
                    <Form.Label>Plataforma</Form.Label>
                    <Form.Control type="text" value={plataforma} onChange={(e) => setPlataforma(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGenero">
                    <Form.Label>Género</Form.Label>
                    <Form.Control type="text" value={genero} onChange={(e) => setGenero(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAño">
                    <Form.Label>Año de Lanzamiento</Form.Label>
                    <Form.Control type="text" value={año} onChange={(e) => setAño(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formImagen">
                    <Form.Label>URL de Imagen</Form.Label>
                    <Form.Control type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} />
                </Form.Group>
                
                {/* Nuevo campo de valoración */}
                <Form.Group className="mb-3" controlId="formValoracion">
                    <Form.Label>Mi Valoración</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="Escribe tu opinión sobre el juego"
                        value={valoracion}
                        onChange={(e) => setValoracion(e.target.value)}
                    />
                </Form.Group>

                {/* Nuevo componente de estrellas (aún no existe) */}
                <Form.Group className="mb-3">
                    <Form.Label>Calificación</Form.Label>
                    <div>
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                onClick={() => handleEstrellasClick(i + 1)}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '2rem',
                                    color: i < estrellas ? 'gold' : 'gray'
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </Form.Group>

                <Button variant="primary" type="submit">
                    {esEditando ? "Actualizar" : "Guardar"}
                </Button>
            </Form>
        </Container>
    );
}

export default FormularioVideojuego;