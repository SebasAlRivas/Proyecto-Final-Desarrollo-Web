import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <footer className={`${styles.footer} mt-auto py-3`}>
      <div className="container">
        <div className="row d-flex justify-content-between align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">Desarrollado con React y Firebase</p>
            <p className="mb-0">© 2025 Mi Colección de Juegos</p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white">
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;