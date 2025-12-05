from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./marketplace.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String)
    hashed_password = Column(String)
    products = relationship("Product", back_populates="owner")
    orders = relationship("Order", back_populates="buyer")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    category_id = Column(Integer, ForeignKey("categories.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    category = relationship("Category", back_populates="products")
    owner = relationship("User", back_populates="products")
    orders = relationship("Order", back_populates="product")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    buyer_id = Column(Integer, ForeignKey("users.id"))
    quantity = Column(Integer)
    total_price = Column(Float)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    product = relationship("Product", back_populates="orders")
    buyer = relationship("User", back_populates="orders")

Base.metadata.create_all(bind=engine)

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: str
    name: str
    role: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class CategoryCreate(BaseModel):
    name: str
    description: str

class ProductCreate(BaseModel):
    title: str
    description: str
    price: float
    category_id: int

class OrderCreate(BaseModel):
    product_id: int
    quantity: int

# FastAPI app
app = FastAPI(title="MiniHub Marketplace API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Routes
@app.post("/api/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        name=user.name,
        role=user.role,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": user.username})
    return {
        "access": access_token,
        "user": {"id": db_user.id, "username": db_user.username, "name": db_user.name, "role": db_user.role}
    }

@app.post("/api/login/")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.username})
    return {
        "access": access_token,
        "user": {"id": db_user.id, "username": db_user.username, "name": db_user.name, "role": db_user.role}
    }

@app.get("/api/users/me/")
def get_user_profile(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username, "name": current_user.name, "role": current_user.role}

@app.get("/api/categories/")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@app.post("/api/categories/")
def create_category(category: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_category = Category(name=category.name, description=category.description)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/api/products/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    result = []
    for product in products:
        result.append({
            "id": product.id,
            "title": product.title,
            "description": product.description,
            "price": product.price,
            "category": product.category_id,
            "category_name": product.category.name if product.category else None,
            "user": {
                "id": product.owner.id,
                "name": product.owner.name,
                "username": product.owner.username,
                "role": product.owner.role
            },
            "created_at": product.created_at.isoformat()
        })
    return result

@app.post("/api/products/")
def create_product(product: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "seller":
        raise HTTPException(status_code=403, detail="Only sellers can create products")
    
    db_product = Product(
        title=product.title,
        description=product.description,
        price=product.price,
        category_id=product.category_id,
        user_id=current_user.id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.post("/api/orders/")
def create_order(order: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can create orders")
    
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot order your own product")
    
    total_price = product.price * order.quantity
    db_order = Order(
        product_id=order.product_id,
        buyer_id=current_user.id,
        quantity=order.quantity,
        total_price=total_price
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/api/orders/user/")
def get_user_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orders = db.query(Order).filter(Order.buyer_id == current_user.id).all()
    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "product_title": order.product.title,
            "quantity": order.quantity,
            "total_price": order.total_price,
            "status": order.status,
            "created_at": order.created_at.isoformat()
        })
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)