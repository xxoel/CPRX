from django.shortcuts import render
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from django.contrib.auth.decorators import login_required
from ydata_profiling import ProfileReport
from django.contrib.auth import models
from datetime import datetime
import os, requests, json

from io import BytesIO
import base64

@login_required(login_url="/",redirect_field_name=None)
def homepage(request):
    context = {'stats':'stats','iniciales':request.user.username[:2]}
    return render(request, 'stats/index.html', context)

@login_required(login_url="/",redirect_field_name=None)
def stats(request):
    df = loadData(request.user)
    if isinstance(df, type(None)) == False:
        clients = df.Codigo.unique().tolist()
        selected = 0
        month = ''
        hour = ''

        if request.method == 'POST':
            selected = int(request.POST['client'][-1])
            month = request.POST['month']
            hour = request.POST['hour']

        context = calcValues(df,selected, month, hour)
        context["stats"] = 'stats'
        context["clients"] = clients
        context["month"] = month
        context["hour"] = hour
        context["selected"] = selected
        context["iniciales"] = request.user.username[:2]
    else:
        context={'stats':'stats','nofile':'nofile','iniciales':request.user.username[:2]}
        
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

def avg_day(df):
        
    g = sns.lineplot(data=df,
            x='datetime',
            y='Consumo',
            hue='Codigo',
            marker = "o",
            palette=['r']
            )

    plt.xticks(rotation=45) 
    plt.grid(True)
    sns.despine()
    g.legend_.remove()

    return g

def avg_month(df):
    dataAux = df.groupby(['Codigo','datetime'])['Consumo'].mean().reset_index()
        
    g = sns.lineplot(data=dataAux,
            x='datetime',
            y='Consumo',
            hue='Codigo',
            marker = "o",
            palette=['r']
            )

    plt.xticks(rotation=45) 
    plt.grid(True)
    sns.despine()
    g.legend_.remove()

    return g

def avg_hour(df):
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

    return g

def get_price_hour(hour):
    if hour != '':
        input = requests.get('https://api.preciodelaluz.org/v1/prices/all?zone=PCB').json()
        hour_range = '{:02d}-{:02d}'.format(hour.hour, hour.hour + 1)
        return int(input[hour_range]['price'])/1000
    else:
        input = requests.get('https://api.preciodelaluz.org/v1/prices/now?zone=PCB').json()
        return int(input['price'])/1000

def calcValues(df,client, month, hour):
    df['datetime'] = pd.to_datetime(df['datetime'], infer_datetime_format=True)
    df['Hora'] = df['datetime'].dt.strftime('%H:%M')
    df = df.loc[df['Codigo'] == client]

    if not month == '':
        month = datetime.strptime(month,'%Y-%m')
        df = df.loc[df['datetime'].dt.month == month.month]
        df = df.loc[df['datetime'].dt.year == month.year]

    if not hour == '':
        hour = datetime.strptime(hour,'%H:%M')
        df = df.loc[df['datetime'].dt.hour == hour.hour]


    if not df.empty:
        consumo = df["Consumo"].mean()
        max_hora = df.loc[df['Consumo'].idxmax()]
        min_hora = df.loc[df['Consumo'].idxmin()]
        price = get_price_hour(hour)

        cost = {
            'min':price*min_hora[3],
            'max':price*max_hora[3],
            'avg':price*consumo
            }
        

        if hour == '':
            g = graph_to_file(avg_hour(df).figure)
        elif month == '':
            g = graph_to_file(avg_month(df).figure)
        else:
            g = graph_to_file(avg_day(df).figure)
        

        return {'stats':'stats', 'consumo':consumo, 'max':max_hora, 'min':min_hora, 'graph':g, 'price':price, 'cost':cost}
    return {'stats':'stats', 'nodata':'nodata'}


def loadData(user):
    path = os.path.abspath(os.getcwd()) + '/files/' + str(user)

    if os.path.isfile(path):
        df = pd.read_csv(path)
        df = df.rename(columns={"Código universal de punto de suministro": "Codigo"})
        df = df.rename(columns={"Método de obtención": "Obtencion"})
    else:
        df = None

    return df
    
    