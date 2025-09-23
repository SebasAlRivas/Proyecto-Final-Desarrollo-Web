import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaGamepad } from "react-icons/fa";

function Navbar() {
  return (
    <nav className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.joystickIcon}>
          <FaGamepad size={20} color="white" />
        </div>
        <div className={styles.tituloFondo}>
          <h4>Mi Colección</h4>
        </div>
        <div className={styles.joystickIcon}>
          <FaGamepad size={20} color="white" />
        </div>
      </header>
      <ul className={styles.menu}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Mi Colección
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/crear"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Agregar Juego
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/sugerencias"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Sugerencias
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;