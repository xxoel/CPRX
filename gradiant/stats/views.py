from __future__ import print_function

from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test
import pandas as pd
import pendulum
import matplotlib.pyplot as plt
from datetime import datetime
from django.contrib.auth import models


def homepage(request):
    return render(request, 'stats/index.html', context={})
