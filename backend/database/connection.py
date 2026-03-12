import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL", "https://pwzypicfejlxqyrswteh.supabase.co")
key = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3enlwaWNmZWpseHF5cnN3dGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzk4MzUsImV4cCI6MjA4ODgxNTgzNX0.93jEx1dSwJxUNJ66NYy3M9oTDh4dLmvZRev5fL0rNQ4")

supabase = create_client(url, key)
