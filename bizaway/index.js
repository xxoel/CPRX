// Inicializa Leaflet map
var map = L.map('map').setView([0, 0], 2); // Ajusta las coordenadas según tu necesidad y el nivel de zoom

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Función para mostrar la ruta en el mapa
function mostrarRutaEnMapa(data) {
    var route = data.paths[0];
    var routePoints = route.points.coordinates.map(function(coord) {
        return [coord[1], coord[0]];
    });

    // Limpiar capas anteriores antes de agregar la nueva ruta
    map.eachLayer(function(layer) {
        if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    // Agregar la nueva ruta al mapa
    L.polyline(routePoints, {color: 'blue'}).addTo(map);
    map.fitBounds(L.polyline(routePoints).getBounds());
}

// Tu código existente...

document.getElementById('routeForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const number = parseInt(document.getElementById('numberInput').value, 10);
    const destination = document.getElementById('destinationInput').value;

    const outputContainer = document.getElementById('output-container');
    outputContainer.innerHTML = '';

    for (let i = 0; i < number; i++) {
        const div = document.createElement('div');
        div.classList.add('dynamic-input');

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Origen Cliente ${i + 1}`;

        const button = document.createElement('button');
        button.classList.add('show-button');
        button.textContent = 'Mostrar Ruta';
        button.addEventListener('click', function () {
            const origen = input.value;
            mostrarRuta(origen, destination, div);
        });

        div.appendChild(input);
        div.appendChild(button);
        outputContainer.appendChild(div);
    }

    if (outputContainer.childElementCount === number) {
        const destinationDiv = document.createElement('div');
        destinationDiv.innerHTML = `<strong>Destino:</strong> ${destination}`;
        outputContainer.appendChild(destinationDiv);
    }
});

function mostrarRuta(origen, destino, container) {
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
            //container.innerHTML = `<div class="route-info"><strong>Ruta desde ${origen} hasta ${destino}:</strong> ${JSON.stringify(data)}</div>`;
            mostrarRutaEnMapa(data);
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

