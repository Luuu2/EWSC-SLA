# EWSC-SLA Project

Eswatini Water Services Corporation SLA Project.

> [!NOTE]
> Updated README.md

## Features

- SLA Entries (unlimited)
- SLA Rating
- SLA Improvement Action Plans
- SLA Customer Feedback (on SLA Ratings added)
- Authentication (Session Authentication)
- Excel reports
- Archiving of old ratings and improvement plans

### Project Requirements & Setup

- Python 3.11 (using virtual environment)
- Django (Backend)
- DjangoRestFramework (APIs)
- ReactJS + Shadcn + React-Forms (Frontend)

Used Django for backend, database communication, authentication and serving APIs. Implemented a ReactJS
project for the frontend to consume the Django APIs.

> [!NOTE]
> The ReactJS projects sits inside the Django application, such that Django serves the ReactJS generated static files.

> [!WARNING]  
> The frontend application is not responsive. The tables are too long for mobile devices, consider using a table library
> for this functionality. For now, the application can not be viewed on small devices.

# How to install and run application

Follow this guide to install and run the application:

#### Backend Set-up

```shell
$ py -3.11 -m venv venv
$ venv\scripts\activate
$ (venv) cd ewscsla
$ (venv) pip install -r requirements.txt
$ (venv) python manage.py migrate
$ (venv) python manage.py runserver
```

### Backend css files setup

```shell
$ cd ewscsla
$ npm i
$ npm run build # to generate css for login page
```

### ReactJS Frontend

```shell
$ cd ewscsla/web/src
$ npm i
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


### Archiving Ratings (Quarter Reset)

Superadmins can archive quarterly records within the **Django Admin Portal**:

#### Bulk Select Specific Ratings
1. Go to **Django Admin** -> **Core** -> **Sla Ratings** (`/admin/core/slarating/`).
2. Use the checkboxes to select specific ratings.
3. Open the **Action** dropdown at the top, select **"Archive selected SLA ratings"**, and click **RUN**.
4. Be careful not to click the **"Delete selected items"**, this will permanetely delete entries, so keep backups just in case

### Restoring / Unarchiving Ratings

If ratings were archived by mistake, superadmins can restore them to the active state:

1. Go to **Django Admin** -> **Core** -> **Sla Ratings** (`/admin/core/slarating/`).
2. Set the **IS ARCHIVED** sidebar filter to **Yes** to show hidden records.
3. Select the ratings you wish to restore.
4. Open the **Action** dropdown, select **"Unarchive/Restore selected SLA ratings"**, and click **RUN**.
