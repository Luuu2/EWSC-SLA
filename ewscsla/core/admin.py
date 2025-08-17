from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm
from django.contrib.auth.admin import UserAdmin
from django_microsoft_sso.admin import (
    MicrosoftSSOInlineAdmin, get_current_user_and_admin
)
from .models import AuthUser, SlaEntry, SlaRating, SlaImprovementPlanEntry, SlaCustomerStatusEntry, Department


class AuthUserChangeForm(UserChangeForm):
    class CustomModelChoiceField(forms.ModelChoiceField):
        def label_from_instance(self, obj):
            return f'{obj.name} - DEP'

    department = CustomModelChoiceField(queryset=Department.objects.all())

    class Meta(UserChangeForm.Meta):
        model = AuthUser


class AuthUserAdmin(UserAdmin):
    form = AuthUserChangeForm

    fieldsets = UserAdmin.fieldsets + (
        (
            None, {
                'fields': (
                    'department',
                )
            }
        ),
    )


CurrentUserModel, last_admin, LastUserAdmin = get_current_user_and_admin()
if admin.site.is_registered(CurrentUserModel):
    admin.site.unregister(CurrentUserModel)


@admin.register(CurrentUserModel)
class CustomUserAdmin(LastUserAdmin):
    inlines = (
        tuple(set(list(last_admin.inlines) + [MicrosoftSSOInlineAdmin]))
        if last_admin
        else (MicrosoftSSOInlineAdmin,)
    )


# admin.site.register(AuthUser, AuthUserAdmin)
# default: "Django Administration"
admin.site.site_header = 'ESWC SLA Administration'
# default: "Django site admin"
admin.site.site_title = 'Eswatini Water Services Corporation'


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_per_page = 50
    list_display = ('name',)


@admin.register(SlaEntry)
class SlaEntryAdmin(admin.ModelAdmin):
    list_per_page = 50
    list_display = ('department', 'service_level', 'date')


@admin.register(SlaRating)
class SlaRatingAdmin(admin.ModelAdmin):
    list_per_page = 50
    list_display = ('sla', 'rating')


@admin.register(SlaImprovementPlanEntry)
class SlaImprovementPlanEntryAdmin(admin.ModelAdmin):
    list_per_page = 50
    list_display = ('improvement_action', 'status', 'due_date')


@admin.register(SlaCustomerStatusEntry)
class SlaCustomerStatusEntryAdmin(admin.ModelAdmin):
    list_per_page = 50
    list_display = ('rating', 'status')
