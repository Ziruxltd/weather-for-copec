import express from 'express';
import { getWeatherData } from './services/weatherService.js';
import { getCityFromCoordinates } from './services/locationService.js';
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
let lastUpdateTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función de actualización con cache
async function updateWeather(lat = null, lon = null) {
    try {
        // Si no se proporcionan coordenadas, usar las por defecto
        if (!lat || !lon) {
            lat = CONFIG.DEFAULT_LAT;
            lon = CONFIG.DEFAULT_LON;
            console.log(`📍 Usando coordenadas por defecto: ${lat}, ${lon}`);
        }

        // Verificar si tenemos datos en cache
        const now = Date.now();
        if (latestWeather && (now - lastUpdateTime) < CACHE_DURATION) {
            console.log(`💾 Usando datos en cache (${Math.floor((now - lastUpdateTime) / 1000)}s desde última actualización)`);
            return;
        }

        console.log(`🌤️ Obteniendo datos meteorológicos para: ${lat}, ${lon}`);
        const data = await getWeatherData(lat, lon);
        
        if (data) {
            const cityInfo = await getCityFromCoordinates(lat, lon);
            data.location.city = cityInfo.city;
            latestWeather = data;
            lastUpdateTime = now;
            console.log(`✅ Datos actualizados - ${cityInfo.city} (${new Date().toLocaleTimeString()})`);
        } else {
            console.error("❌ No se pudieron obtener datos meteorológicos");
            // Si falló pero tenemos datos anteriores, mantenerlos
            if (latestWeather) {
                console.log("💾 Manteniendo datos anteriores");
            }
        }
    } catch (error) {
        console.error("❌ Error en updateWeather:", error);
    }
}

// Iniciar servidor
app.listen(CONFIG.PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${CONFIG.PORT}`);
    console.log(`🌐 Servidor listo para recibir peticiones`);

    // Delay aleatorio de 1-3 segundos para evitar rate limiting durante despliegues
    const delay = 1000 + Math.random() * 2000;
    console.log(`⏳ Esperando ${Math.floor(delay/1000)}s antes de la primera carga...`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Primera carga de datos (con retry)
    console.log("⏳ Cargando datos iniciales...");
    await updateWeather();
    
    // Si falló la primera carga, reintentar una vez después de 10 segundos
    if (!latestWeather) {
        console.log("⏳ Reintentando en 10 segundos...");
        setTimeout(async () => {
            await updateWeather();
        }, 10000);
    }

    // Actualización automática cada 5 minutos
    setInterval(() => updateWeather(), CONFIG.UPDATE_INTERVAL);
});