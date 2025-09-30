# 🎮 Mi Colección de Videojuegos

![Joysticks]

Una **aplicación web** desarrollada con React para los verdaderos amantes de los videojuegos. El proyecto funciona como una base de datos personal donde puedes **gestionar, calificar y sugerir** tus títulos favoritos. Implementa una solución **CRUD** completa para mantener tu colección actualizada en tiempo real.

---

## ✨ Características Principales

|  | Característica | Descripción |
| :---: | :--- | :--- |
| **🚀** | **CRUD Completo** | Crea, lee, actualiza y elimina juegos de tu colección de forma intuitiva. |
| **⭐** | **Calificación y Sugerencias** | Permite calificar tus juegos favoritos y enviar sugerencias a la base de datos. |
| **🧱** | **Formularios Robustos** | Uso de **React Hook Form** para manejo avanzado de estados de formulario, validación y performance. |
| **☁️** | **Persistencia de Datos** | La colección se almacena y actualiza en tiempo real utilizando **Firebase Firestore**. |
| **🔍** | **Integración Externa** | Conexión a la **API de RAWG** para obtener datos, imágenes y descripciones de videojuegos. |
| **👤** | **Multi-Usuario (Futuro)** | Diseñado para soportar un futuro sistema de usuarios con colecciones privadas. |

---

## 💻 Tecnologías y Librerías Utilizadas

Este proyecto fue desarrollado con React y las siguientes herramientas clave:

### Frontend
| Categoría | Librería/Herramienta | Propósito |
| :---: | :--- | :--- |
| **Core** | `react` | Interfaz de usuario declarativa. |
| **Rutas** | `react-router-dom` | Navegación entre las vistas de la SPA. |
| **Estilos** | `react-bootstrap` | Componentes de UI pre-diseñados y responsivos. |
| **Formularios** | `react-hook-form` | Optimización y validación de formularios. |
| **Íconos** | `react-icons` | Utilizado para los iconos dentro de la interfaz. |

### Backend & Servicios
| Categoría | Servicio/Librería | Propósito |
| :---: | :--- | :--- |
| **Base de Datos** | `firebase` (Firestore) | Almacenamiento y sincronización de datos en la nube. |
| **API Externa** | RAWG API | Fuente de datos para buscar y mostrar información de videojuegos. |

---

## ⚙️ Guía de Instalación y Configuración Local

Sigue estos pasos para levantar el proyecto en tu máquina local.

### 1. Prerrequisitos
Asegúrate de tener instalado:
* **[Node.js](https://nodejs.org/)** (se recomienda la versión 22 LTS).
* **[npm](https://www.npmjs.com/)** o **[yarn](https://yarnpkg.com/)**.

### 2. Clonar y Configurar

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/SebasAlRivas/Proyecto-Final-Desarrollo-Web.git](https://github.com/SebasAlRivas/Proyecto-Final-Desarrollo-Web.git)
    cd Proyecto-Final-Desarrollo-Web/mi-coleccion-juegos
    ```

2.  **Instala todas las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo llamado **`.env`** en la carpeta `mi-coleccion-juegos` y añade tus claves de API para la conexión a los servicios.

    ```
    REACT_APP_RAWG_API_KEY=tu_clave_de_rawg
    REACT_APP_FIREBASE_API_KEY=tu_clave_de_firebase
    REACT_APP_YOUTUBE_API_KEY=tu_clave_de_youtube
    ```

### 3. Iniciar la Aplicación

Inicia la aplicación en modo de desarrollo:

```bash
npm start