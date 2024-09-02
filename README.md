# EWSC-SLA Project

Eswatini Water Services Corporation SLA Project.

### Project Requirements & Setup

- Python 3.11 (using virtual environment)
- Django (Backend)
- DjangoRestFramework (APIs)
- ReactJS + Shadcn + React-Forms (Frontend)

Used Django for backend, database communication, authentication and serving APIs. Implemented a ReactJS
project for the frontend to consume the Django APIs.

> [!NOTE]
> The ReactJS projects sits inside the Django application, such that Django serves the ReactJS generated static files.

# How to install and run application

Follow this guide to install and run the application:

#### Backend Set-up

```shell
$ py -3.11 -m venv venv
$ venv\scripts\activate
$ (venv) cd ewscsla
$ (venv) pip install -r requirements.txt
$ (venv) manage.py migrate
$ (venv) manage.py runserver
```

### Backend css files setup

```shell
$ cd ewscsla
$ npm run build # to generate css for login page
```

### ReactJS Frontend

```shell
$ cd ewscsla/web/src
$ npm run build # to generate the frontend bundle
```

### Creating administration account

```shell
$ venv\scripts\activate
$ (venv) cd ewscsla
$ (venv) manage.py createsuperuser
```

### Demo Root Account

```shell
xhanka<rootroot>
```

> no limit on SLAs
> reports errors
> login errors
> pagination on sla improvement action
