from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView
from django.forms import formset_factory
from django.shortcuts import render, redirect

from core.models import DEPARTMENT_CHOICES, SlaEntry

from .forms import CreateSlaEntryItemForm, CreateSlaEntryForm, CreateSlaRatingForm


class SignInView(LoginView):
    form_class = AuthenticationForm
    template_name = "web/auth/login.html"


def logout(request):
    """Logout user and redirect to home page"""
    auth.logout(request)
    return redirect(to="web:home")


@login_required(login_url="/login")
def dashboard(request):
    """Website dashboard, HomePage"""
    return render(request, 'web/index.html', {})


@login_required(login_url="/login")
def sla_entry(request):
    # this form validates the department and the date since it is common for all entries
    form = CreateSlaEntryForm(initial={"department": 0})
    # the following form validated the other fields
    SlaEntryFormItemsSet = formset_factory(CreateSlaEntryItemForm, max_num=5, min_num=5)

    if request.method == "POST":
        formset = SlaEntryFormItemsSet(request.POST, request.FILES)
        form = CreateSlaEntryForm(request.POST)

        if formset.is_valid() and form.is_valid():
            date = form.cleaned_data.get('date')
            department = form.cleaned_data.get('department')

            count = SlaEntry.objects.filter(department=department).count()
            if count >= 5:
                # if the count is entries are already above 5, then they have been added
                # todo:  prevent user from re-entering data
                pass

            entries = []
            for _form in formset.forms:
                entries.append(
                    SlaEntry(
                        date=date,
                        department=department,
                        service_description=_form.cleaned_data.get('service_description'),
                        customer_responsibility=_form.cleaned_data.get('customer_responsibility'),
                        service_level=_form.cleaned_data.get('service_level')
                    )
                )
            # bulk create sla objects
            SlaEntry.objects.bulk_create(entries)

            # clear form
            formset = SlaEntryFormItemsSet()
            form = CreateSlaEntryForm(initial={"department": 0})

    else:
        formset = SlaEntryFormItemsSet()

    return render(request, "web/manager/sla-entry.html", {
        'departments': DEPARTMENT_CHOICES,
        'formset': formset,
        'form': form
    })


@login_required(login_url="/login")
def rate_sla_entry(request):
    # # this form validates the department and the date since it is common for all entries
    # form = CreateSlaEntryForm(initial={"department": 0})
    # # the following form validated the other fields
    # SlaEntryFormItemsSet = formset_factory(CreateSlaEntryItemForm, max_num=5, min_num=5)

    if request.method == "POST":
        # formset = SlaEntryFormItemsSet(request.POST, request.FILES)
        # form = CreateSlaEntryForm(request.POST)

        isSearch = request.POST.get('action', 'search')
        if isSearch:
            department = request.POST.get('department', 0)
            entries = SlaEntry.objects.filter(department=department)
            print(entries)
        else:
            print('not searching')

        # if formset.is_valid() and form.is_valid():
        #
        #
        # date = form.cleaned_data.get('date')
        # department = form.cleaned_data.get('department')
        #
        # entries = []
        # for _form in formset.forms:
        #     entries.append(
        #         SlaEntry(
        #             date=date,
        #             department=department,
        #             service_description=_form.cleaned_data.get('service_description'),
        #             customer_responsibility=_form.cleaned_data.get('customer_responsibility'),
        #             service_level=_form.cleaned_data.get('service_level')
        #         )
        #     )
        # # bulk create sla objects
        # SlaEntry.objects.bulk_create(entries)
        #
        # # clear form
        # formset = SlaEntryFormItemsSet()
        # form = CreateSlaEntryForm(initial={"department": 0})

    return render(request, "web/customer/rate-entry.html", {
    })
