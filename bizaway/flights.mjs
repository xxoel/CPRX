export async function buscarVuelosDeIda(lat1,lon1,lat2,lon2) {
    const distancia = calcularDistancia(lat1,lon1,lat2,lon2);
    console.log("Distancia vuelo: " + distancia);
    return distancia * 0.04;
  }


export function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = R * c; // Distancia en kilómetros
    return distancia;
}

function toRad(grados) {
    return grados * Math.PI / 180;
}