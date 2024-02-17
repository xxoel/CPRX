from django import forms
from django.core.validators import FileExtensionValidator

class DocumentForm(forms.Form):
    myfile = forms.FileField(
        label='Select a file',
        help_text='max. 42 megabytes',
        validators=[FileExtensionValidator( ['csv'] )]
    )