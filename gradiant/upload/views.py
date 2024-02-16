from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from .forms import DocumentForm
from django.core.files.storage import default_storage

# Reading file from storage
# file = default_storage.open(file_name)
# file_url = default_storage.url(file_name)

def upload(request):

    message = 'Upload as many files as you want!'

    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        print(request.FILES)
        if form.is_valid():
            
            file = request.FILES['myfile']
            default_storage.save(file.name, file)
            return HttpResponseRedirect("/success")
    else:
        form = DocumentForm()

    context = {'form': form, 'message': message, 'request':request}
    return render(request, 'upload/upload.html', context)
    