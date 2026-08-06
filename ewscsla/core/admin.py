from django import forms
from django.contrib import admin, messages
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
admin.site.site_header = 'ESWC SLA Administration'  # default: "Django Administration"
admin.site.site_title = 'Eswatini Water Services Corporation'  # default: "Django site admin"


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
    list_per_page = 10
    list_display = ('sla', 'rating', 'rated_by', 'is_archived', 'updated_at')
    list_filter = ('is_archived', 'rating', 'sla__department')
    actions = ['archive_selected_ratings', 'unarchive_selected_ratings']

    @admin.action(description="Archive selected SLA ratings")
    def archive_selected_ratings(self, request, queryset):
        count = queryset.update(is_archived=True)
        self.message_user(
            request,
            f"Successfully archived {count} SLA rating(s).",
            messages.SUCCESS
        )

    @admin.action(description="Unarchive/Restore selected SLA ratings")
    def unarchive_selected_ratings(self, request, queryset):
        count = queryset.update(is_archived=False)
        self.message_user(
            request,
            f"Successfully restored {count} SLA rating(s).",
            messages.SUCCESS
        )


@admin.register(SlaImprovementPlanEntry)
class SlaImprovementPlanEntryAdmin(admin.ModelAdmin):
    list_per_page = 50
    list_display = ('improvement_action', 'status', 'due_date')


@admin.register(SlaCustomerStatusEntry)
class SlaCustomerStatusEntryAdmin(admin.ModelAdmin):
    list_per_page = 50
    list_display = ('rating', 'status')
