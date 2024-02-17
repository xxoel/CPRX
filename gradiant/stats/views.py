from django.shortcuts import render
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from django.contrib.auth.decorators import login_required
from ydata_profiling import ProfileReport
from django.contrib.auth import models
import os

from io import BytesIO
import base64

@login_required(login_url="/",redirect_field_name=None)
def homepage(request):
    context = {'stats':'stats'}
    return render(request, 'stats/index.html', context)

@login_required(login_url="/",redirect_field_name=None)
def stats(request):
    df = loadData(request.user)
    if isinstance(df, type(None)) == False:
        clients = df.Codigo.unique().tolist()
        selected = 0

        if request.method == 'POST':
            selected = int(request.POST['client'][-1])

        context = calcValues(df,selected)
        context["clients"] = clients
        context["selected"] = selected
    else:
        context={'nofile':'nofile'}
        
    return render(request, 'stats/stats.html', context)

def graph_to_file(plot):
    buffer = BytesIO()
    plot.savefig(buffer, format='png',bbox_inches='tight')
    buffer.seek(0)
    image_png=buffer.getvalue()
    graph=base64.b64encode(image_png).decode('utf-8')
    buffer.close()
    plt.clf()
    return graph

def calcValues(df,client):
    df['datetime'] = pd.to_datetime(df['datetime'], infer_datetime_format=True)
    df['Hora'] = df['datetime'].dt.strftime('%H:%M')
    df = df.loc[df['Codigo'] == client]


    consumo = str(df["Consumo"].mean())
    consumo_max = int(df["Consumo"].max())
    max_hora = df.loc[df['Consumo'].idxmax()]
    min_hora = df.loc[df['Consumo'].idxmin()]

    dataAux = df.groupby(['Codigo','Hora'])['Consumo'].mean().reset_index()
    
    g = sns.lineplot(data=dataAux,
             x='Hora',
             y='Consumo',
             hue='Codigo',
             marker = "o",
             palette=['r']
            )

    plt.xticks(rotation=45) 
    plt.grid(True)
    sns.despine()
    g.legend_.remove()

    profile = ProfileReport(df, title="Report Contadores Luz")

    return {'stats':'stats', 'consumo':consumo, 'max':max_hora, 'min':min_hora, 'graph':graph_to_file(g.figure)}


def loadData(user):
    path = os.path.abspath(os.getcwd()) + '/files/' + str(user)

    if os.path.isfile(path):
        df = pd.read_csv(path)
        df = df.rename(columns={"Código universal de punto de suministro": "Codigo"})
        df = df.rename(columns={"Método de obtención": "Obtencion"})
    else:
        df = None

    return df
    
    