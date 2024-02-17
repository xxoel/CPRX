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
const $cuerpoSpinner = document.querySelector(".spinner");

const searchInput = document.getElementById('register');
searchInput.addEventListener('click', function () {
    if (form_field[1].value === '' || form_field[2].value === '' || form_field[3].value === '' || form_field[4].value === '') {
        $cuerpoSpinner.innerHTML = ""
    } else { $cuerpoSpinner.innerHTML = `<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>`; }

});

window.addEventListener('pageshow', function (event) {
    $cuerpoSpinner.innerHTML = ""
});

$(function () {
    $('input#floatingFirstName').focus();
});

let form_field = document.getElementsByTagName('input')

form_field[1].id = 'email'
form_field[1].className = 'form-control'
form_field[1].placeholder = 'Correo electrónico(*)'

form_field[2].id = 'username'
form_field[2].className = 'form-control'
form_field[2].placeholder = 'Usuario(*)'

form_field[3].id = 'password1'
form_field[3].className = 'form-control'
form_field[3].placeholder = 'Contraseña(*)'

form_field[4].id = 'password2'
form_field[4].className = 'form-control'
form_field[4].placeholder = 'Reescribe tu contraseña(*)'