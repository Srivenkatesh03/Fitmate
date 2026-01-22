from django.urls import path
from .views import (
    RegisterView, LoginView, UserProfileView, ProfileUpdateView,
    PasswordChangeView, PasswordResetRequestView, PasswordResetConfirmView,
    EmailVerificationView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
    path('password-change/', PasswordChangeView.as_view(), name='password-change'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<str:token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('verify-email/<str:token>/', EmailVerificationView.as_view(), name='verify-email'),
]