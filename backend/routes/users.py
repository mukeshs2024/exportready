from fastapi import APIRouter
from database.connection import supabase

router = APIRouter()


@router.post("/add-user")
def add_user(name: str, email: str, password: str):
    data = {
        "name": name,
        "email": email,
        "password": password
    }

    response = supabase.table("users").insert(data).execute()

    return {
        "message": "User added successfully",
        "data": response.data
    }
