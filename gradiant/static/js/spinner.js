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

const searchInputs = document.querySelectorAll('.list-group-item');
searchInputs.forEach(function(searchInput) {
    searchInput.addEventListener('click', function() {
        $cuerpoSpinner.innerHTML=`<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>`;
    });
})

window.addEventListener('pageshow', function(event) {
    $cuerpoSpinner.innerHTML=""
});