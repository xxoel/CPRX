from datetime import datetime
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, models
from .forms import RegisterForm

def homepage(request):
    context={'iniciales':request.user.username[:2]}
    return render(request, 'login/base.html', context)

def login_view(request):
    if request.method=="POST":
        email=request.POST.get("email")
        passwd=request.POST.get("passwd")
        user = authenticate(username=email, password=passwd)
        if user is not None:
            login(request, user)
            return redirect('/stats/')
        logout(request=request)
        context={'error':'The user entered is not correct'}
        return render(request,'login/base.html', context)

def logout_view(request):
    logout(request)
    return redirect('/')

def register(request):
    form=RegisterForm()

    if request.method == 'POST':
        form=RegisterForm(request.POST)
        if form.is_valid():          
            username = request.POST['username']
            email = request.POST['email']
            password = request.POST['password1']

            userM = models.User.objects

            if not userM.filter(email=email).exists():
                form.save()
                user = authenticate(username=username, password=password)
                if user is not None:
                    login(request, user)
                else:
                    return redirect('/register/')
            else:
                form.add_error('email', 'This email is already in use.')

    context={'form':form}
    return render(request, 'login/register.html', context)

def csrf_failure(request, reason=""):
    return render(request, 'login/csrftokenError.html', {})

def error404(request, exception):
    return render(request, 'login/404_error.html', status=404)