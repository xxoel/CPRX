/*# Copyright (C) THEDATE Devin Breen
# This file is part of dogtag <https://github.com/chiditarod/dogtag>.
#
# dogtag is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# dogtag is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with dogtag.  If not, see <http://www.gnu.org/licenses/>.*/

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

