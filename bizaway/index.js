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


