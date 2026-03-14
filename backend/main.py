from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes.users import router as users_router
from routes.products import router as products_router
from routes.analysis import router as analysis_router
from routes.export_analysis import router as export_router
from routes.export_action_plan import router as action_router
from routes.dashboard_analysis import router as dashboard_router
from routes.system_status import router as status_router
from routes.ai_intelligence import router as ai_router
from routes.trade_data import router as trade_router
from routes.compliance_check import router as compliance_router
from routes.orders import router as orders_router
from ai.chatbot import export_chatbot

app = FastAPI()

# Ensure CORS headers are always included, even on errors.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

from fastapi.responses import JSONResponse


@app.middleware("http")
async def _cors_add_headers(request, call_next):
    # FastAPI's CORS middleware can omit headers on some error paths; enforce them here.
    try:
        response = await call_next(request)
    except Exception as exc:
        # Ensure CORS headers are always present, even when an unhandled exception occurs.
        response = JSONResponse({"detail": "Internal server error"}, status_code=500)

    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# Include routers
app.include_router(users_router)
app.include_router(products_router)
app.include_router(analysis_router)
app.include_router(export_router)
app.include_router(action_router)
app.include_router(dashboard_router)
app.include_router(status_router)
app.include_router(ai_router)
app.include_router(trade_router)
app.include_router(compliance_router)
app.include_router(orders_router)


@app.get("/")
def home():
    return {"message": "ExportReady API running"}


@app.post("/chatbot")
def chatbot(query: str):
    response = export_chatbot(query)
    return {"response": response}

