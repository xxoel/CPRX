document.getElementById('numberForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener el número y destino ingresados por el usuario
    const number = parseInt(document.getElementById('numberInput').value, 10);
    const destination = document.getElementById('destinationInput').value;

    // Limpiar el contenedor de salida
    const outputContainer = document.getElementById('output-container');
    outputContainer.innerHTML = '';

    // Crear divs con campos de entrada de texto y botones según el número ingresado
    for (let i = 0; i < number; i++) {
        const div = document.createElement('div');
        div.classList.add('dynamic-input');

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Texto ${i + 1}`;

        const button = document.createElement('button');
        button.classList.add('show-button');
        button.textContent = 'Mostrar';
        button.addEventListener('click', function () {
            // Al hacer clic en el botón, mostrar el texto al lado del input
            const textToShow = input.value || 'Sin texto';

            // Crear un elemento para mostrar el texto al lado del input
            const textDisplay = document.createElement('span');
            textDisplay.textContent = textToShow;

            // Agregar el texto al lado del input
            div.appendChild(textDisplay);
        });

        div.appendChild(input);
        div.appendChild(button);
        outputContainer.appendChild(div);
    }

    // Mostrar el destino solo en la primera petición
    if (outputContainer.childElementCount === number) {
        const destinationDiv = document.createElement('div');
        destinationDiv.innerHTML = `<strong>Destino:</strong> ${destination}`;
        outputContainer.appendChild(destinationDiv);
    }
});

function obtenerCoordenadas(ciudad) {
    // URL de la solicitud a la API de Nominatim para obtener las coordenadas de la ciudad
    var nominatimUrl = 'https://nominatim.openstreetmap.org/search?q=' + ciudad + '&format=json&limit=1';

    // Realiza la solicitud HTTP GET a la API de Nominatim
    return fetch(nominatimUrl)
      .then(response => response.json())
      .then(data => {
        // Verifica si se encontraron resultados
        if (data.length > 0) {
          // Extrae las coordenadas del primer resultado
          var latitud = data[0].lat;
          var longitud = data[0].lon;
          return { latitud: latitud, longitud: longitud };
        } else {
          throw new Error("No se encontraron resultados para la ciudad proporcionada");
        }
      });
  }

  function obtenerRuta(origen, destino) {
    // Llama a la función para obtener las coordenadas del origen
    obtenerCoordenadas(origen)
      .then(coordenadasOrigen => {
        // Llama a la función para obtener las coordenadas del destino
        obtenerCoordenadas(destino)
          .then(coordenadasDestino => {
            // Llama a la API de GraphHopper con las coordenadas obtenidas
            var apiKey = '132e1158-0596-4825-9df1-e4c076b7fc3b'; // Reemplaza con tu clave de API de GraphHopper
            var apiUrl = 'https://graphhopper.com/api/1/route?point=' + coordenadasOrigen.latitud + ',' + coordenadasOrigen.longitud + '&point=' + coordenadasDestino.latitud + ',' + coordenadasDestino.longitud + '&vehicle=car&locale=en&points_encoded=false&key=' + apiKey;

            // Realiza la solicitud HTTP GET a la API de GraphHopper
            fetch(apiUrl)
              .then(response => response.json())
              .then(data => {
                // Aquí puedes manejar la respuesta de la API de GraphHopper, por ejemplo, mostrar la ruta en un mapa
                console.log("Respuesta de GraphHopper:", data);
              })
              .catch(error => {
                console.error('Error al obtener la ruta desde GraphHopper:', error);
              });
          })
          .catch(error => {
            console.error('Error al obtener las coordenadas del destino:', error);
          });
      })
      .catch(error => {
        console.error('Error al obtener las coordenadas del origen:', error);
      });
  }


