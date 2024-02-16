// script.js
document.getElementById('numberForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener el número ingresado por el usuario
    const number = parseInt(document.getElementById('numberInput').value, 10);

    // Limpiar el contenedor de salida
    const outputContainer = document.getElementById('output-container');
    outputContainer.innerHTML = '';

    // Crear divs con campos de entrada de texto según el número ingresado
    for (let i = 0; i < number; i++) {
        const div = document.createElement('div');
        div.classList.add('dynamic-input');

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Texto ${i + 1}`;

        div.appendChild(input);
        outputContainer.appendChild(div);
    }
});
