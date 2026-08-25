from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, UserProfileView, CustomerListView, ServiceViewSet, PackageViewSet,
    OfferViewSet, BookingViewSet, PaymentViewSet, CustomTokenObtainPairView, AdminLoginView,
    CreateRazorpayOrderView, VerifyRazorpayPaymentView, SystemSettingView
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'packages', PackageViewSet)
router.register(r'offers', OfferViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('payments/create-order/', CreateRazorpayOrderView.as_view(), name='create_order'),
    path('payments/verify-payment/', VerifyRazorpayPaymentView.as_view(), name='verify_payment'),
    path('settings/', SystemSettingView.as_view(), name='system_settings'),
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('auth/admin-login/', AdminLoginView.as_view(), name='admin_login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='auth_token_refresh'),
    path('users/profile/', UserProfileView.as_view(), name='user_profile'),
    path('users/customers/', CustomerListView.as_view(), name='customer_list'),
]
