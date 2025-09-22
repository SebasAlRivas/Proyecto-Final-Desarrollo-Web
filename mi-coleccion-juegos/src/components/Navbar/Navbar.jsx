import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faPlus, faHome, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.joystickIcon}>
          <FontAwesomeIcon icon={faGamepad} size="2x" />
        </div>
        <div className={styles.tituloFondo}>
          <h4>Mi Colección de Juegos</h4>
        </div>
      </div>
      <ul className={styles.menu}>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            <FontAwesomeIcon icon={faHome} /> Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/crear" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            <FontAwesomeIcon icon={faPlus} /> Añadir Juego
          </NavLink>
        </li>
        <li>
          <NavLink to="/sugerencias" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            <FontAwesomeIcon icon={faThumbsUp} /> Sugerencias
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;