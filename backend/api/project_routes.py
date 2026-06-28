import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.database.connection import get_db
from backend.schemas.project_schema import (
    DashboardResponse,
    ProjectCreate,
    ProjectListResponse,
    ProjectMessage,
    ProjectResponse,
    ProjectStatus,
    ProjectUpdate,
)
from backend.services.project_service import (
    create_project,
    delete_project,
    get_project_by_id,
    list_projects,
    update_project,
)


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


def _raise_database_error(error: SQLAlchemyError):
    logger.exception("Project database operation failed: %s", error)
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Database operation failed"
    ) from error


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED
)
def create_project_endpoint(
    project_data: ProjectCreate,
    created_by: int = Query(..., ge=1),
    db: Session = Depends(get_db)
):
    try:
        return create_project(db, project_data, created_by)
    except SQLAlchemyError as error:
        _raise_database_error(error)


@router.get(
    "",
    response_model=ProjectListResponse
)
def list_projects_endpoint(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    created_by: Optional[int] = Query(default=None, ge=1),
    project_status: Optional[ProjectStatus] = Query(
        default=None,
        alias="status"
    ),
    db: Session = Depends(get_db)
):
    try:
        return list_projects(
            db=db,
            page=page,
            page_size=page_size,
            created_by=created_by,
            status=project_status.value if project_status else None
        )
    except SQLAlchemyError as error:
        _raise_database_error(error)


@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_project_endpoint(
    project_id: int,
    db: Session = Depends(get_db)
):
    try:
        project = get_project_by_id(db, project_id)
    except SQLAlchemyError as error:
        _raise_database_error(error)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


@router.get(
    "/{project_id}/dashboard",
    response_model=DashboardResponse
)
def get_project_dashboard_endpoint(
    project_id: int,
    db: Session = Depends(get_db)
):
    try:
        project = get_project_by_id(db, project_id)
    except SQLAlchemyError as error:
        _raise_database_error(error)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return DashboardResponse(project=project)


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse
)
def update_project_endpoint(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db)
):
    try:
        project = update_project(db, project_id, project_data)
    except SQLAlchemyError as error:
        _raise_database_error(error)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


@router.delete(
    "/{project_id}",
    response_model=ProjectMessage
)
def delete_project_endpoint(
    project_id: int,
    db: Session = Depends(get_db)
):
    try:
        deleted = delete_project(db, project_id)
    except SQLAlchemyError as error:
        _raise_database_error(error)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return ProjectMessage(message="Project deleted successfully")
