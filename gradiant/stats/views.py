from django.shortcuts import render
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from ydata_profiling import ProfileReport
from django.contrib.auth import models
import email.utils as eutils
import os, time, datetime

from io import BytesIO
import base64

def homepage(request):
    context = {'stats':'stats'}
    return render(request, 'stats/index.html', context)

def stats(request):
    context = loadData()
    return render(request, 'stats/stats.html', context)

def graph_to_file(plot):
    buffer = BytesIO()
    plot.savefig(buffer, format='png')
    buffer.seek(0)
    image_png=buffer.getvalue()
    graph=base64.b64encode(image_png).decode('utf-8')
    buffer.close()
    plt.clf()
    return graph

def loadData():
    # Código universal de punto de suministro
    # Fecha
    # Hora
    # Consumo
    # Método de obtención
    # datetime 
    path = os.path.abspath(os.getcwd()) + '/csvs/'

    df = pd.read_csv(path+'electrodatos.csv')
    df = df.rename(columns={"Código universal de punto de suministro": "Codigo"})
    df = df.rename(columns={"Método de obtención": "Obtencion"})

    
    df['datetime'] = pd.to_datetime(df['datetime'], infer_datetime_format=True)
    df = df.loc[df['Codigo'] == 0]


    consumo = str(df["Consumo"].mean())
    max_hora = df.loc[df['Consumo'].idxmax()]
    min_hora = df.loc[df['Consumo'].idxmin()]

    dataAux = df.groupby(['Codigo','Hora'])['Consumo'].mean().reset_index()

    g = sns.barplot(data=dataAux,
             x='Hora',
             y='Consumo',
             hue='Codigo'
            )
    
    g.legend_.remove()
    
    
    profile = ProfileReport(df, title="Report Contadores Luz")

    return {'stats':'stats', 'consumo':consumo, 'max':max_hora, 'min':min_hora, 'graph':graph_to_file(g.figure)}
