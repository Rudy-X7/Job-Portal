from app.database.base import Base
from app.database.database import engine

# Import all models here
from app.models.user import User

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")