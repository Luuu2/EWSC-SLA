from django.urls import path, re_path

from .views import dashboard, SignInView, logout, sla_entry, rate_sla_entry, improvement_action_plan_enter_action, \
    improvement_action_plan_select_department, customer_status_select_department, customer_status_enter_status, \
    generate_report_excel, application

app_name = "web"
urlpatterns = [
    #: home
    path('', dashboard, name="home"),

    #: auth
    path('login/', SignInView.as_view(), name='login'),
    path('logout/', logout, name='logout'),

    #: manager urls
    path('sla-entry/', sla_entry, name="sla-entry"),
    path('rate-sla/', rate_sla_entry, name="rate-sla"),

    path('improvement-plan-select-department/', improvement_action_plan_select_department, name="impro-select-dept"),
    path('improvement-plan-enter-action/<int:department>/', improvement_action_plan_enter_action,
         name="improv-enter-action"),

    path('customer-status-select-department/', customer_status_select_department, name="customer-status-select"),
    path('customer-status-entry/<int:department>/', customer_status_enter_status, name="customer-status-entry"),

    # missing reports path
    path('reports/', generate_report_excel, name="export-report"),

    # react application
    re_path(r'^.*', application, name='app'),
    re_path(r'^.*/$', application, name='_app'),
]
