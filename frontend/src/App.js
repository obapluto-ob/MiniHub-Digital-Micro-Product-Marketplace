import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([
    { 
      id: 1, 
      title: 'Logo Design Pack', 
      price: 25.00, 
      description: 'Professional logo designs for business', 
      seller: 'John Doe', 
      category: 'Digital Art',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Adobe_Premiere_Pro_CC_icon.svg/240px-Adobe_Premiere_Pro_CC_icon.svg.png',
      inventory: 10,
      rating: 4.5,
      reviews: [],
      tags: ['logo', 'design', 'business'],
      createdAt: new Date('2024-01-15').toISOString()
    },
    { 
      id: 2, 
      title: 'Website Template', 
      price: 45.00, 
      description: 'Modern responsive website template', 
      seller: 'Jane Smith', 
      category: 'Software',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/240px-HTML5_logo_and_wordmark.svg.png',
      inventory: 5,
      rating: 4.8,
      reviews: [],
      tags: ['website', 'template', 'responsive'],
      createdAt: new Date('2024-01-10').toISOString()
    },
    { 
      id: 3, 
      title: 'Python Guide', 
      price: 19.99, 
      description: 'Complete Python programming guide', 
      seller: 'Mike Johnson', 
      category: 'E-books',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/240px-Python-logo-notext.svg.png',
      inventory: 100,
      rating: 4.2,
      reviews: [],
      tags: ['python', 'programming', 'guide'],
      createdAt: new Date('2024-01-05').toISOString()
    },
    { 
      id: 4, 
      title: 'Mobile App UI Kit', 
      price: 35.00, 
      description: 'Complete UI kit for mobile apps', 
      seller: 'Sarah Wilson', 
      category: 'Digital Art',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Android_robot.svg/240px-Android_robot.svg.png',
      inventory: 8,
      rating: 4.7,
      reviews: [],
      tags: ['mobile', 'ui', 'app'],
      createdAt: new Date('2024-01-20').toISOString()
    }
  ]);
  
  const [users, setUsers] = useState([
    { 
      id: 1, 
      username: process.env.REACT_APP_DEMO_USERNAME || 'admin', 
      password: process.env.REACT_APP_DEMO_PASSWORD || 'admin123', 
      name: 'Admin User', 
      role: 'seller',
      email: 'admin@minihub.com',
      avatar: 'https://www.google.com/favicon.ico',
      bio: 'Marketplace administrator and seller',
      joinDate: new Date('2024-01-01').toISOString(),
      totalSales: 0,
      rating: 5.0
    }
  ]);
  
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [categories] = useState(['Digital Art', 'Software', 'E-books', 'Graphics', 'Templates']);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Load saved data from localStorage with error handling
    const safeParseJSON = (item) => {
      try {
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.warn('Failed to parse localStorage item:', error);
        return null;
      }
    };
    
    const savedUser = safeParseJSON(localStorage.getItem('currentUser'));
    const savedCart = safeParseJSON(localStorage.getItem('cart'));
    const savedOrders = safeParseJSON(localStorage.getItem('orders'));
    const savedUsers = safeParseJSON(localStorage.getItem('users'));
    const savedProducts = safeParseJSON(localStorage.getItem('products'));
    const savedWishlist = safeParseJSON(localStorage.getItem('wishlist'));
    const savedReviews = safeParseJSON(localStorage.getItem('reviews'));
    const savedNotifications = safeParseJSON(localStorage.getItem('notifications'));
    
    if (savedUser) setUser(savedUser);
    if (savedCart) setCart(savedCart);
    if (savedOrders) setOrders(savedOrders);
    if (savedUsers) setUsers(savedUsers);
    if (savedProducts) setProducts(savedProducts);
    if (savedWishlist) setWishlist(savedWishlist);
    if (savedReviews) setReviews(savedReviews);
    if (savedNotifications) setNotifications(savedNotifications);
  }, []);

  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const saveToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const login = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      saveToStorage('currentUser', foundUser);
      setCurrentView('home');
      showNotification(`Welcome back, ${foundUser.name}!`, 'success');
    } else {
      showNotification('Invalid username or password!', 'error');
    }
  };

  const register = (formData) => {
    const existingUser = users.find(u => u.username === formData.username);
    if (existingUser) {
      showNotification('Username already exists!', 'error');
      return;
    }
    
    const newUser = {
      id: Date.now() + Math.random(),
      username: formData.username,
      password: formData.password,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      avatar: 'https://github.com/favicon.ico',
      bio: '',
      joinDate: new Date().toISOString(),
      totalSales: 0,
      rating: 5.0
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage('users', updatedUsers);
    
    setUser(newUser);
    saveToStorage('currentUser', newUser);
    setCurrentView('home');
    showNotification('Registration successful! Welcome to MiniHub!', 'success');
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    setCurrentView('home');
    showNotification('Logged out successfully', 'info');
  };

  const addToCart = (product) => {
    if (!user) {
      showNotification('Please login first!', 'warning');
      return;
    }
    
    if (product.inventory <= 0) {
      showNotification('Product out of stock!', 'error');
      return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      showNotification('Product already in cart!', 'warning');
      return;
    }
    
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    saveToStorage('cart', updatedCart);
    showNotification('Added to cart!', 'success');
  };

  const addToWishlist = (product) => {
    if (!user) {
      showNotification('Please login first!', 'warning');
      return;
    }
    
    const existingItem = wishlist.find(item => item.id === product.id);
    if (existingItem) {
      removeFromWishlist(product.id);
      return;
    }
    
    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);
    saveToStorage('wishlist', updatedWishlist);
    showNotification('Added to wishlist!', 'success');
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(updatedWishlist);
    saveToStorage('wishlist', updatedWishlist);
    showNotification('Removed from wishlist', 'info');
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    saveToStorage('cart', updatedCart);
    showNotification('Removed from cart', 'info');
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    saveToStorage('cart', updatedCart);
  };

  const buyNow = (product, quantity = 1) => {
    if (!user) {
      showNotification('Please login first!', 'warning');
      return;
    }
    
    if (product.inventory < quantity) {
      showNotification('Insufficient inventory!', 'error');
      return;
    }
    
    const newOrder = {
      id: Date.now() + Math.random(),
      productId: product.id,
      productTitle: product.title,
      quantity: quantity,
      totalPrice: product.price * quantity,
      status: 'completed',
      createdAt: new Date().toISOString(),
      buyerName: user.name,
      sellerId: users.find(u => u.name === product.seller)?.id
    };
    
    // Update inventory
    const updatedProducts = products.map(p => 
      p.id === product.id ? { ...p, inventory: p.inventory - quantity } : p
    );
    setProducts(updatedProducts);
    saveToStorage('products', updatedProducts);
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveToStorage('orders', updatedOrders);
    showNotification('Order placed successfully!', 'success');
  };

  const checkout = () => {
    if (cart.length === 0) {
      showNotification('Cart is empty!', 'warning');
      return;
    }
    
    // Check inventory for all items
    for (const item of cart) {
      const product = products.find(p => p.id === item.id);
      if (product.inventory < item.quantity) {
        showNotification(`Insufficient inventory for ${item.title}`, 'error');
        return;
      }
    }
    
    const newOrders = cart.map((item, index) => ({
      id: Date.now() + index + Math.random(),
      productId: item.id,
      productTitle: item.title,
      quantity: item.quantity || 1,
      totalPrice: item.price * (item.quantity || 1),
      status: 'completed',
      createdAt: new Date().toISOString(),
      buyerName: user.name,
      sellerId: users.find(u => u.name === item.seller)?.id
    }));
    
    // Update inventory for all products
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, inventory: product.inventory - (cartItem.quantity || 1) };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    saveToStorage('products', updatedProducts);
    
    const updatedOrders = [...orders, ...newOrders];
    setOrders(updatedOrders);
    saveToStorage('orders', updatedOrders);
    
    setCart([]);
    localStorage.removeItem('cart');
    showNotification('All orders placed successfully!', 'success');
    setCurrentView('orders');
  };

  const createProduct = (productData) => {
    const newProduct = {
      id: Date.now() + Math.random(),
      title: productData.title,
      description: productData.description,
      price: parseFloat(productData.price),
      seller: user.name,
      category: productData.category,
      image: productData.image || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/240px-No_image_available.svg.png',
      inventory: parseInt(productData.inventory) || 1,
      rating: 0,
      reviews: [],
      tags: productData.tags ? productData.tags.split(',').map(tag => tag.trim()) : [],
      createdAt: new Date().toISOString()
    };
    
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    saveToStorage('products', updatedProducts);
    showNotification('Product created successfully!', 'success');
    setCurrentView('home');
  };

  const addReview = (productId, rating, comment) => {
    const newReview = {
      id: Date.now() + Math.random(),
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    saveToStorage('reviews', updatedReviews);
    
    // Update product rating
    const productReviews = updatedReviews.filter(r => r.productId === productId);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, rating: avgRating, reviews: productReviews } : p
    );
    setProducts(updatedProducts);
    saveToStorage('products', updatedProducts);
    
    showNotification('Review added successfully!', 'success');
  };

  return (
    <div className="app">
      <NotificationContainer 
        notifications={notifications} 
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />
      <Header 
        user={user} 
        onViewChange={setCurrentView} 
        onLogout={logout}
        cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        wishlistCount={wishlist.length}
        currentView={currentView}
      />
      
      <main className="main-content">
        {currentView === 'home' && (
          <HomePage 
            products={products}
            categories={categories}
            onAddToCart={addToCart}
            onAddToWishlist={addToWishlist}
            onBuyNow={buyNow}
            onViewProduct={setSelectedProduct}
            user={user}
            wishlist={wishlist}
          />
        )}
        
        {currentView === 'login' && (
          <AuthForm 
            isLogin={true}
            onSubmit={(data) => login(data.username, data.password)}
            onCancel={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'register' && (
          <AuthForm 
            isLogin={false}
            onSubmit={register}
            onCancel={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'cart' && (
          <CartPage 
            cart={cart}
            onCheckout={checkout}
            onContinueShopping={() => setCurrentView('home')}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
          />
        )}
        
        {currentView === 'wishlist' && (
          <WishlistPage 
            wishlist={wishlist}
            onAddToCart={addToCart}
            onRemoveFromWishlist={removeFromWishlist}
            onContinueShopping={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'orders' && (
          <OrdersPage 
            orders={orders.filter(o => o.buyerName === user?.name)} 
            onAddReview={addReview}
            user={user}
          />
        )}
        
        {currentView === 'profile' && user && (
          <ProfilePage 
            user={user}
            users={users}
            setUsers={setUsers}
            saveToStorage={saveToStorage}
            showNotification={showNotification}
          />
        )}
        
        {currentView === 'analytics' && user?.role === 'seller' && (
          <AnalyticsPage 
            products={products.filter(p => p.seller === user.name)}
            orders={orders.filter(o => o.sellerId === user.id)}
            user={user}
          />
        )}
        
        {currentView === 'create-product' && (
          <ProductForm 
            categories={categories}
            onSubmit={createProduct}
            onCancel={() => setCurrentView('home')}
          />
        )}
        
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
            onAddToWishlist={addToWishlist}
            onBuyNow={buyNow}
            onAddReview={addReview}
            user={user}
            reviews={reviews.filter(r => r.productId === selectedProduct.id)}
            isInWishlist={wishlist.some(item => item.id === selectedProduct.id)}
            wishlist={wishlist}
          />
        )}
      </main>
    </div>
  );
}

function NotificationContainer({ notifications, onDismiss }) {
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button 
            className="notification-close" 
            onClick={() => onDismiss(notification.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function Header({ user, onViewChange, onLogout, cartCount, wishlistCount, currentView }) {
  return (
    <header className="header">
      <h1 onClick={() => onViewChange('home')}>MiniHub Marketplace</h1>
      <nav className="nav">
        {user ? (
          <div className="user-menu">
            <span>Welcome, {user.name}</span>
            {user.role === 'seller' && (
              <button 
                onClick={() => onViewChange('create-product')}
                className={currentView === 'create-product' ? 'active' : ''}
              >
                Add Product
              </button>
            )}
            <button 
              onClick={() => onViewChange('cart')}
              className={currentView === 'cart' ? 'active' : ''}
            >
              Cart ({cartCount})
            </button>
            <button 
              onClick={() => onViewChange('wishlist')}
              className={currentView === 'wishlist' ? 'active' : ''}
            >
              Wishlist ({wishlistCount})
            </button>
            <button 
              onClick={() => onViewChange('orders')}
              className={currentView === 'orders' ? 'active' : ''}
            >
              Orders
            </button>
            <button 
              onClick={() => onViewChange('profile')}
              className={currentView === 'profile' ? 'active' : ''}
            >
              Profile
            </button>
            {user.role === 'seller' && (
              <button 
                onClick={() => onViewChange('analytics')}
                className={currentView === 'analytics' ? 'active' : ''}
              >
                Analytics
              </button>
            )}
            <button onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button onClick={() => onViewChange('login')}>Login</button>
            <button onClick={() => onViewChange('register')}>Register</button>
          </div>
        )}
      </nav>
    </header>
  );
}

function HomePage({ products, categories, onAddToCart, onAddToWishlist, onBuyNow, onViewProduct, user, wishlist }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseFloat(priceRange.max));
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="home-page">
      <div className="hero-section">
        <h2>Digital Marketplace</h2>
        <p>Discover amazing digital products</p>
      </div>
      
      <div className="search-filters">
        <div className="main-search">
          <input
            type="text"
            placeholder="Search products, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>
        
        {showFilters && (
          <div className="advanced-filters">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-filter"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            
            <div className="price-range">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                className="price-input"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                className="price-input"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="results-info">
        <p>{sortedProducts.length} products found</p>
      </div>
      
      <div className="products-grid">
        {sortedProducts.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          sortedProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart(product)}
              onAddToWishlist={() => onAddToWishlist(product)}
              onBuyNow={() => onBuyNow(product)}
              onViewDetails={() => onViewProduct(product)}
              canBuy={user && user.role === 'buyer' && user.name !== product.seller}
              isInWishlist={wishlist.some(item => item.id === product.id)}
              user={user}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart, onAddToWishlist, onBuyNow, onViewDetails, canBuy, isInWishlist, user }) {
  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.image} 
          alt={product.title}
          onError={(e) => {
            e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/240px-No_image_available.svg.png';
          }}
        />
        {user && (
          <button 
            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
            onClick={onAddToWishlist}
            title={isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          >
            ♡
          </button>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="clickable" onClick={onViewDetails}>{product.title}</h3>
        <p className="description">{product.description.substring(0, 100)}...</p>
        
        <div className="product-meta">
          <div className="price">${product.price}</div>
          <div className="rating">
            <span className="stars">{renderStars(product.rating)}</span>
            <span className="rating-text">({product.rating.toFixed(1)})</span>
          </div>
        </div>
        
        <div className="seller">Seller: {product.seller}</div>
        <div className="category">Category: {product.category}</div>
        <div className="inventory">Stock: {product.inventory}</div>
        
        {product.tags && product.tags.length > 0 && (
          <div className="tags">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}
        
        <div className="product-actions">
          <button className="view-details-btn" onClick={onViewDetails}>
            View Details
          </button>
          {canBuy && product.inventory > 0 && (
            <>
              <button className="add-to-cart-btn" onClick={onAddToCart}>Add to Cart</button>
              <button className="buy-btn" onClick={onBuyNow}>Buy Now</button>
            </>
          )}
          {product.inventory === 0 && (
            <div className="out-of-stock">Out of Stock</div>
          )}
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, onCheckout, onContinueShopping, onRemoveFromCart, onUpdateQuantity }) {
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  
  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty</h3>
          <button onClick={onContinueShopping}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img 
                src={item.image} 
                alt={item.title} 
                className="cart-item-image"
                onError={(e) => {
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/240px-No_image_available.svg.png';
                }}
              />
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <p className="item-price">${item.price} each</p>
                  <div className="quantity-controls">
                    <button onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}>-</button>
                    <span>Qty: {item.quantity || 1}</span>
                    <button onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <p className="item-total">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  <button className="remove-btn" onClick={() => onRemoveFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${total.toFixed(2)}</h3>
            <div className="cart-actions">
              <button onClick={onContinueShopping}>Continue Shopping</button>
              <button onClick={onCheckout} className="checkout-btn">Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function WishlistPage({ wishlist, onAddToCart, onRemoveFromWishlist, onContinueShopping }) {
  return (
    <div className="wishlist-page">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <h3>Your wishlist is empty</h3>
          <button onClick={onContinueShopping}>Continue Shopping</button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-item">
              <img 
                src={item.image} 
                alt={item.title}
                onError={(e) => {
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/240px-No_image_available.svg.png';
                }}
              />
              <h4>{item.title}</h4>
              <p className="price">${item.price}</p>
              <div className="wishlist-actions">
                <button onClick={() => onAddToCart(item)} className="add-to-cart-btn">
                  Add to Cart
                </button>
                <button onClick={() => onRemoveFromWishlist(item.id)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfilePage({ user, users, setUsers, saveToStorage, showNotification }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || '',
    avatar: user.avatar
  });
  const [errors, setErrors] = useState({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (formData.avatar && !formData.avatar.startsWith('http')) {
      newErrors.avatar = 'Avatar must be a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const updatedUser = { ...user, ...formData };
    const updatedUsers = users.map(u => 
      u.id === user.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    saveToStorage('users', updatedUsers);
    saveToStorage('currentUser', updatedUser);
    setIsEditing(false);
    setErrors({});
    showNotification('Profile updated successfully!', 'success');
  };

  const handlePasswordChange = () => {
    if (passwordData.currentPassword !== user.password) {
      showNotification('Current password is incorrect', 'error');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }
    
    const updatedUser = { ...user, password: passwordData.newPassword };
    const updatedUsers = users.map(u => 
      u.id === user.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    saveToStorage('users', updatedUsers);
    saveToStorage('currentUser', updatedUser);
    setShowPasswordChange(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showNotification('Password changed successfully!', 'success');
  };

  const getProfileStats = () => {
    const joinDays = Math.floor((new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24));
    return { joinDays };
  };

  const stats = getProfileStats();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar-section">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="profile-avatar"
            onError={(e) => {
              e.target.src = 'https://github.com/favicon.ico';
            }}
          />
          <div className="profile-badge">
            <span className={`role-badge ${user.role}`}>{user.role.toUpperCase()}</span>
          </div>
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="email">{user.email}</p>
          <p className="join-date">Member for {stats.joinDays} days</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{(user.rating || 0).toFixed(1)}</span>
              <span className="stat-label">Rating</span>
            </div>
            {user.role === 'seller' && (
              <div className="stat">
                <span className="stat-value">${user.totalSales || 0}</span>
                <span className="stat-label">Sales</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h3>About</h3>
          <p className="bio">{user.bio || 'No bio available. Tell others about yourself!'}</p>
        </div>
        
        {isEditing ? (
          <div className="profile-edit">
            <h3>Edit Profile</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                maxLength={500}
                rows={4}
              />
              <small>{formData.bio.length}/500 characters</small>
            </div>
            
            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                className={errors.avatar ? 'error' : ''}
              />
              {errors.avatar && <span className="error-text">{errors.avatar}</span>}
            </div>
            
            <div className="profile-actions">
              <button onClick={handleSave} className="save-btn">Save Changes</button>
              <button onClick={() => {
                setIsEditing(false);
                setFormData({ name: user.name, email: user.email, bio: user.bio || '', avatar: user.avatar });
                setErrors({});
              }} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="profile-actions-section">
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
            <button onClick={() => setShowPasswordChange(true)} className="password-btn">Change Password</button>
          </div>
        )}
        
        {showPasswordChange && (
          <div className="password-change">
            <h3>Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </div>
            <div className="profile-actions">
              <button onClick={handlePasswordChange} className="save-btn">Change Password</button>
              <button onClick={() => {
                setShowPasswordChange(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }} className="cancel-btn">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsPage({ products, orders, user }) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  
  const productStats = products.map(product => {
    const productOrders = orders.filter(o => o.productId === product.id);
    const revenue = productOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const unitsSold = productOrders.reduce((sum, o) => sum + o.quantity, 0);
    return { ...product, revenue, unitsSold, orders: productOrders.length };
  }).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="analytics-page">
      <h2>Sales Analytics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Products Listed</h3>
          <p className="stat-value">{totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Average Order</h3>
          <p className="stat-value">${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}</p>
        </div>
      </div>
      
      <div className="product-performance">
        <h3>Product Performance</h3>
        <div className="performance-table">
          {productStats.map(product => (
            <div key={product.id} className="performance-row">
              <div className="product-name">{product.title}</div>
              <div className="product-stats">
                <span>Revenue: ${product.revenue.toFixed(2)}</span>
                <span>Units Sold: {product.unitsSold}</span>
                <span>Orders: {product.orders}</span>
                <span>Stock: {product.inventory}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose, onAddToCart, onAddToWishlist, onBuyNow, onAddReview, user, reviews, isInWishlist }) {
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const canBuy = user && user.role === 'buyer' && user.name !== product.seller;
  const canReview = user && user.role === 'buyer' && !reviews.some(r => r.userId === user.id);
  
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    onAddReview(product.id, reviewForm.rating, reviewForm.comment);
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };
  
  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="product-modal-content">
          <div className="product-modal-image">
            <img 
              src={product.image} 
              alt={product.title}
              onError={(e) => {
                e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/240px-No_image_available.svg.png';
              }}
            />
          </div>
          
          <div className="product-modal-info">
            <h2>{product.title}</h2>
            <div className="price-large">${product.price}</div>
            
            <div className="product-rating">
              <span className="stars">{renderStars(product.rating)}</span>
              <span>({product.rating.toFixed(1)}) - {reviews.length} reviews</span>
            </div>
            
            <div className="product-details">
              <p className="full-description">{product.description}</p>
              <div className="seller-info">Seller: {product.seller}</div>
              <div className="category-info">Category: {product.category}</div>
              <div className="inventory-info">Stock: {product.inventory}</div>
              <div className="date-info">Listed: {new Date(product.createdAt).toLocaleDateString()}</div>
              
              {product.tags && product.tags.length > 0 && (
                <div className="product-tags">
                  <strong>Tags: </strong>
                  {product.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              {user && (
                <button 
                  className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                  onClick={() => onAddToWishlist(product)}
                >
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              )}
              
              {canBuy && product.inventory > 0 && (
                <>
                  <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
                    Add to Cart
                  </button>
                  <button className="buy-btn" onClick={() => onBuyNow(product)}>
                    Buy Now
                  </button>
                </>
              )}
            </div>
            
            {canReview && (
              <div className="review-section">
                <button 
                  className="add-review-btn"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? 'Cancel Review' : 'Write Review'}
                </button>
                
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <select 
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                    >
                      {[5,4,3,2,1].map(rating => (
                        <option key={rating} value={rating}>{rating} Stars</option>
                      ))}
                    </select>
                    <textarea
                      placeholder="Write your review..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                      required
                    />
                    <button type="submit">Submit Review</button>
                  </form>
                )}
              </div>
            )}
            
            <div className="reviews-list">
              <h3>Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p>No reviews yet</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <strong>{review.userName}</strong>
                      <span className="review-rating">{renderStars(review.rating)}</span>
                      <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersPage({ orders, onAddReview, user }) {
  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <h4>{order.productTitle}</h4>
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <p>Quantity: {order.quantity}</p>
                <p>Total: ${order.totalPrice.toFixed(2)}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductForm({ categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    inventory: '1',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="product-form">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Product Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="url"
          placeholder="Product Image URL"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
        />
        <input
          type="number"
          min="1"
          placeholder="Inventory Quantity"
          value={formData.inventory}
          onChange={(e) => setFormData({...formData, inventory: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
        />
        <div className="form-buttons">
          <button type="submit">Create Product</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function AuthForm({ isLogin, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    role: 'buyer'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        
        {!isLogin && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </>
        )}
        
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        
        <div className="form-buttons">
          <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      
      {isLogin && (
        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
          Demo: username "{process.env.REACT_APP_DEMO_USERNAME || 'admin'}", password "{process.env.REACT_APP_DEMO_PASSWORD || 'admin123'}"
        </div>
      )}
    </div>
  );
}

export default App;