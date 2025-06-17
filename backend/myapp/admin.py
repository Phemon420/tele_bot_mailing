from django.contrib import admin

# Register your models here.
from .models import User, TelegramUserName

admin.site.register(User)


@admin.register(TelegramUserName)
class TelegramUserNameAdmin(admin.ModelAdmin):
    list_display = ('message_id', 'username')