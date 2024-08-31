from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView
from django.core.paginator import Paginator
from django.forms import formset_factory
from django.http import HttpResponse, HttpRequest
from django.shortcuts import render, redirect
from django.utils import timezone
from openpyxl.workbook import Workbook
from openpyxl.writer.excel import save_virtual_workbook

from core.models import DEPARTMENT_CHOICES, SlaEntry, SlaRating, SlaImprovementPlanEntry, SlaCustomerStatusEntry

from .forms import CreateSlaEntryItemForm, CreateSlaEntryForm, CreateSlaRatingForm, SlaImprovementPlanEntryForm, \
    SlaCustomerStatusEntryForm


class SignInView(LoginView):
    form_class = AuthenticationForm
    template_name = "web/auth/login.html"


def logout(request):
    """Logout user and redirect to home page"""
    auth.logout(request)
    return redirect(to="web:home")


@login_required(login_url="/login/")
def dashboard(request):
    """Website dashboard, HomePage"""
    return render(request, 'web/index.html', {})


@login_required(login_url="/login/")
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


@login_required(login_url="/login/")
def rate_sla_entry(request):
    if request.method == "POST":
        # default to searching
        if request.POST.get('action', None) == 'searching':
            department = int(request.POST.get('department', 0))
            entries = SlaEntry.objects.filter(department=department)

            # after getting entries from the database, construct formset for saving rating
            # to the database
            SlaRatingFormSet = formset_factory(CreateSlaRatingForm, max_num=len(entries), min_num=len(entries))
            formset = SlaRatingFormSet(initial=[{'sla': sla} for sla in entries])

            return render(request, "web/customer/rate-entry.html", {
                'department': department,
                'formset': formset,
                'entries': entries,
                'formset_and_entries': zip(entries, formset)
            })

        # if we are rating, save the ratings to the database
        elif request.POST.get('action', None) == 'rating':
            department = int(request.POST.get('department', 0))
            entries = SlaEntry.objects.filter(department=department)

            SlaRatingFormSet = formset_factory(CreateSlaRatingForm, max_num=len(entries), min_num=len(entries))
            formset = SlaRatingFormSet(
                request.POST, request.FILES,
                initial=[{'sla': sla, 'rating': 5.0} for sla in entries],
            )

            if formset.is_valid():
                ratings = []
                for _form, sla in zip(formset.forms, entries):
                    ratings.append(
                        SlaRating(
                            sla=sla,
                            rating=int(_form.cleaned_data.get('rating', 5)),
                            reason=_form.cleaned_data.get('reason'),
                        )
                    )
                # bulk create sla objects
                SlaRating.objects.bulk_create(ratings)
                return render(request, "web/customer/rate-entry.html", {})

            else:
                return render(request, "web/customer/rate-entry.html", {
                    'department': department,
                    'formset': formset,
                    'entries': entries,
                    'formset_and_entries': zip(entries, formset)
                })

    return render(request, "web/customer/rate-entry.html", {})


@login_required(login_url="/login/")
def improvement_action_plan_select_department(request):
    if request.method == "POST":
        department = request.POST.get('department', None)
        if department:
            return redirect(to="web:improv-enter-action", department=department)
    return render(request, "web/manager/improvement-action-plan--select-department.html", {})


@login_required(login_url="/login/")
def improvement_action_plan_enter_action(request, department):
    # department as a string
    try:
        _department = dict(DEPARTMENT_CHOICES)[department]
        ratings = SlaRating.objects.filter(sla__department=department).order_by('pk')
        paginator = Paginator(ratings, 10)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        SlaImprovementPlanEntryFormSet = formset_factory(
            SlaImprovementPlanEntryForm,
            max_num=len(page_obj.object_list),
            min_num=len(page_obj.object_list)
        )
        formset = SlaImprovementPlanEntryFormSet()

        if request.method == "POST":
            formset = SlaImprovementPlanEntryFormSet(request.POST, request.FILES)

            if formset.is_valid():
                action_plans = []
                for form, rating in zip(formset.forms, page_obj.object_list):
                    action_plans.append(
                        SlaImprovementPlanEntry(
                            rating=rating,
                            improvement_action=form.cleaned_data.get('improvement_action'),
                            due_date=form.cleaned_data.get('due_date'),
                            status=form.cleaned_data.get('status'),

                        )
                    )
                SlaImprovementPlanEntry.objects.bulk_create(action_plans)
                formset = SlaImprovementPlanEntryFormSet()

        return render(request, "web/manager/improvement_action_plan_enter_action.html", {
            'department': _department,
            'page_obj': page_obj,
            'ratings': ratings,
            'formset': formset,
            'formset_and_ratings': zip(page_obj.object_list, formset)
        })

    except Exception as e:
        # print("an error occurred", e)
        return render(request, "web/manager/improvement_action_plan_enter_action.html", {
            'error': True
        })


