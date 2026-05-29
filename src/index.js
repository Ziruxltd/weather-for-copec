import express from 'express';
import { getWeatherData } from './services/weatherService.js';
import { getLocationFromIP, getCityFromCoordinates } from './services/locationService.js';
import { CONFIG } from './config/constants.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));   // Sirve archivos estáticos (HTML, CSS, JS)

// Ruta para la página principal (HTML)
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

// Ruta API para obtener datos
app.get('/weather', async (req, res) => {
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);

    if (lat && lon) {
        await updateWeather(lat, lon);
    }

    if (latestWeather) {
        res.json(latestWeather);
    } else {
        res.json({ message: "Cargando datos..." });
    }
});

let latestWeather = null;

// Función de actualización cada 5 minutos
async function updateWeather(lat = null, lon = null) {
    if (!lat || !lon) {
        const location = await getLocationFromIP();
        if (location) {
            lat = location.latitude;
            lon = location.longitude;
        } else {
            lat = CONFIG.DEFAULT_LAT;
            lon = CONFIG.DEFAULT_LON;
        }
    }

    const data = await getWeatherData(lat, lon);
    if (data) {
        const cityInfo = await getCityFromCoordinates(lat, lon);
        data.location.city = cityInfo.city;
        latestWeather = data;
        console.log(`✅ Datos actualizados - ${cityInfo.city} (${new Date().toLocaleTimeString()})`);
    }
}

// Iniciar servidor
app.listen(CONFIG.PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${CONFIG.PORT}`);
    console.log(`🌐 Abre aquí → http://localhost:${CONFIG.PORT}`);

    // Primera carga de datos
    await updateWeather();

    // Actualización automática cada 5 minutos
    setInterval(updateWeather, CONFIG.UPDATE_INTERVAL);
});