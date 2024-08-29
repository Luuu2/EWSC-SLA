from django.db import models
from django.contrib.auth.models import AbstractUser

DEPARTMENT_CHOICES = (
    (0, "Human Resources"),
    (1, "Finance"),
    (2, "IT"),
    (3, "Marketing")
)


class AuthUser(AbstractUser):
    """
    User model for company employees
    """

    department = models.IntegerField(
        choices=DEPARTMENT_CHOICES,
        default=0
    )


class SlaEntry(models.Model):
    department = models.IntegerField(
        choices=DEPARTMENT_CHOICES,
    )
    service_description = models.TextField(max_length=2000, null=False)
    customer_responsibility = models.TextField(max_length=1500, null=False)
    service_level = models.TextField(max_length=1500, null=False)
    date = models.DateField(null=False)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Sla entries"


class SlaRating(models.Model):
    sla = models.ForeignKey(SlaEntry, on_delete=models.CASCADE, related_name="ratings")
    rating = models.DecimalField(max_digits=65, decimal_places=2)
    reason = models.TextField()

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


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


class SlaCustomerStatusEntry(models.Model):
    improvement_plan = models.OneToOneField(
        SlaImprovementPlanEntry, on_delete=models.CASCADE,
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
