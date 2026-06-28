import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure the project root is on sys.path so `backend.*` imports work
# whether uvicorn is launched from the repo root or the backend folder.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.config.settings import settings
from backend.database.db_init import initialize_database

from backend.api.project_routes import router as project_router
from backend.api.users_route import router as users_router
# from backend.api.team_routes import router as team_router
# from backend.api.task_routes import router as task_router
# from backend.api.progress_routes import router as progress_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(project_router)
app.include_router(users_router)
# app.include_router(team_router)
# app.include_router(task_router)
# app.include_router(progress_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Forge API"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
