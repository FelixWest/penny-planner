# Import the base class and required SQLAlchemy components for model definitions
from database import Base
from sqlalchemy import Column, Integer, String, Float

# Define the database model for transactions
class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float) # Transaction amount
    category = Column(String) # Category, e.g., "Food" or "Rent"
    description = Column(String)  # Optional description
    date = Column(String) # Transaction date

