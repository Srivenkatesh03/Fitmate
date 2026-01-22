"""
Email utilities for Fitmate
Handles sending verification and password reset emails
"""
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import secrets


def generate_token():
    """Generate a secure random token"""
    return secrets.token_urlsafe(32)


def send_verification_email(user, token):
    """
    Send email verification link to user
    
    Args:
        user: User object
        token: Verification token
    """
    subject = 'Verify your Fitmate account'
    verification_url = f"{settings.FRONTEND_URL}/verify-email/{token}"
    
    message = f"""
    Hi {user.username},
    
    Thank you for signing up for Fitmate!
    
    Please verify your email address by clicking the link below:
    {verification_url}
    
    If you didn't create an account with Fitmate, please ignore this email.
    
    Best regards,
    The Fitmate Team
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending verification email: {e}")
        return False


def send_password_reset_email(user, token):
    """
    Send password reset link to user
    
    Args:
        user: User object
        token: Reset token
    """
    subject = 'Reset your Fitmate password'
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"
    
    message = f"""
    Hi {user.username},
    
    You requested to reset your password for your Fitmate account.
    
    Click the link below to reset your password:
    {reset_url}
    
    This link will expire in 1 hour.
    
    If you didn't request a password reset, please ignore this email.
    
    Best regards,
    The Fitmate Team
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending password reset email: {e}")
        return False
