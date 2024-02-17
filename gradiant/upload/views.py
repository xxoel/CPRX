from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from .forms import DocumentForm
from django.core.files.storage import FileSystemStorage
import os

# Reading file from storage
# file = default_storage.open(file_name)
# file_url = default_storage.url(file_name)

def upload(request):

    message = 'Upload as many files as you want!'

    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        path = os.path.abspath(os.getcwd()) + '/files'
        fs = FileSystemStorage(location=path)
        if form.is_valid():
            file = request.FILES['myfile']
            fs.save(file.name, file)
            context = {'filename':file.name,'upload':'upload'}
            return render(request, 'upload/success.html', context)
    else:
        form = DocumentForm()

    context = {'form': form, 'message': message, 'request':request,'upload':'upload'}
    return render(request, 'upload/upload.html', context)
    