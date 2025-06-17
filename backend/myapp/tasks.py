from celery import shared_task
from django.core.mail import send_mail
from dotenv import load_dotenv
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, '.env'))

@shared_task
def send_welcome_email(email):
    send_mail(
        subject='Welcome!',
        message='Thank you for registering.',
        from_email=os.getenv('FROM_EMAIL', 'omsrivastava3466@gmail.com'),
        recipient_list=[email],
        fail_silently=False,
    )
