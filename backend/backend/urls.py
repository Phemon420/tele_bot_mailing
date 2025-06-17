"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from myapp.views import register_user,login_user,telegram_webhook,fetch_all_telegram_users,fetch_profile_by_email


urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register_user, name="register"),
    path('login/', login_user, name="login"),
    path('webhook/', telegram_webhook, name="telegram_webhook"),
    path('fetch-telegram-users/', fetch_all_telegram_users, name="fetch_telegram_users"),
    path('profile/', fetch_profile_by_email, name="fetch_profile_by_email"),
]
