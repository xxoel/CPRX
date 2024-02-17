import { buscarVuelosDeIda } from "./flights.mjs";

export function mostrarRuta(origen, destino, container) {
    obtenerCoordenadas(origen)
        .then(coordenadasOrigen => {
            obtenerCoordenadas(destino)
                .then(coordenadasDestino => {
                    obtenerRuta(origen, destino, coordenadasOrigen, coordenadasDestino, container);
                })
                .catch(error => {
                    console.error('Error al obtener las coordenadas del destino:', error);
                });
        })
        .catch(error => {
            console.error('Error al obtener las coordenadas del origen:', error);
        });
}

function obtenerRuta(origen, destino, coordenadasOrigen, coordenadasDestino, container) {
    var apiKey = '132e1158-0596-4825-9df1-e4c076b7fc3b';
    var apiUrl = 'https://graphhopper.com/api/1/route?point=' + coordenadasOrigen.latitud + ',' + coordenadasOrigen.longitud + '&point=' + coordenadasDestino.latitud + ',' + coordenadasDestino.longitud + '&vehicle=car&locale=en&points_encoded=false&key=' + apiKey;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data.paths[0].distance);///esta es la distancia en kilómetros
            obtenerAeropuertosCercanos(coordenadasOrigen.latitud, coordenadasOrigen.longitud, 100000);
            buscarVuelosDeIda("TOJ","SCQ","18/02/2024");
            mostrarRutaEnMapaCliente(data, container);
        })
        .catch(error => {
            console.error('Error al obtener la ruta desde GraphHopper:', error);
        });
}

function obtenerCoordenadas(ciudad) {
    var nominatimUrl = 'https://nominatim.openstreetmap.org/search?q=' + ciudad + '&format=json&limit=1';

    return fetch(nominatimUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var latitud = data[0].lat;
                var longitud = data[0].lon;
                return { latitud: latitud, longitud: longitud };
            } else {
                throw new Error("No se encontraron resultados para la ciudad proporcionada");
            }
        });
}

// Función para mostrar la ruta en el mapa
function mostrarRutaEnMapaCliente(data, container) {
    var route = data.paths[0];
    var routePoints = route.points.coordinates.map(function(coord) {
        return [coord[1], coord[0]];
    });

    // Crear un nuevo mapa para el cliente
    var clientMap = L.map(container).setView([0, 0], 12); // Ajusta las coordenadas y el nivel de zoom según tu necesidad

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(clientMap);

    // Agregar la nueva ruta al mapa del cliente
    L.polyline(routePoints, {color: 'blue'}).addTo(clientMap);
    clientMap.fitBounds(L.polyline(routePoints).getBounds());
}

async function obtenerAeropuertosCercanos(latitud, longitud, radio) {
    const overpassApiUrl = 'https://overpass-api.de/api/interpreter';
    
    // Construir la consulta Overpass para buscar nodos que representan aeropuertos
    const overpassQuery = `
        [out:json];
        node(around:${radio},${latitud},${longitud})["aeroway"="aerodrome"];
        out center;
    `;

    try {
        const response = await fetch(overpassApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `data=${encodeURIComponent(overpassQuery)}`,
        });

        const data = await response.json();
        console.log(data);

        // Procesar los resultados y extraer las coordenadas
        const aeropuertos = data.elements.map(element => ({
            latitud: element.lat,
            longitud: element.lon,
        }));
        console.log(aeropuertos);
        return aeropuertos;
    } catch (error) {
        console.error('Error al obtener los aeropuertos cercanos:', error);
        return null;
    }
}