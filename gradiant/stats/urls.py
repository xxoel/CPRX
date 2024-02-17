from . import views
from django.urls import path

urlpatterns = [
   path('', views.homepage, name='index'),
   path('pruebas', views.stats, name='pruebas'),
]