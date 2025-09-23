import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaGamepad } from "react-icons/fa";
import { Navbar as BNavbar, Nav, Offcanvas } from 'react-bootstrap';

function Navbar() {
  const brandContent = (
    <>
      <div className={styles.joystickIcon}>
        <FaGamepad size={20} color="white" />
      </div>
      <div className={styles.tituloFondo}>
        <h4>Mi Colección</h4>
      </div>
      <div className={styles.joystickIcon}>
        <FaGamepad size={20} color="white" />
      </div>
    </>
  );

  return (
    <>
      {/* Navbar para dispositivos móviles (desplegable) */}
      <BNavbar expand="lg" variant="dark" className={`${styles.navbarMobile} p-3 d-lg-none`} fixed="top">
        <BNavbar.Brand className={styles.header}>
          {brandContent}
        </BNavbar.Brand>
        <BNavbar.Toggle aria-controls="offcanvasNavbar" />
        <BNavbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          style={{ backgroundColor: 'var(--color-fondo-oscuro)' }}
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title id="offcanvasNavbarLabel">
              <span style={{ color: 'var(--color-rosa-neon)' }}>Menú</span>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <NavLink to="/" className={`${styles.navLink} nav-link`} end>
                Mi Colección
              </NavLink>
              <NavLink to="/crear" className={`${styles.navLink} nav-link`}>
                Agregar Juego
              </NavLink>
              <NavLink to="/sugerencias" className={`${styles.navLink} nav-link`}>
                Sugerencias
              </NavLink>
            </Nav>
          </Offcanvas.Body>
        </BNavbar.Offcanvas>
      </BNavbar>

      {/* Navbar para pantallas grandes (barra lateral) */}
      <nav className={`${styles.sidebar} d-none d-lg-flex flex-column text-white`}>
        <header className={styles.header}>
          {brandContent}
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
    </>
  );
}

export default Navbar;