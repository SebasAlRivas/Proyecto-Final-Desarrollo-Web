import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <footer className={`${styles.footer}`}>
      <div className={styles.footerContenedor}>
        <div className={styles.footerTexto}>
          <p className={styles.footerParrafo}>Desarrollado con React y Firebase</p>
          <p className={styles.footerParrafo}>© 2025 Mi Colección de Juegos</p>
        </div>
        <div className={styles.footerRedesSociales}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.footerIcono}>
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.footerIcono}>
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.footerIcono}>
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;