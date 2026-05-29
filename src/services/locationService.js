import fetch from 'node-fetch';

export async function getLocationFromIP() {
    try {
        // Mejor servicio de geolocalización por IP
        const response = await fetch('http://ip-api.com/json/?fields=status,message,lat,lon,city,country');
        const data = await response.json();

        if (data.status === "success") {
            return {
                latitude: data.lat,
                longitude: data.lon,
                city: data.city || "Ubicación desconocida",
                country: data.country
            };
        } else {
            throw new Error(data.message || "Error en IP-API");
        }
    } catch (error) {
        console.error("Error al obtener ubicación por IP:", error);
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