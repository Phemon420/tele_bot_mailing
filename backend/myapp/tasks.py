from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_welcome_email(email):
    send_mail(
        subject='Welcome!',
        message='Thank you for registering.',
        from_email='no-reply@example.com',
        recipient_list=[email],
        fail_silently=False,
    )
