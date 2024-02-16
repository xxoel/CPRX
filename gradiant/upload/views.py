from django.http import HttpResponseRedirect
from django.shortcuts import render
from .forms import DocumentForm
from .models import Document
import os
from django.core.files.storage import default_storage

def upload_file(request):
    message = 'Upload as many files as you want!'
    print("----", os.getcwd())
    print(request)
    if request.method == "POST":
        form = DocumentForm(request.POST, request.FILES)
        
        print(form)
        if form.is_valid(): 
            
            file = request.FILES['file']

            if request.user.is_authenticated():
                username = request.user.username
                default_storage.save(username, file)
            else:
                default_storage.save(file.name, file)
            return HttpResponseRedirect("/success")
    else:
        form = DocumentForm()

    documents = Document.objects.all()
    context = {'documents': documents, 'form': form, 'message': message}
    return render(request, "upload.html", context)






# Reading file from storage
# file = default_storage.open(file_name)
# file_url = default_storage.url(file_name)

def handle_uploaded_file(f):
    with open("files/", "wb+") as destination:
        for chunk in f.chunks():
            destination.write(chunk)


def upload(request):
    context = {}
    return render(request, 'upload/upload.html', context)






# Reading file from storage
# file = default_storage.open(file_name)
# file_url = default_storage.url(file_name)

def handle_uploaded_file(f):
    with open("files/", "wb+") as destination:
        for chunk in f.chunks():
            destination.write(chunk)


def upload(request):
    context = {}
    return render(request, 'upload/upload.html', context)