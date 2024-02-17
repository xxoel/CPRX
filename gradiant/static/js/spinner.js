const $cuerpoSpinner = document.querySelector(".spinner");

const searchInputs = document.querySelectorAll('.list-group-item');
searchInputs.forEach(function(searchInput) {
    searchInput.addEventListener('click', function() {
        $cuerpoSpinner.innerHTML=`<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>`;
    });    
})

window.addEventListener('pageshow', function(event) {
    $cuerpoSpinner.innerHTML=""
});