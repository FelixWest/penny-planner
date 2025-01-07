from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from database import engine


app = FastAPI()

@app.get('/')
async def check():
    return 'hello'

# Allow frontend at localhost:3000 to access this API
origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Pydantic model for transaction input validation
class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    date: str

# Pydantic model for transaction response with an additional ID field
class TransactionModel(TransactionBase):
    id: int
    
# Dependency for getting a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# Create database tables if they don't already exist
models.Base.metadata.create_all(bind=engine)

# Endpoint to create a new transaction
@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db: db_dependency):
    db_transaction = models.Transaction(**transaction.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# Endpoint to retrieve all transactions with optional pagination
@app.get("/transactions/", response_model=List[TransactionModel])
async def read_transactions(db: db_dependency, skip: int=0, limit: int=100):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions

# Endpoint to delete a transaction by ID
@app.delete("/transactions/{transaction_id}", response_model=TransactionModel)
async def delete_transaction(transaction_id: int, db: db_dependency):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(db_transaction)
    db.commit()

    return db_transaction

# Endpoint to delete all transactions
@app.delete("/transactions/", response_model=int)
async def delete_all_transactions(db: db_dependency):
    # Delete all transactions
    deleted_count = db.query(models.Transaction).delete()
    db.commit()

    # Return the count of deleted transactions
    return deleted_count
