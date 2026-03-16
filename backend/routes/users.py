from fastapi import APIRouter, HTTPException
import bcrypt
from database.connection import supabase

router = APIRouter()



def _hash_password(password: str) -> str:
    if not password:
        raise HTTPException(status_code=400, detail="Password is required")
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def _check_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

# --- Unified Auth Endpoints ---

from fastapi import Request
from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
    name: str
    company_name: str
    country: str
    email: EmailStr
    phone: str
    password: str
    role: str  # "exporter" or "importer"

@router.post("/auth/signup")
def signup(user: SignupRequest):
    # Check if user already exists
    existing = supabase.table("users").select("id").eq("email", user.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    data = {
        "name": user.name,
        "company_name": user.company_name,
        "country": user.country,
        "email": user.email,
        "phone": user.phone,
        "password_hash": _hash_password(user.password),
        "role": user.role,
    }
    response = supabase.table("users").insert(data).execute()
    return {"message": "Account created"}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/auth/login")
def login(credentials: LoginRequest):
    user = (
        supabase.table("users")
        .select("id, name, company_name, country, email, phone, password_hash, role")
        .eq("email", credentials.email)
        .limit(1)
        .execute()
    )
    if not user.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_row = user.data[0]
    if not _check_password(credentials.password, user_row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Remove password_hash before returning
    user_row.pop("password_hash", None)
    return user_row


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
