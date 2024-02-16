from django.http import HttpResponseRedirect
from django.shortcuts import render
from .forms import UploadFileForm
from django.core.files.storage import default_storage

def upload_file(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES['f']
            file_name = default_storage.save(file.name, file)
            return HttpResponseRedirect("/success")
    else:
        form = UploadFileForm()
    return render(request, "upload.html", {"form": form})






#  Reading file from storage
file = default_storage.open(file_name)
file_url = default_storage.url(file_name)

def handle_uploaded_file(f):
    with open("files/", "wb+") as destination:
        for chunk in f.chunks():
            destination.write(chunk)