# 🌤️ Meteorológico - Servidor de Clima en Tiempo Real

Servidor web que proporciona información meteorológica actualizada en tiempo real, incluyendo temperatura, índice UV, humedad y más. Obtiene datos de Open-Meteo API y detecta automáticamente la ubicación del usuario.

## ✨ Características

- **Detección automática de ubicación** basada en IP del cliente
- **Datos meteorológicos en tiempo real**: temperatura, sensación térmica, humedad, viento, precipitación
- **Índice UV actual** y temperaturas máximas/mínimas del día
- **Actualización automática** cada 5 minutos en el servidor
- **Interfaz web moderna** con tres modos de visualización:
  - **Normal**: Fondo oscuro para uso en interiores
  - **Alto Contraste**: Fondo claro para mejor legibilidad
  - **Ultra**: Fondo negro con colores brillantes para uso en exteriores con sol
- **Cambio manual de ubicación** mediante coordenadas o enlaces de Google Maps
- **Geolocalización del navegador** para usar ubicación actual del usuario
- **Responsive**: Adaptado para dispositivos móviles y escritorio

## 🚀 Requisitos

- Node.js 18+ (usa módulos ES6)
- npm o yarn
- Conexión a internet (usa APIs externas)

## 📦 Instalación

1. Clona o descarga este repositorio:
```bash
git clone git@github.com:Ziruxltd/weather-for-copec.git
cd weather-for-copec
```

2. Instala las dependencias:
```bash
npm install
```

## 🎯 Uso

### Modo desarrollo (con auto-recarga)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor iniciará en `http://localhost:3000`

## 🔧 Configuración

Edita [src/config/constants.js](src/config/constants.js) para personalizar:

```javascript
export const CONFIG = {
    PORT: 3000,                      // Puerto del servidor
    UPDATE_INTERVAL: 5 * 60 * 1000,  // Intervalo de actualización (5 minutos)
    DEFAULT_LAT: -32.789522,         // Latitud por defecto (COPEC Catemu)
    DEFAULT_LON: -70.958934          // Longitud por defecto
};
```

## 📁 Estructura del Proyecto

```
weather-for-copec/
├── src/
│   ├── index.js                 # Servidor Express principal
│   ├── config/
│   │   └── constants.js         # Configuración global
│   └── services/
│       ├── locationService.js   # Detección de ubicación por IP y coordenadas
│       └── weatherService.js    # Obtención de datos meteorológicos
├── public/
│   └── index.html              # Interfaz web
├── package.json
└── README.md
```

## 🌐 API Endpoints

### `GET /`
Página principal con la interfaz web

### `GET /weather`
Obtiene los datos meteorológicos actuales

**Parámetros opcionales:**
- `lat` (float): Latitud
- `lon` (float): Longitud

**Respuesta ejemplo:**
```json
{
  "location": {
    "latitude": -32.789522,
    "longitude": -70.958934,
    "city": "Catemu"
  },
  "current": {
    "temperature": 18.5,
    "apparent_temperature": 17.2,
    "relative_humidity": 65,
    "wind_speed": 12.5,
    "precipitation": 0,
    "weathercode": 1,
    "is_day": 1,
    "uvIndex": 6
  },
  "daily": {
    "maxTemp": 24.5,
    "minTemp": 12.3
  },
  "timestamp": "2026-05-29T10:30:00Z"
}
```

## 🛠️ Tecnologías

- **Backend:**
  - Node.js con módulos ES6
  - Express.js (servidor web)
  - node-fetch (llamadas HTTP a APIs)

- **APIs externas:**
  - [Open-Meteo](https://open-meteo.com/) - Datos meteorológicos
  - [ipapi.co](https://ipapi.co/) - Geolocalización por IP
  - [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/) - Geocodificación inversa

- **Frontend:**
  - HTML5, CSS3, JavaScript vanilla
  - Diseño responsive
  - LocalStorage para preferencias de usuario

## 📱 Uso de la Interfaz Web

1. Al abrir la página, se detecta automáticamente tu ubicación
2. Los datos se actualizan cada 5 minutos en el servidor
3. Usa el botón **🔆 Contraste** para cambiar entre modos de visualización
4. Usa el botón **📍 Cambiar Ubicación** para:
   - Ingresar coordenadas manualmente
   - Pegar un enlace de Google Maps
   - Usar la ubicación actual del navegador

## 📝 Notas

- La ubicación por defecto es COPEC Catemu, Chile
- El servidor cachea los datos y los actualiza cada 5 minutos para reducir llamadas a la API
- La interfaz web consulta el endpoint `/weather` cada 30 segundos
- Las preferencias de modo de contraste se guardan en LocalStorage del navegador

## 🔐 Privacidad

- No se almacenan datos personales
- La detección de ubicación por IP solo se usa para obtener coordenadas aproximadas
- No hay cookies ni tracking

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia que determines.

---

Desarrollado para COPEC
