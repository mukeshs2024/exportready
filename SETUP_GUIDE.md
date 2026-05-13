# ExportReady Development Setup Guide

## ✅ Current Status
- **Backend**: FastAPI running on `http://localhost:8000` ✓
- **Frontend**: React running on `http://localhost:3000` ✓

## 🚀 Project Structure

```
exportready/
├── backend/              (Python/FastAPI)
│   ├── main.py          # FastAPI entry point
│   ├── routes/          # API endpoints
│   ├── ai/              # AI modules
│   ├── database/        # Database connections
│   ├── requirements.txt  # Python dependencies
│   └── auth.py          # Authentication
├── frontend/            (React)
│   ├── package.json     # Node.js dependencies
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   └── services/    # API services
│   └── public/          # Static files
└── data/                # Shared data files
```

## 📦 Dependencies Created/Fixed

### Backend (Python)
- **requirements.txt** - Created with compatible versions
- **auth.py** - Authentication module
- **database/__init__.py** - Database helper functions

### Key Fixes Applied
1. **Pydantic Version Conflict** → Updated to `pydantic>=2.11.7`
2. **Missing auth.py** → Created JWT authentication module
3. **Missing get_db function** → Added database session helper
4. **HTTPAuthCredentials import** → Fixed to use HTTPBearer properly

## 🔧 Running the Project

### Terminal 1 - Backend (FastAPI)
```powershell
cd C:\exportready\backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend (React)
```powershell
cd C:\exportready\frontend
npm start
```

## 📡 API Endpoints
- Base URL: `http://localhost:8000`
- Frontend: `http://localhost:3000`
- Docs: `http://localhost:8000/docs` (Swagger UI)

## 🐛 Troubleshooting

### If backend fails to start:
1. Ensure Python 3.8+ is installed: `python --version`
2. Install dependencies: `pip install -r requirements.txt`
3. Check .env file for Supabase credentials

### If frontend fails to start:
1. Ensure Node 16+ is installed: `node --version`
2. Clear cache: `npm cache clean --force`
3. Reinstall: `rm -r node_modules && npm install --legacy-peer-deps`

### If CORS errors occur:
- Backend has CORS enabled for all origins (dev mode)
- Check that both services are running on correct ports

## 🎯 Next Steps
1. ✅ Backend and frontend are up and running
2. Test API endpoints at `http://localhost:8000/docs`
3. Visit frontend at `http://localhost:3000`
4. Configure Supabase credentials in `.env` if needed

## 📝 Environment Variables
Backend expects (in `.env`):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anonymous key

Currently uses default test values (see `database/connection.py`)
