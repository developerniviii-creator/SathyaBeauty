from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import razorpay
import datetime

from .models import Service, Package, Offer, Booking, Payment, AdminUser, SystemSetting
from .serializers import (
    UserSerializer, RegisterSerializer, ServiceSerializer,
    PackageSerializer, OfferSerializer, BookingSerializer, PaymentSerializer, CustomTokenObtainPairSerializer,
    SystemSettingSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView

RZP_KEY_ID = "rzp_test_TS2Tc99ViB4w2Y"
RZP_KEY_SECRET = "QB0Nv9oTFia65jfx8Oq450lR"
razorpay_client = razorpay.Client(auth=(RZP_KEY_ID, RZP_KEY_SECRET))

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

User = get_user_model()

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_admin

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            refresh['user_type'] = 'customer'
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        try:
            admin = AdminUser.objects.get(email__iexact=email)
            if admin.check_password(password):
                refresh = RefreshToken()
                refresh['user_id'] = str(admin.id)
                refresh['user_type'] = 'admin'
                
                return Response({
                    'user': {
                        'id': str(admin.id),
                        'email': admin.email,
                        'name': admin.name,
                        'is_admin': admin.is_admin
                    },
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except AdminUser.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class CustomerListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        customers = User.objects.all()
        serializer = UserSerializer(customers, many=True)
        return Response(serializer.data)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrReadOnly]

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [IsAdminOrReadOnly]

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsAdminOrReadOnly]

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin:
            return Booking.objects.all()
        return Booking.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        booking = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Booking.STATUS_CHOICES):
            booking.status = new_status
            booking.save()
            return Response({'status': 'Booking status updated'})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin:
            return Payment.objects.all()
        return Payment.objects.filter(booking__customer=self.request.user)

class CreateRazorpayOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            amount = float(request.data.get('amount'))
            total_amount = float(request.data.get('total_amount', amount))
            service_name = request.data.get('service')
            date_str = request.data.get('date')
            time_str = request.data.get('time')
            
            service = Service.objects.filter(name=service_name).first()
            date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else datetime.date.today()
            
            # Default time if missing or invalid
            try:
                time = datetime.datetime.strptime(time_str, "%H:%M").time() if time_str else datetime.time(9, 0)
            except ValueError:
                time = datetime.time(9, 0)
            
            booking = Booking.objects.create(
                customer=request.user,
                service=service,
                custom_service_name=service_name if not service else None,
                total_amount=total_amount,
                date=date,
                time=time,
                status='pending'
            )
            
            currency = "INR"
            order_receipt = f"receipt_{str(booking.id)}"
            
            notes = {
                'booking_id': str(booking.id),
                'customer_email': str(request.user.email)
            }
            
            razorpay_order = razorpay_client.order.create(dict(
                amount=int(amount * 100),
                currency=currency,
                receipt=order_receipt,
                notes=notes,
                payment_capture="0"
            ))
            
            payment = Payment.objects.create(
                booking=booking,
                amount=amount,
                status='pending',
                razorpay_order_id=razorpay_order['id']
            )
            
            return Response({
                'order_id': razorpay_order['id'],
                'amount': amount,
                'currency': currency,
                'key_id': RZP_KEY_ID,
                'booking_id': str(booking.id)
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class VerifyRazorpayPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            razorpay_payment_id = request.data.get('razorpay_payment_id')
            razorpay_order_id = request.data.get('razorpay_order_id')
            razorpay_signature = request.data.get('razorpay_signature')
            booking_id = request.data.get('booking_id')
            
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            
            result = razorpay_client.utility.verify_payment_signature(params_dict)
            if result is not None:
                payment = Payment.objects.get(razorpay_order_id=razorpay_order_id)
                payment.status = 'completed'
                payment.transaction_id = razorpay_payment_id
                payment.razorpay_signature = razorpay_signature
                payment.save()
                
                booking = payment.booking
                booking.status = 'confirmed'
                booking.save()
                
                return Response({'status': 'Payment verified successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid payment signature'}, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SystemSettingView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = SystemSetting.load()
        serializer = SystemSettingSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        if not (request.user and request.user.is_authenticated and request.user.is_admin):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
            
        settings = SystemSetting.load()
        serializer = SystemSettingSerializer(settings, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
