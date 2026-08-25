from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Service, Package, Offer, Booking, Payment, SystemSetting


User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_type'] = 'customer'
        return token

class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'is_customer', 'is_admin')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'phone_number', 'is_customer', 'is_admin')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            is_customer=validated_data.get('is_customer', True),
            is_admin=validated_data.get('is_admin', False)
        )
        return user

class ServiceSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = Service
        fields = '__all__'

class PackageSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    services = ServiceSerializer(many=True, read_only=True)
    service_ids = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(), source='services', write_only=True, many=True
    )

    class Meta:
        model = Package
        fields = '__all__'

class OfferSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = Offer
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    customer = UserSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    package = PackageSerializer(read_only=True)
    
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(), source='service', write_only=True, required=False, allow_null=True
    )
    package_id = serializers.PrimaryKeyRelatedField(
        queryset=Package.objects.all(), source='package', write_only=True, required=False, allow_null=True
    )
    advance_paid = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('status', 'customer')

    def get_advance_paid(self, obj):
        try:
            if obj.payment and obj.payment.status == 'completed':
                return obj.payment.amount
        except Exception:
            pass
        return 0

    def get_payment_status(self, obj):
        try:
            if obj.payment:
                return obj.payment.status
        except Exception:
            pass
        return 'pending'

class PaymentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    booking = BookingSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'

class SystemSettingSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = SystemSetting
        fields = '__all__'
