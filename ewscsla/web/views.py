from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView

from django.http import HttpRequest
from django.shortcuts import render


class SignInView(LoginView):
    form_class = AuthenticationForm
    template_name = "web/auth/login.html"


@login_required(login_url="/login/")
def application(request: HttpRequest):
    """
    The main front-end website, that will bootstrap the ReactJs application.
    Authentication is implemented on the front-end and also on the APIs.
    """
    return render(request, 'web/main.html', {})
