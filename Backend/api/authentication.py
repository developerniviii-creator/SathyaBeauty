from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from .models import AdminUser
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_type = validated_token.get('user_type')
        user_id = validated_token.get('user_id')

        if user_type == 'admin':
            try:
                user = AdminUser.objects.get(id=user_id)
            except AdminUser.DoesNotExist:
                raise AuthenticationFailed(_('Admin not found'), code='user_not_found')
        else:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise AuthenticationFailed(_('User not found'), code='user_not_found')

        return user
