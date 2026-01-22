from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmailVerificationToken, PasswordResetToken

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'is_email_verified', 'is_staff', 'created_at']
    list_filter = ['is_email_verified', 'is_staff', 'is_active']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('profile_picture', 'is_email_verified', 'bio')}),
    )


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'expires_at', 'is_valid']
    search_fields = ['user__username', 'user__email']
    
    def is_valid(self, obj):
        return obj.is_valid()
    is_valid.boolean = True


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'expires_at', 'used', 'is_valid']
    list_filter = ['used']
    search_fields = ['user__username', 'user__email']
    
    def is_valid(self, obj):
        return obj.is_valid()
    is_valid.boolean = True