from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms

class DateInput(forms.DateInput):
    input_type='date'

class RegisterForm(UserCreationForm):
    username=forms.CharField(required=True, label='Usuario')
    email= forms.EmailField(required=True, label='Email')
    password1=forms.CharField(widget=forms.PasswordInput(),label='Password', 
                              help_text='<div id="errores"><p>The password must contain at least 8 characters</p><p>The password cannot be entirely numeric</p><p>The password cannot be very common</p></div>')
    password2=forms.CharField(widget=forms.PasswordInput(),label='Password')
    
    class Meta():
        model = User
        fields = ["username", "password1", "password2"]