# Import modules from SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Define the database URL (SQLite database file)
URL_DATABASE = 'sqlite:///./todosapp.db'

# Create a database engine with a configuration to allow multiple threads
engine = create_engine(URL_DATABASE, connect_args={'check_same_thread': False})

# Configure the session class for database interactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for defining database models
Base = declarative_base()
