from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm

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


admin.site.register(AuthUser, AuthUserAdmin)


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
    list_display = ('improvement_plan', 'status')
