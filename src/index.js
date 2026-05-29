import express from 'express';
import { getWeatherData } from './services/weatherService.js';
import { getLocationFromIP, getCityFromCoordinates } from './services/locationService.js';
import { CONFIG } from './config/constants.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Health check endpoint (useful for Render and load balancers)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        hasWeatherData: !!latestWeather
    });
});

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

// Función de actualización
async function updateWeather(lat = null, lon = null) {
    try {
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
        } else {
            console.warn('⚠️  No se pudieron obtener datos meteorológicos en esta actualización');
        }
    } catch (error) {
        console.error('❌ Error durante la actualización de clima:', error.message);
    }
}

// Iniciar servidor
app.listen(CONFIG.PORT, () => {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;
    const host = isProduction ? '0.0.0.0' : 'localhost';
    
    console.log(`🚀 Servidor corriendo en puerto ${CONFIG.PORT}`);
    if (!isProduction) {
        console.log(`🌐 Abre aquí → http://localhost:${CONFIG.PORT}`);
    }

    // Primera carga de datos (en background para no retrasar el inicio)
    updateWeather().catch(err => 
        console.error('Error en carga inicial de datos:', err.message)
    );

    // Actualización automática cada X minutos
    setInterval(() => updateWeather().catch(() => {}), CONFIG.UPDATE_INTERVAL);
});