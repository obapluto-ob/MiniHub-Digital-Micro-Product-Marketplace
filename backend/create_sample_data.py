from main import SessionLocal, User, Category, Product, get_password_hash

def create_sample_data():
    db = SessionLocal()
    
    # Create categories
    categories = [
        Category(name="Digital Art", description="Digital artwork and designs"),
        Category(name="Software", description="Software and applications"),
        Category(name="E-books", description="Digital books and guides")
    ]
    
    for category in categories:
        existing = db.query(Category).filter(Category.name == category.name).first()
        if not existing:
            db.add(category)
    
    db.commit()
    
    # Create admin user
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        admin_user = User(
            username="admin",
            email="admin@example.com",
            name="Admin User",
            role="seller",
            hashed_password=get_password_hash("admin123")
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
    
    # Create sample products
    products = [
        Product(
            title="Logo Design Pack",
            description="Professional logo designs for your business",
            price=25.00,
            category_id=1,
            user_id=admin_user.id
        ),
        Product(
            title="Website Template",
            description="Modern responsive website template",
            price=45.00,
            category_id=2,
            user_id=admin_user.id
        ),
        Product(
            title="Python Programming Guide",
            description="Complete guide to learn Python programming",
            price=19.99,
            category_id=3,
            user_id=admin_user.id
        )
    ]
    
    for product in products:
        existing = db.query(Product).filter(Product.title == product.title).first()
        if not existing:
            db.add(product)
    
    db.commit()
    db.close()
    print("Sample data created successfully!")

if __name__ == "__main__":
    create_sample_data()