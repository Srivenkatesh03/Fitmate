from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from .serializers import UserSerializer, LoginSerializer, UserUpdateSerializer, PasswordChangeSerializer
from .models import User, EmailVerificationToken, PasswordResetToken
from .email_utils import generate_token, send_verification_email, send_password_reset_email

class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Send verification email
        token = generate_token()
        EmailVerificationToken.objects.create(user=user, token=token)
        send_verification_email(user, token)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Account created successfully. Please check your email to verify your account.'
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    
    def get_object(self):
        return self.request.user


class PasswordChangeView(APIView):
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        if not check_password(serializer.validated_data['old_password'], user.password):
            return Response(
                {'error': 'Invalid old password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({'message': 'Password changed successfully'})


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            token = generate_token()
            PasswordResetToken.objects.create(user=user, token=token)
            send_password_reset_email(user, token)
            
            return Response({
                'message': 'Password reset email sent. Please check your inbox.'
            })
        except User.DoesNotExist:
            # Return success even if user doesn't exist (security best practice)
            return Response({
                'message': 'If an account with that email exists, a password reset link has been sent.'
            })


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, token):
        new_password = request.data.get('new_password')
        
        if not new_password:
            return Response(
                {'error': 'New password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
            
            if not reset_token.is_valid():
                return Response(
                    {'error': 'Token has expired or already been used'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user = reset_token.user
            user.set_password(new_password)
            user.save()
            
            reset_token.used = True
            reset_token.save()
            
            return Response({'message': 'Password reset successful'})
        except PasswordResetToken.DoesNotExist:
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )


class EmailVerificationView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        try:
            verification_token = EmailVerificationToken.objects.get(token=token)
            
            if not verification_token.is_valid():
                return Response(
                    {'error': 'Token has expired'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user = verification_token.user
            user.is_email_verified = True
            user.save()
            
            verification_token.delete()
            
            return Response({'message': 'Email verified successfully'})
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )