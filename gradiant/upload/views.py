from django.shortcuts import render
from .forms import DocumentForm
from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage
import os

@login_required(login_url="/",redirect_field_name=None)
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
    