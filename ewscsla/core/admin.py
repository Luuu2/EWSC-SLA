from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm

from .models import AuthUser


class AuthUserChangeForm(UserChangeForm):
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
