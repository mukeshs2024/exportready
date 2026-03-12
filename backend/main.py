from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes.users import router as users_router
from routes.products import router as products_router
from routes.analysis import router as analysis_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users_router)
app.include_router(products_router)
app.include_router(analysis_router)


@app.get("/")
def home():
    return {"message": "ExportReady API running"}

