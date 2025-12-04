from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('users/me/', views.UserProfileView.as_view(), name='user-profile'),
    
    # Categories
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list'),
    
    # Products
    path('products/', views.ProductListCreateView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    
    # Orders
    path('orders/', views.OrderCreateView.as_view(), name='order-create'),
    path('orders/user/', views.UserOrdersView.as_view(), name='user-orders'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
]