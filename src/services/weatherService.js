import fetch from 'node-fetch';

export async function getWeatherData(lat, lon) {
    try {
        // Usamos parámetros más completos y estables de Open-Meteo (2026)
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,apparent_temperature,relative_humidity_2m,uv_index,precipitation,weather_code,wind_speed_10m,is_day',
            daily: 'temperature_2m_max,temperature_2m_min,uv_index_max',
            timezone: 'auto'
        });

        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();

        // Open-Meteo a veces devuelve { error: true, reason: "..." } incluso con status 200
        if (data.error) {
            console.error("❌ Open-Meteo devolvió error:", data.reason || data);
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