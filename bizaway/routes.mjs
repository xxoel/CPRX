import { buscarVuelosDeIda, calcularDistancia } from "./flights.mjs";
//import L from 'leaflet';

var array = [];
var apiKey = '132e1158-0596-4825-9df1-e4c076b7fc3b';
var apiBaseUrl = 'https://graphhopper.com/api/1/route?point=';

export function mostrarRuta(origen, destino, container) {
    obtenerCoordenadas(origen)
        .then(coordenadasOrigen => {
            obtenerCoordenadas(destino)
                .then(coordenadasDestino => {
                    obtenerRuta(coordenadasOrigen, coordenadasDestino, container);
                })
                .catch(error => {
                    console.error('Error al obtener las coordenadas del destino:', error);
                });
        })
        .catch(error => {
            console.error('Error al obtener las coordenadas del origen:', error);
        });
}

async function obtenerRuta(coordenadasOrigen, coordenadasDestino, container) {
    try {
        const apiUrl = apiBaseUrl + coordenadasOrigen.latitud + ',' + coordenadasOrigen.longitud +
            '&point=' + coordenadasDestino.latitud + ',' + coordenadasDestino.longitud +
            '&vehicle=car&locale=en&points_encoded=false&key=' + apiKey;

        const response = await fetch(apiUrl);
        const data = await response.json();

        const aeropuertoOrigen = await obtenerAeropuertoCercano(coordenadasOrigen.latitud, coordenadasOrigen.longitud);
        calcularcompanions(coordenadasOrigen,aeropuertoOrigen);
        array.push(coordenadasOrigen);
        const aeropuertoDestino = await obtenerAeropuertoCercano(coordenadasDestino.latitud, coordenadasDestino.longitud);
        const data2_1 = await obtenerDistanciaSubRuta(aeropuertoOrigen, coordenadasOrigen);
        const data2_2 = await obtenerDistanciaSubRuta(coordenadasDestino, aeropuertoDestino);

        const gastoVuelo = await buscarVuelosDeIda(coordenadasOrigen.latitud, coordenadasOrigen.longitud, coordenadasDestino.latitud, coordenadasDestino.longitud);
        const gastoTotalVuelo = gastoVuelo + data2_1.paths[0].distance * 0.00008 + data2_2.paths[0].distance * 0.00008;
        const gastoTotalCoche = data.paths[0].distance * 0.00008;

        console.log("Gasto Real =" + gastoTotalCoche + " Gasto con vuelo:" + gastoTotalVuelo);
        var contenedorMapa = document.createElement('div');
        contenedorMapa.style.width = '300px'; // Ajusta según sea necesario
        contenedorMapa.style.height = '300px';
        if (gastoTotalCoche < gastoTotalVuelo) {
            // Si el gasto en coche es menor, muestra la ruta en el mapa
            mostrarRutaEnMapaCliente(data, container, false);
        } else {
            mostrarRutaEnMapaCliente(data2_1, container, true);
            mostrarinfoVuelo(container,aeropuertoOrigen,aeropuertoDestino);
            mostrarRutaEnMapaCliente(data2_2, container, true);

            // Agrega el texto "VUELO" en el medio
            const centroLatitud = (coordenadasOrigen.latitud + coordenadasDestino.latitud) / 2;
            const centroLongitud = (coordenadasOrigen.longitud + coordenadasDestino.longitud) / 2;

            const vueloTexto = L.marker([centroLatitud, centroLongitud], { icon: L.divIcon({ className: 'vuelo-label', html: 'VUELO' }) });
            vueloTexto.addTo(contenedorMapa);
        }

        // Agregar el contenedorMapa al contenedor principal proporcionado
        container.appendChild(contenedorMapa);
    } catch (error) {
        console.error('Error al obtener la ruta desde GraphHopper:', error);
    }
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


function mostrarRutaEnMapaCliente(data, container, isSubRoute) {
    if (!(container instanceof HTMLElement)) {
        console.error('El contenedor proporcionado no es un elemento HTML válido.');
        return;
    }

    var route = data.paths[0];
    var routePoints = route.points.coordinates.map(function(coord) {
        return [coord[1], coord[0]];
    });

    var subContainer;

    if (isSubRoute) {
        // Si es una subruta, crea un nuevo contenedor y agrégalo al contenedor principal
        subContainer = document.createElement('div');
        subContainer.style.width = '300px'; // Ajusta según sea necesario
        subContainer.style.height = '300px'; // Ajusta según sea necesario
        subContainer.style.marginRight = '10%';
        subContainer.style.marginLeft = '10%';
        container.appendChild(subContainer);

        // Inicializa el mapa en el nuevo contenedor
        const clientMap = inicializarMapa(subContainer);

        // Agregar la nueva ruta al mapa del cliente
        L.polyline(routePoints, {color: 'blue'}).addTo(clientMap);
        clientMap.fitBounds(L.polyline(routePoints).getBounds());
    } else {
        // Si no es una subruta, simplemente usa el contenedor principal proporcionado
        const clientMap = inicializarMapa(container);

        // Agregar la nueva ruta al mapa del cliente
        L.polyline(routePoints, {color: 'blue'}).addTo(clientMap);
        clientMap.fitBounds(L.polyline(routePoints).getBounds());
    }
}

function mostrarinfoVuelo(container,aeropuertoOrigen,aeropuertoDestino) {
    if (!(container instanceof HTMLElement)) {
        console.error('El contenedor proporcionado no es un elemento HTML válido.');
        return;
    }

    // Aplicar display: flex y align-items: center al contenedor principal


    var subContainer = document.createElement('div');
    subContainer.style.width = '20px'; // Ajusta según sea necesario
    subContainer.style.height = '300px'; // Ajusta según sea necesario
    subContainer.style.textAlign = 'center'; // Centra el contenido horizontalmente
    subContainer.style.display = 'flex';
    subContainer.style.alignItems = 'center';

    if (aeropuertoOrigen.nombre == undefined){
        aeropuertoOrigen.nombre = "Sin nombre"
    }
    if (aeropuertoDestino.nombre == undefined){
        aeropuertoDestino.nombre = "Sin nombre"
    }
    var textoVuelo = 'Vuelo desde \n'
    var textoVuelo1 = aeropuertoOrigen.nombre;
    var textoVuelo2 = ' a ';
    var textoVuelo3 = aeropuertoDestino.nombre;
    var nodoTexto = document.createTextNode(textoVuelo)
    var nodoTexto1 = document.createTextNode(textoVuelo1);
    var nodoTexto2 = document.createTextNode(textoVuelo2);
    var nodoTexto3 = document.createTextNode(textoVuelo3);

    // Adjunta los nodos de texto al subContainer
    subContainer.appendChild(nodoTexto)
    subContainer.appendChild(nodoTexto1);
    subContainer.appendChild(nodoTexto2);
    subContainer.appendChild(nodoTexto3);

    // Adjunta subContainer al contenedor principal
    container.appendChild(subContainer);

    container.appendChild(subContainer);
}
// ...

// Función para inicializar un mapa Leaflet
function inicializarMapa(container) {
    const map = L.map(container).setView([0, 0], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return map;
}

async function obtenerAeropuertoCercano(latitud, longitud) {
    const overpassApiUrl = 'https://overpass-api.de/api/interpreter';

    // Construir la consulta Overpass para buscar el nodo más cercano que represente un aeropuerto
    const overpassQuery = `
        [out:json];
        node(around:100000,${latitud},${longitud})["aeroway"="aerodrome"];
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

        // Procesar los resultados y extraer las coordenadas del aeropuerto más cercano
        if (data.elements.length > 0) {
            const aeropuertoCercano = {
                latitud: data.elements[0].lat,
                longitud: data.elements[0].lon,
                nombre: data.elements[0].tags.name
            };
            console.log("Aeropuerto Cercano: " + aeropuertoCercano.latitud  + "-" + aeropuertoCercano.longitud);
            return aeropuertoCercano;
        } else {
            console.log('No se encontraron aeropuertos cercanos.');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el aeropuerto cercano:', error);
        return null;
    }
}

async function obtenerDistanciaSubRuta(origen, destino) {
    try {
        const apiUrl1 = apiBaseUrl + origen.latitud + ',' + origen.longitud +
            '&point=' + destino.latitud + ',' + destino.longitud +
            '&vehicle=car&locale=en&points_encoded=false&key=' + apiKey;

        const response = await fetch(apiUrl1);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error al obtener las rutas desde GraphHopper:', error);
        throw error; // Propagar el error para que sea manejado fuera de esta función si es necesario
    }
}

function calcularcompanions(coordenadasOrigen,aeropuertoOrigen){
    const distanciaaero = calcularDistancia(coordenadasOrigen.latitud, coordenadasOrigen.longitud, aeropuertoOrigen.latitud, aeropuertoOrigen.longitud);
    for (let i = 0; i < array.length; i++) {
        if(distanciaaero > calcularDistancia(coordenadasOrigen.latitud, coordenadasOrigen.longitud, array[i].latitud, array[i].longitud)){
            document.body.appendChild(document.createElement("p").appendChild(document.createTextNode("cliente: " + array.length + " puede buscar al cliente: " + i)));
        }
    }
}