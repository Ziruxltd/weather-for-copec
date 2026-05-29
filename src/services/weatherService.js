import fetch from 'node-fetch';

export async function getWeatherData(lat, lon) {
    try {
        // Validar coordenadas
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            console.error(`❌ Coordenadas inválidas: lat=${lat}, lon=${lon}`);
            return null;
        }
        
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,uv_index` +
            `&daily=temperature_2m_max,temperature_2m_min,uv_index_max` +
            `&timezone=auto`;

        console.log(`📡 Consultando API meteorológica...`);
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`❌ Error HTTP: ${response.status} ${response.statusText}`);
            return null;
        }
        
        const data = await response.json();

        // Validar estructura de respuesta
        if (!data.current || !data.daily) {
            console.error("❌ La API no devolvió la estructura esperada");
            return null;
        }

        return {
            location: { city: "Cargando...", lat: latitude, lon: longitude },
            current: {
                temperature: data.current.temperature_2m,
                uvIndex: data.current.uv_index
            },
            daily: {
                maxTemp: data.daily.temperature_2m_max[0],
                minTemp: data.daily.temperature_2m_min[0],
                maxUvIndex: data.daily.uv_index_max[0]
            },
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("❌ Error al obtener datos:", error);
        return null;
    }
}