from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self,email,password=None,**extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email=self.normalize_email(email)
        user = self.model(email=email,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self,email,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        return self.create_user(email,password,**extra_fields)
    

class User(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name=models.CharField(max_length=255,blank=True)
    last_name=models.CharField(max_length=255,blank=True)
    is_active = models.BooleanField(default=True)   
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'
    
    def __str__(self)->str:
        return self.email

class TelegramUserName(models.Model):
    message_id=models.IntegerField(unique=True)
    username=models.CharField(max_length=255)

    def __str__(self):
        return f"Message ID: {self.message_id}, Username: {self.username}"