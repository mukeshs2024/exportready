from fastapi import APIRouter, HTTPException
import hashlib
from database.connection import supabase

router = APIRouter()


def _hash_password(password: str) -> str:
    if not password:
        raise HTTPException(status_code=400, detail="Password is required")
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


@router.post("/add-user")
def add_user(
    name: str,
    email: str,
    password: str,
    company_name: str = "",
    country: str = "",
    phone: str = "",
    role: str = "exporter"
):
    data = {
        "name": name,
        "company_name": company_name,
        "country": country,
        "email": email,
        "phone": phone,
        "password_hash": _hash_password(password),
        "role": role
    }

    response = supabase.table("users").insert(data).execute()

    return {
        "message": "User added successfully",
        "data": response.data
    }


@router.post("/register-importer")
def register_importer(
    name: str,
    company_name: str,
    country: str,
    email: str,
    phone: str,
    password: str
):
    data = {
        "name": name,
        "company_name": company_name,
        "country": country,
        "email": email,
        "phone": phone,
        "password_hash": _hash_password(password),
        "role": "importer"
    }

    response = supabase.table("users").insert(data).execute()

    return {
        "message": "Importer registered successfully",
        "data": response.data
    }


@router.post("/register-exporter")
def register_exporter(
    name: str,
    company_name: str,
    country: str,
    email: str,
    phone: str,
    password: str
):
    data = {
        "name": name,
        "company_name": company_name,
        "country": country,
        "email": email,
        "phone": phone,
        "password_hash": _hash_password(password),
        "role": "exporter"
    }

    response = supabase.table("users").insert(data).execute()

    return {
        "message": "Exporter registered successfully",
        "data": response.data
    }
