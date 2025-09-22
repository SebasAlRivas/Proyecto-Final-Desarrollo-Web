// Importa las funciones necesarias de los SDK que vas a usar
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEWbm6ujCTofRLPVAe0PEIZ676ZxiwYVg",
  authDomain: "mi-coleccion-juegos.firebaseapp.com",
  projectId: "mi-coleccion-juegos",
  storageBucket: "mi-coleccion-juegos.firebasestorage.app",
  messagingSenderId: "675770596033",
  appId: "1:675770596033:web:81947544f54baf955db240"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exporta las variables para que puedan ser usadas en otros archivos
export { app, db };