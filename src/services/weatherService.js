import fetch from 'node-fetch';

// Soporte para API Key gratuita de Open-Meteo (recomendado en producción)
const API_KEY = process.env.OPEN_METEO_API_KEY || null;

export async function getWeatherData(lat, lon) {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,apparent_temperature,relative_humidity_2m,uv_index,precipitation,weather_code,wind_speed_10m,is_day',
            daily: 'temperature_2m_max,temperature_2m_min,uv_index_max',
            timezone: 'auto'
        });

        // Si tenemos API Key, la agregamos (da límites mucho más altos)
        if (API_KEY) {
            params.append('apikey', API_KEY);
        }

        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();

        // Open-Meteo a veces devuelve { error: true, reason: "..." } incluso con status 200
        if (data.error) {
            console.error("❌ Open-Meteo devolvió error:", data.reason || data);

            // Detección clara de rate limiting / cuota agotada
            const reason = (data.reason || '').toLowerCase();
            if (reason.includes('limit') || reason.includes('quota') || reason.includes('exceeded') || reason.includes('too many')) {
                console.error("🚨 Posible rate limit o cuota agotada en Open-Meteo.");
                console.error("   → Solución recomendada: Registra una API Key gratuita en https://open-meteo.com");
            }

            return null;
        }

        // Validación defensiva: a veces 'current' puede no venir
        if (!data.current || !data.daily) {
            console.error("❌ Respuesta incompleta de Open-Meteo. current/daily faltantes:", data);
            return null;
        }

        return {
            location: { 
                city: "Cargando...", 
                lat: parseFloat(lat), 
                lon: parseFloat(lon) 
            },
            current: {
                temperature: data.current.temperature_2m,
                apparent_temperature: data.current.apparent_temperature,
                relative_humidity: data.current.relative_humidity_2m,
                uvIndex: data.current.uv_index ?? null,
                wind_speed: data.current.wind_speed_10m,
                precipitation: data.current.precipitation,
                weathercode: data.current.weather_code,
                is_day: data.current.is_day
            },
            daily: {
                maxTemp: data.daily.temperature_2m_max?.[0],
                minTemp: data.daily.temperature_2m_min?.[0],
                maxUvIndex: data.daily.uv_index_max?.[0]
            },
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("❌ Error al obtener datos de Open-Meteo:", error.message);
        return null;
    }
}