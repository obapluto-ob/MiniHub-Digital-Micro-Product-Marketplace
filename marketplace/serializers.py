from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Category, Product, Order

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'role', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'role']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'file_url', 'price', 'category', 'category_name', 'user', 'created_at']
        read_only_fields = ['user', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    buyer_name = serializers.CharField(source='buyer.name', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'product', 'product_title', 'buyer', 'buyer_name', 'quantity', 'total_price', 'status', 'created_at']
        read_only_fields = ['buyer', 'total_price', 'created_at']
    
    def validate(self, data):
        product = data['product']
        request = self.context['request']
        
        if product.user == request.user:
            raise serializers.ValidationError("Sellers cannot order their own products")
        
        if request.user.role != 'buyer':
            raise serializers.ValidationError("Only buyers can create orders")
        
        return data