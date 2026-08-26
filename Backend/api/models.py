from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password, check_password

class AdminUser(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_admin = models.BooleanField(default=True)
    
    @property
    def is_authenticated(self):
        return True
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.email

class User(AbstractUser):
    is_customer = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    def __str__(self):
        return self.username

class Service(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50, help_text="Duration (e.g. 45 mins)")
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    category = models.CharField(max_length=100, default='General')
    status = models.CharField(max_length=20, default='Active')

    def __str__(self):
        return self.name

class Package(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    services = models.ManyToManyField(Service, related_name='packages')
    image = models.ImageField(upload_to='packages/', blank=True, null=True)

    def __str__(self):
        return self.name

class Offer(models.Model):
    name = models.CharField(max_length=255)
    services_included = models.TextField(blank=True, help_text="Comma separated services")
    original_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration = models.CharField(max_length=100, blank=True, null=True)
    valid_until = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='offers/', blank=True, null=True)

    def __str__(self):
        return self.name

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    custom_service_name = models.CharField(max_length=255, blank=True, null=True)
    package = models.ForeignKey(Package, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    time = models.TimeField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.username} - {self.date} {self.time}"

class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Booking {self.booking.id} - {self.status}"

class SystemSetting(models.Model):
    # General
    parlour_name = models.CharField(max_length=255, default="Sathya Beauty")
    contact_number = models.CharField(max_length=50, default="+91 98765 43210")
    application_address = models.TextField(default="123 Beauty Avenue, Anna Nagar, Chennai, Tamil Nadu 600040")
    currency = models.CharField(max_length=20, default="INR (₹)")
    
    # Notifications
    email_alerts = models.BooleanField(default=True)
    sms_alerts = models.BooleanField(default=False)
    booking_reminders = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)
    
    # Appearance
    theme_color = models.CharField(max_length=50, default="pink")
    dashboard_mode = models.CharField(max_length=20, default="light")
    def save(self, *args, **kwargs):
        if not self.pk and SystemSetting.objects.exists():
            self.pk = SystemSetting.objects.first().pk
        super(SystemSetting, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj = cls.objects.first()
        if not obj:
            obj = cls.objects.create()
        return obj

    def __str__(self):
        return "System Settings"

class OTPVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_verifications')
    otp = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.otp}"

class AdminOTPVerification(models.Model):
    admin = models.ForeignKey(AdminUser, on_delete=models.CASCADE, related_name='otp_verifications')
    otp = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.admin.email} - {self.otp}"
