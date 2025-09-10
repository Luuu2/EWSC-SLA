from datetime import date
from django.db.models import Count, Q
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
from .models import Department, AuthUser
import logging
from django.utils import timezone
import calendar

# Get an instance of a logger
logger = logging.getLogger(__name__)


def send_sla_rating_email(department: Department, rating_department: Department | None):
    """
    Sends a rating notification email to all active users in a given department.
    """
    recipient_emails = list(
        AuthUser.objects.filter(department=department, is_active=True).exclude(
            email=""
        ).exclude(email='').values_list("email", flat=True).order_by('?')[:2]
    )

    # Remove any empty or None values that might have been added
    recipient_emails = [email for email in recipient_emails if email]

    if not recipient_emails:
        logger.warning(
            f"No valid recipients found for SLA rating notification for department: {department.name}"
        )
        return

    # Prepare email context
    context = {
        "department": department.name,
        "rating_department": rating_department.name if rating_department else "N/A",
    }

    # Render the email content from the generic template
    subject = "New SLA Ratings Have Been Submitted"
    message = render_to_string("emails/sla_rating_notification.txt", context)
    from_email = settings.DEFAULT_FROM_EMAIL

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_emails,
            fail_silently=settings.DEBUG is False,  # Fail silently in production
        )
        logger.info(
            f"Successfully sent SLA rating notification to {len(recipient_emails)} users in department {department.name}."
        )
        return True
    except Exception as e:
        logger.error(
            f"Failed to send email for department {department.name}: {e}"
        )
        return False


class DepartmentEmailsViewSet(viewsets.ViewSet):
    """
    A ViewSet for retrieving department SLA summaries and sending rating emails.
    """

    def list(self, request):
        """
        Retrieves a summary of SLA entries for all departments.
        Filters by 'from_date' and 'to_date' query parameters.
        """
        from_month_str = request.query_params.get('from_month')
        to_month_str = request.query_params.get('to_month')

        # Set default date range to 3 months ago to the current month
        today = date.today()
        default_to_month = today.strftime('%Y-%m')

        # Manually calculate the date for 3 months ago without relativedelta
        year, month = today.year, today.month
        month -= 3
        if month <= 0:
            month += 12
            year -= 1
        default_from_month = f"{year:04d}-{month:02d}"

        from_month_str = from_month_str if from_month_str else default_from_month
        to_month_str = to_month_str if to_month_str else default_to_month

        try:
            # Parse 'from_month' and 'to_month' strings
            from_year, from_month = map(int, from_month_str.split('-'))
            to_year, to_month = map(int, to_month_str.split('-'))

            # Construct the date objects
            from_date = date(from_year, from_month, 1)

            # Calculate the last day of the 'to_month'
            _, last_day = calendar.monthrange(to_year, to_month)
            to_date = date(to_year, to_month, last_day)

        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid month format. Use YYYY-MM."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        departments = Department.objects.annotate(
            total_entries=Count(
                "sla_entries",
                filter=Q(sla_entries__date__range=[from_date, to_date])
            ),
            rated_entries=Count(
                "sla_entries__ratings",
                filter=Q(sla_entries__date__range=[from_date, to_date])
            )
        ).values('id', 'name', 'total_entries', 'rated_entries')

        # Calculate unrated_entries and serialize the data
        serialized_departments = []
        for dept in departments:
            dept['unrated_entries'] = dept['total_entries'] - \
                dept['rated_entries']
            serialized_departments.append(dept)

        return Response(serialized_departments)

    @action(detail=False, methods=['post'], url_path='send-emails')
    def send_emails(self, request):
        """
        Sends SLA rating notification emails to specified departments.
        If no department_ids are provided, sends to all departments.
        """
        department_ids = request.data.get('department_ids', [])
        current_user: AuthUser = request.user

        if not current_user.is_authenticated:
            return Response(
                {"error": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not isinstance(department_ids, list):
            return Response(
                {"error": "'department_ids' must be a list."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                departments_to_email = Department.objects.all()
                if department_ids:
                    departments_to_email = departments_to_email.filter(
                        pk__in=department_ids
                    )

                total_departments = len(departments_to_email)
                if not total_departments:
                    return Response({
                        "status": 3,
                        "message": "No departments found to send emails to.",
                        "sent_count": 0
                    }, status=status.HTTP_200_OK)

                sent_count = 0
                for department in departments_to_email:
                    if send_sla_rating_email(department, current_user.department):
                        sent_count += 1

           # Determine the overall status
            if sent_count == total_departments:
                # 1. Good: All emails were sent successfully
                response_status = 1
            elif sent_count > 0:
                # 2. Not Good: Some emails were sent, but not all
                response_status = 2
            else:
                # 3. Fatal: None of the emails could be sent
                response_status = 3

            return Response({
                "status": response_status,
                "sent_count": sent_count,
                "total_count": total_departments,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error during bulk email sending: {e}")
            return Response(
                {"status": 3, "error": "An internal error occurred while processing the request."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
