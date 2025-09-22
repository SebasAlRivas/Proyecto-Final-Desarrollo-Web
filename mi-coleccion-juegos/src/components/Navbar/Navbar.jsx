import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
    return (
        <nav className={styles.sidebar}>
            <div className={styles.header}>
                <h4>🎮 Colección de Juegos</h4>
            </div>
            <ul className={styles.menu}>
                <li>
                    <NavLink to="/" exact="true">
                        Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/crear">
                        Añadir Videojuego
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/sugerencias">
                        Sugerencias
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;