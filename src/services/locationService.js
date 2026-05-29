import fetch from 'node-fetch';

export async function getLocationFromIP() {
    try {
        // Usar HTTPS para evitar problemas en servidores con políticas de seguridad
        const response = await fetch('https://ipapi.co/json/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // Validar que tenemos coordenadas válidas
        if (data.latitude && data.longitude) {
            const lat = parseFloat(data.latitude);
            const lon = parseFloat(data.longitude);
            
            if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                console.log(`✅ Ubicación obtenida: ${data.city}, ${data.country_name} (${lat}, ${lon})`);
                return {
                    latitude: lat,
                    longitude: lon,
                    city: data.city || "Ubicación desconocida",
                    country: data.country_name || data.country
                };
            }
        }
        
        throw new Error("Coordenadas no válidas en la respuesta");
    } catch (error) {
        console.error("❌ Error al obtener ubicación por IP:", error.message);
        return null;
    }
}

// Obtener nombre de ciudad desde coordenadas (ya lo teníamos)
export async function getCityFromCoordinates(lat, lon) {
    try {
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?` +
                    `latitude=${lat}&longitude=${lon}&localityLanguage=es`;

        const response = await fetch(url);
        const data = await response.json();

        return {
            city: data.city || data.locality || "Ubicación desconocida",
            country: data.countryName
        };
    } catch (error) {
        console.error("Error al obtener nombre de ciudad:", error);
        return { city: "Ubicación desconocida", country: "" };
    }
}