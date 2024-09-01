from django.db import models
from django.contrib.auth.models import AbstractUser

DEPARTMENT_CHOICES = (
    (0, "Human Resources"),
    (1, "Finance"),
    (2, "IT"),
    (3, "Marketing")
)


class Department(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "core_sla_departments"


class AuthUser(AbstractUser):
    """
    User model for company employees
    """

    #: enforce this field, client side, force the user to select department if this is null
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        related_name="employees",
        null=True
    )


class SlaEntry(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="sla_entries")
    service_description = models.TextField()
    customer_responsibility = models.TextField()
    service_level = models.TextField()
    date = models.DateField(null=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name="sla_entries")

    class Meta:
        verbose_name_plural = "Sla Entries"
        db_table = "core_sla_entries"


class SlaRating(models.Model):
    sla = models.ForeignKey(SlaEntry, on_delete=models.CASCADE, related_name="ratings")
    rating = models.DecimalField(max_digits=30, decimal_places=2)
    reason = models.TextField()

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    rated_by = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name="sla_ratings")

    class Meta:
        db_table = "core_sla_ratings"

    def improvement_action_plan(self):
        if hasattr(self, 'action_plan'):
            return self.action_plan
        return None

    def customer_feedback_status(self):
        if hasattr(self, 'customer_status'):
            return self.customer_status
        return None


class SlaImprovementPlanEntry(models.Model):
    rating = models.OneToOneField(SlaRating, on_delete=models.CASCADE, related_name="action_plan")
    improvement_action = models.TextField()
    due_date = models.DateField(null=False)
    status = models.IntegerField(
        choices=(
            (0, "Resolved"),
            (1, "Met All"),
            (2, "In Progress"),
            (3, "Not Actioned")
        ), default=3
    )

    class Meta:
        db_table = "core_sla_improvement_plan_entries"


class SlaCustomerStatusEntry(models.Model):
    rating = models.OneToOneField(
        SlaRating, on_delete=models.CASCADE,
        related_name="customer_status"
    )
    status = models.IntegerField(
        choices=(
            (0, "Resolved"),
            (1, "Met All"),
            (2, "In Progress"),
            (3, "Not Actioned")
        ), default=3
    )

    class Meta:
        db_table = "core_sla_customer_status_entries"
