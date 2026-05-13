from .connection import supabase

# Dummy get_db for FastAPI dependency injection
# In a pure Supabase setup, you should use supabase directly
# This is kept for backward compatibility with existing routes

class DummySession:
    """Placeholder session object for routes expecting SQLAlchemy Session"""
    def __init__(self):
        self._supabase = supabase
    
    def __getattr__(self, name):
        # Delegate to supabase for any attribute access
        return getattr(self._supabase, name)
    
    def close(self):
        pass

def get_db():
    """FastAPI dependency that returns a database session"""
    return DummySession()

__all__ = ['get_db', 'supabase']
