# GRADIANT

## :scroll: Description

This directory stores the custom structure created for the "ElectroDatos" challenge.

## :file_folder: Directory structure
```
. (base-dir)
├── gradiant
│   ├── XX
│   ├── urls.py
│   └── settings.py
├── apps
│   └── XX
│   └── forms.py
│   └── models.py
│   └── urls.py
│   └── views.py
├── requirements.txt
└── manage.py
└── README.md

```
Description of each directory:
* `gradiant`: Base directory containing the configuration files and the definition of the different applications.
* `apps`: Set of modules that support the different functionalities of the web server.

Description of each file:
* `requirements.txt`: File containing the dependencies to be installed in the project with the command `pip install -r requirements.txt`
* `manage.py`: File that allows us to run the server and manage the configuration.
* `README.md`: Text file that introduces and explains the project
* `XX`: xx

## :crystal_ball: [Manage.py](manage.py)
It serves the same function as django-admin and sets the DJANGO_SETTINGS_MODULE environment variable to point to the project's settings.py file. This tool uses the [Manage.py](manage.py) definition.

The following commands are available:
* `python3 manage.py makemigrations`: Creating new migrations based on the changes made to the models.
* `python3 manage.py migrate`: Applying and unapplying migrations 
* `python3 manage.py runserver`: Runs the server by default on `127.0.0.1:8000`.

Example of how to deploy:
```bash
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```