from typing import Optional

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.models.project import Project
from backend.schemas.project_schema import (
    ProjectCreate,
    ProjectListResponse,
    ProjectResponse,
    ProjectSummary,
    ProjectUpdate,
)


def _project_response_from_model(project: Project) -> ProjectResponse:
    return ProjectResponse.model_validate(project)


def _project_summary_from_model(project: Project) -> ProjectSummary:
    return ProjectSummary.model_validate(project)


def create_project(
    db: Session,
    project_data: ProjectCreate,
    created_by: int
) -> ProjectResponse:
    project = Project(
        title=project_data.title,
        description=project_data.description,
        idea=project_data.idea,
        timeline_weeks=project_data.timeline_weeks,
        created_by=created_by,
    )

    try:
        db.add(project)
        db.commit()
        db.refresh(project)
        return _project_response_from_model(project)
    except SQLAlchemyError:
        db.rollback()
        raise


def get_project_by_id(
    db: Session,
    project_id: int
) -> Optional[ProjectResponse]:
    project = db.get(Project, project_id)
    return _project_response_from_model(project) if project else None


def list_projects(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    created_by: Optional[int] = None,
    status: Optional[str] = None
) -> ProjectListResponse:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    offset = (page - 1) * page_size

    query = db.query(Project)
    if created_by is not None:
        query = query.filter(Project.created_by == created_by)

    if status is not None:
        query = query.filter(Project.status == status)

    total = query.count()

    projects = (
        query
        .order_by(Project.created_at.desc(), Project.id.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return ProjectListResponse(
        total=total,
        page=page,
        page_size=page_size,
        projects=[
            _project_summary_from_model(project)
            for project in projects
        ]
    )


def update_project(
    db: Session,
    project_id: int,
    project_data: ProjectUpdate
) -> Optional[ProjectResponse]:
    project = db.get(Project, project_id)
    if not project:
        return None

    update_data = project_data.model_dump(exclude_unset=True)

    if not update_data:
        return _project_response_from_model(project)

    if "status" in update_data and update_data["status"] is not None:
        update_data["status"] = update_data["status"].value

    for field_name, field_value in update_data.items():
        setattr(project, field_name, field_value)

    try:
        db.commit()
        db.refresh(project)
        return _project_response_from_model(project)
    except SQLAlchemyError:
        db.rollback()
        raise


def delete_project(
    db: Session,
    project_id: int
) -> bool:
    project = db.get(Project, project_id)
    if not project:
        return False

    try:
        db.delete(project)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        raise
