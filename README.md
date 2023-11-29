<p align="center">
  <img height="150" src="https://github.com/lafranceinsoumise/preprod.redmexa.com/blob/staging/agir/front/components/genericComponents/logos/action-populaire.svg">
</p>

![Tests status](https://github.com/lafranceinsoumise/preprod.redmexa.com/actions/workflows/run-tests.yml/badge.svg)

# preprod.redmexa.com

1. [Vagrant installation](#vagrant)
2. [Useful commands](#frontend-pages)

## Vagrant installation

You can use Vagrant to create a virtual machine running the project out of the box.
You need to have Vagrant and VirtualBox installed on your computer.


If this is not already installed, install vagrant-hostmanager plugin :
```bash
$ vagrant plugin install vagrant-hostmanager
```
Then just launch the box :
```bash
$ vagrant up
```

This installs PostgreSQL, Redis and Node onto the virtual
machine, and launch three more systemd services :

* `django` which is the development server of this project
* `MailHog`, a catch-all SMTP server used for development
* `webpack`, the webpack dev server with hot reloading

You can access Django from [http://agir.local:8000][django-server]
and Mailhog from [http://agir.local:8025][mailhog].

Once the vagrant machine and the django server are up, you must install frontend dependencies
through `npm clean-install` then build frontend assets either in development mode (by launching `npm run watch`)
or in production mode (with `npm run build`).
NB: Webpack dev server listens on port 3000, so be sure that the 3000 port is not being
used.

Initial migrations are automatically applied, and some fake data has been
loaded up. You can connect directly connect to the [django admin][django-admin] using the
default superuser `admin@agir.local` with password `password`.


The `/vagrant` directory in the box is synchronized with your
project directory on the host.

## Useful commands

Whenever you change the django models, you'll have to generate the migrations and apply them.

Connect to the vagrant box and move to the project directory :
```bash

$ vagrant ssh
$ cd /vagrant
```

Generate, then apply the migrations :
```bash
$ poetry run ./manage.py makemigrations
$ poetry run ./manage.py migrate
```

We use Travis to automatically test our code. To make sure you won't have to
recommit again, you should run the tests and the linters before pushing (again, this should
be ran from inside the `/vagrant` folder in the vagrant box).

```bash
$ black agir/
$ node_modules/.bin/eslint --fix agir/
$ poetry run ./manage.py test
```

## I18N

Translation files can be automatically generated in the `locale` folder by launching the custom command
```bash
$ poetry run ./manage.py make_all_messages -l es_MX
```

This will generate one translation file for django code (`locale/[language_code]/LC_MESSAGES/django.po`) and one for javascript code (`locale/[language_code]/LC_MESSAGES/djangojs.po`).

It is possible to specify translation ids in python and javascript files with `_() / gettext()` or another function from [the django translation package](https://docs.djangoproject.com/en/3.2/topics/i18n/translation/).

Once `.po` translation files are filled, they can be made available for usage through the django server by compiling them into `.mo` files with the command:
```bash
$ poetry run ./manage.py compile_all_messages -l es_MX
```
This should usually be integrated to and automatically done during the deployment process.