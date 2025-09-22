import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaPrincipal from './pages/PaginaPrincipal';
import DetalleVideojuego from './pages/DetalleVideojuego';
import FormularioVideojuego from './pages/FormularioVideojuego';
import Sugerencias from './pages/Sugerencias';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './styles/layout.css';

function App() {
  return (
    <BrowserRouter>
      <div className="contenedor-principal-app">
        <Navbar />
        <div className="contenedor-flex-content">
          <Routes>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="/crear" element={<FormularioVideojuego />} />
            <Route path="/editar/:id" element={<FormularioVideojuego />} />
            <Route path="/videojuego/:id" element={<DetalleVideojuego />} />
            <Route path="/sugerencias" element={<Sugerencias />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
