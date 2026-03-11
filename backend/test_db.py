from supabase import create_client

url ="https://pwzypicfejlxqyrswteh.supabase.co"
key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3enlwaWNmZWpseHF5cnN3dGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzk4MzUsImV4cCI6MjA4ODgxNTgzNX0.93jEx1dSwJxUNJ66NYy3M9oTDh4dLmvZRev5fL0rNQ4"

supabase = create_client(url, key)

try:
    response = supabase.table("users").select("*").execute()
    print("Database connected successfully!")
    print(response.data)

except Exception as e:
    print("Connection failed:", e)