@login_required(login_url="/login/")
def customer_status_select_department(request):
    if request.method == "POST":
        department = request.POST.get('department', None)
        if department:
            return redirect(to="web:customer-status-entry", department=department)
    return render(request, "web/customer/customer-status-select-department.html", {})


@login_required(login_url="/login/")
def customer_status_enter_status(request, department):
    # department as a string
    try:
        _department = dict(DEPARTMENT_CHOICES)[department]
        action_plans = SlaImprovementPlanEntry.objects.filter(rating__sla__department=department).order_by('pk')
        paginator = Paginator(action_plans, 10)
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        SlaCustomerStatusEntryFormSet = formset_factory(
            SlaCustomerStatusEntryForm,
            max_num=len(page_obj.object_list),
            min_num=len(page_obj.object_list)
        )
        formset = SlaCustomerStatusEntryFormSet()

        if request.method == "POST":
            formset = SlaCustomerStatusEntryFormSet(request.POST, request.FILES)

            if formset.is_valid():
                customer_status = []
                for form, plan in zip(formset.forms, page_obj.object_list):
                    customer_status.append(
                        SlaCustomerStatusEntry(
                            improvement_plan=plan,
                            status=form.cleaned_data.get('status'),
                        )
                    )
                SlaCustomerStatusEntry.objects.bulk_create(customer_status)
                return redirect(to="web:customer-status-select")

        return render(request, "web/customer/customer-status-enter-status.html", {
            'department': _department,
            'page_obj': page_obj,
            'action_plans': action_plans,
            'formset': formset,
            'formset_and_plans': zip(page_obj.object_list, formset)
        })

    except Exception as e:
        return render(request, "web/customer/customer-status-enter-status.html", {
            'error': True
        })


@login_required(login_url="/login/")
def generate_report_excel(request):
    if request.method == "POST":
        today = timezone.now().strftime("%Y-%m-%d %H:%M")
        today_str = timezone.now().strftime("%Y-%m-%d")

        workbook = Workbook()
        worksheet = workbook.active

        worksheet.append(["ESWATINI WATER SERVICES CORPORATION"])
        worksheet.append([])
        worksheet.append(["SLA's MONITORING TOOL"])

        worksheet.append([
            "Internal Service Provider", "Internal Customer", "Report Qrt Date",
            "Rating", "Reason for rating", "Agreed Improvement Action", "Due Date",
            "Manager Status (Service Provider)", "Internal Customer Status"
        ])

        sla_ratings = SlaRating.objects.order_by('updated_at')
        for rating in sla_ratings:
            worksheet.append([
                rating.sla.get_department_display(), "", str(rating.sla.date),
                rating.rating, str(rating.reason), str(rating.action_plan.improvement_action),
                str(rating.action_plan.due_date),
                str(rating.action_plan.get_status_display()),
                str(rating.action_plan.customer_status.get_status_display())
            ])

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename=SLA_REPORT_{today}.xlsx'
        response.write(save_virtual_workbook(workbook))

        return response

    return render(request, "web/manager/generate-reports.html", {})


@login_required(login_url="/login/")
def application(request: HttpRequest):
    """
    The main front-end website, that will bootstrap the ReactJs application.
    Authentication is implemented on the front-end and also on the APIs.
    """
    return render(request, 'web/main.html', {})
