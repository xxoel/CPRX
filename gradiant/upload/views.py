# Copyright (C) THEDATE Devin Breen
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
# along with dogtag.  If not, see <http://www.gnu.org/licenses/>.
from django.shortcuts import render
from .forms import DocumentForm
from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage
import os

@login_required(login_url="/",redirect_field_name=None)
def upload(request):

    message = 'Select a file to upload! '

    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        path = os.path.abspath(os.getcwd()) + '/files'
        fs = FileSystemStorage(location=path)
        if form.is_valid():
            file = request.FILES['myfile']
            fs.save(request.user.username, file)
            context = {'filename':file.name,'upload':'upload','iniciales':request.user.username[:2]}
            return render(request, 'upload/success.html', context)
    else:
        form = DocumentForm()

    context = {'form': form, 'message': message, 'request':request,'upload':'upload','iniciales':request.user.username[:2]}
    return render(request, 'upload/upload.html', context)
