import axios from "axios";

// ===============================
// Instancias de Axios para APIs
// ===============================
// En este archivo creamos dos instancias de Axios para separar claramente:
// 1. Las peticiones a la API de telemetría (producción)
// 2. Las peticiones a la API de negocio/autenticación (local o negocio)
// Esto permite que el frontend pueda hablar con dos servidores diferentes según el tipo de información que necesita.

// -----------------------------------------------
// API de Telemetría (consultas, datos, producción)
// -----------------------------------------------
// Esta API se usa para consultar datos de sensores, reportes, etc.
// Su URL se configura con la variable de entorno VITE_API_TELEMETRY_URL
const TELEMETRY_URL =
  import.meta.env.VITE_API_TELEMETRY_URL || "https://api.smarthydro.app";

// ------------------------------------------------------
// API de Negocio/Autenticación (login, lógica de negocio)
// ------------------------------------------------------
// Esta API se usa para autenticación (login/logout) y lógica de negocio.
// Normalmente corre en local durante desarrollo.
// Su URL se configura con la variable de entorno VITE_API_BUSINESS_URL
const BUSINESS_URL =
  import.meta.env.VITE_API_BUSINESS_URL || "http://localhost:3000";

// Log para verificar las variables de entorno
console.log("🔍 Variables de entorno:");
console.log("  VITE_API_BUSINESS_URL:", import.meta.env.VITE_API_BUSINESS_URL);
console.log(
  "  VITE_API_TELEMETRY_URL:",
  import.meta.env.VITE_API_TELEMETRY_URL
);
console.log("  BUSINESS_URL final:", BUSINESS_URL);

// Instancia para la API de telemetría
export const api_telemetry = axios.create({
  baseURL: TELEMETRY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instancia para la API de negocio/autenticación
export const api_business = axios.create({
  baseURL: BUSINESS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log para verificar la configuración
console.log("🔧 api_business configurado con baseURL:", BUSINESS_URL);

// ===============================
// Interceptores de peticiones
// ===============================
// Los interceptores permiten modificar las peticiones antes de que salgan
// Aquí agregamos el token de autenticación (si existe) a cada petición

// Interceptor para la API de telemetría
api_telemetry.interceptors.request.use(
  (config) => {
    try {
      // agregar de usuari autenticado la id api smart hydro
      const token = localStorage.getItem("token");
      //
      if (token) {
        config.headers.Authorization = `Token ${token}`;
        console.log(
          "Token enviado (telemetry):",
          token.substring(0, 10) + "..."
        );
      } else {
        console.warn("No se encontró token en localStorage (telemetry)");
      }
    } catch (error) {
      console.warn("No se pudo acceder a localStorage:", error);
      // Continuar sin token si no se puede acceder a localStorage
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para la API de negocio/autenticación
api_business.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("user_token");
      if (token) {
        config.headers.Authorization = `Token ${token}`;
        console.log(
          "Token enviado (business):",
          token.substring(0, 10) + "..."
        );
      } else {
        console.warn("No se encontró token en localStorage (business)");
      }
    } catch (error) {
      console.warn("No se pudo acceder a localStorage:", error);
      // Continuar sin token si no se puede acceder a localStorage
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===============================
// Interceptores de respuesta
// ===============================
// Permiten manejar errores globalmente y mostrar logs útiles

// Respuestas de la API de telemetría
api_telemetry.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo seguro de errores para evitar el error de 'stack'
    try {
      console.error(
        "Error en petición (telemetry):",
        error.response?.status,
        error.response?.data
      );
    } catch (consoleError) {
      console.error("Error al loggear error de petición:", consoleError);
    }
    return Promise.reject(error);
  }
);

// Respuestas de la API de negocio/autenticación
api_business.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo seguro de errores para evitar el error de 'stack'
    try {
      console.error(
        "Error en petición (business):",
        error.response?.status,
        error.response?.data
      );
    } catch (consoleError) {
      console.error("Error al loggear error de petición:", consoleError);
    }
    return Promise.reject(error);
  }
);

// Por compatibilidad, exportamos api_telemetry como default
export default api_telemetry;
