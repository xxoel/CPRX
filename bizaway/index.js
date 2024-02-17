import { mostrarRuta } from "./routes.mjs";

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

        // Crea un nuevo contenedor para el mapa del cliente
        const mapContainer = document.createElement('div');
        mapContainer.classList.add('map-container');

        // Asocia el evento click con la función mostrarRuta
        button.addEventListener('click', function () {
            const origen = input.value;
            mostrarRuta(origen, destination, mapContainer);
        });

        div.appendChild(input);
        div.appendChild(button);
        div.appendChild(mapContainer);
        outputContainer.appendChild(div);
    }
});

document.getElementById('inicio').addEventListener('onclick', function (event) {
    window.location.href = 'index.html'; 
});

