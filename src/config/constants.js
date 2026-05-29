export const CONFIG = {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    UPDATE_INTERVAL: parseInt(process.env.UPDATE_INTERVAL_MS, 10) || 5 * 60 * 1000,
    DEFAULT_LAT: parseFloat(process.env.DEFAULT_LAT) || -32.789522, // COPEC Catemu
    DEFAULT_LON: parseFloat(process.env.DEFAULT_LON) || -70.958934
};