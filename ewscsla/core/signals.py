# import logging
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.conf import settings
# from django.template.loader import render_to_string
# from django.core.mail import send_mail
# from .models import SlaRating, AuthUser

# # Get an instance of a logger
# logger = logging.getLogger(__name__)


# @receiver(post_save, sender=SlaRating)
# def send_rating_notification_email(sender, instance: SlaRating, created, **kwargs):
#     """
#     Sends an email to the SLA Entry creator and up to two other random users
#     in the same department when a new rating is created.
#     """
#     if created:
#         sla_rating = instance
#         sla_entry = sla_rating.sla
#         sla_creator = sla_entry.added_by
#         department = sla_entry.department

#         # Get the email of the person who rated the SLA
#         rated_by_name = sla_rating.rated_by.get_full_name(
#         ) or sla_rating.rated_by.get_full_name()

#         # Get all users in the department, excluding the creator and users without an email
#         other_users_emails = list(AuthUser.objects.filter(
#             department=department,
#             is_active=True,
#         ).exclude(pk=sla_creator.pk).exclude(email='').values_list('email', flat=True).order_by('?')[:2])

#         # Create a list of recipients including the creator's email
#         recipient_emails = [sla_creator.email]
#         recipient_emails.extend(other_users_emails)

#         # Remove any empty or None values that might have been added
#         recipient_emails = [email for email in recipient_emails if email]

#         if not recipient_emails:
#             logger.warning(
#                 "No valid recipients found for SLA rating notification."
#             )
#             return

#         # Prepare email context with recipient's specific name
#         context = {
#             "department": department.name,
#             'sla_entry_date': sla_entry.date,
#             'sla_entry': sla_entry.key_performance_area,
#             "sla_entry_added_by": sla_creator.get_full_name(),

#             "rated_by_name": rated_by_name,
#             'rating_value': sla_rating.rating,
#             'rating_reason': sla_rating.reason if sla_rating.reason else 'N/A',
#         }

#         # Render the email content from the generic template
#         subject = "New Rating on Your Department's SLA Entry"
#         message = render_to_string(
#             'emails/sla_rating_notification.txt', context
#         )
#         from_email = settings.DEFAULT_FROM_EMAIL

#         try:
#             send_mail(
#                 subject=subject,
#                 message=message,
#                 from_email=from_email,
#                 recipient_list=recipient_emails,
#                 fail_silently=settings.DEBUG is False,  # Fail silently in production
#             )
#         except Exception as e:
#             logger.error(
#                 f"Failed to send email for SLA rating {sla_rating.pk}: {e}"
#             )
