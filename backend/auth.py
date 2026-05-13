from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from database.connection import supabase

security = HTTPBearer()

class User(BaseModel):
    id: str
    email: str

async def get_current_user(authorization: str = Depends(security)):
    """Verify Supabase JWT token and return user info"""
    try:
        token = authorization.credentials if hasattr(authorization, 'credentials') else authorization
        # Verify token with Supabase
        user_obj = supabase.auth.get_user(token)
        return user_obj
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
