from django.urls import path, re_path

from .views import SignInView, application

app_name = "web"
urlpatterns = [
    #: auth
    path('login/', SignInView.as_view(), name='login'),

    # react application
    # re_path(r'^(?!api).*', application, name='app'),
    re_path(r'', application),
    re_path(r'^(?!api).*/$', application, name='_app'),
]
