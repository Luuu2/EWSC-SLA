from django.urls import path

from .views import dashboard, SignInView, logout, sla_entry, rate_sla_entry

app_name = "web"
urlpatterns = [
    #: home
    path('', dashboard, name="home"),

    #: auth
    path('login/', SignInView.as_view(), name='login'),
    path('logout/', logout, name='logout'),

    #: manager urls
    path('sla-entry', sla_entry, name="sla-entry"),
    path('rate-sla', rate_sla_entry, name="rate-sla"),
]
