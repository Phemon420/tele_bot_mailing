from django.contrib.auth import get_user_model

def create_user(email, password, first_name='', last_name=''):
    print(f"Creating user with email: {email}, first name: {first_name}, last name: {last_name}")
    return get_user_model().objects.create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
