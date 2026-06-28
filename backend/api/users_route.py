import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.database.connection import get_db
from backend.services.users_service import (
    UserAlreadyExistsError,
    authenticate_user,
    create_user,
    delete_user,
    get_user_by_id,
    list_users,
    update_user,
)


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=1, max_length=128)


class UserUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=150)
    email: Optional[str] = Field(default=None, min_length=3, max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    users: list[UserResponse]


class AuthResponse(BaseModel):
    message: str
    user: UserResponse


class UserMessage(BaseModel):
    message: str


def _raise_database_error(error: SQLAlchemyError):
    logger.exception("User database operation failed: %s", error)
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Database operation failed"
    ) from error


def _create_user_response(
    user_data: UserCreate,
    success_message: str,
    db: Session
) -> AuthResponse:
    try:
        user = create_user(
            db=db,
            name=user_data.name,
            email=user_data.email,
            password=user_data.password
        )
    except UserAlreadyExistsError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        ) from error
    except SQLAlchemyError as error:
        _raise_database_error(error)

    return AuthResponse(message=success_message, user=user)


@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED
)
def signup_user_endpoint(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    return _create_user_response(user_data, "Signup successful", db)


@router.post(
    "",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED
)
def create_user_endpoint(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    return _create_user_response(user_data, "User created successfully", db)


@router.post(
    "/login",
    response_model=AuthResponse
)
def login_user_endpoint(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    try:
        user = authenticate_user(
            db=db,
            email=login_data.email,
            password=login_data.password
        )
    except SQLAlchemyError as error:
        _raise_database_error(error)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return AuthResponse(message="Login successful", user=user)


@router.get(
    "",
    response_model=UserListResponse
)
def list_users_endpoint(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    try:
        total, users = list_users(db, page, page_size)
    except SQLAlchemyError as error:
        _raise_database_error(error)

    return UserListResponse(
        total=total,
        page=page,
        page_size=page_size,
        users=users
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse
)
def get_user_endpoint(
    user_id: int,
    db: Session = Depends(get_db)
):
    try:
        user = get_user_by_id(db, user_id)
    except SQLAlchemyError as error:
        _raise_database_error(error)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user


@router.patch(
    "/{user_id}",
    response_model=UserResponse
)
def update_user_endpoint(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    update_data = user_data.model_dump(exclude_unset=True)

    try:
        user = update_user(
            db=db,
            user_id=user_id,
            name=update_data.get("name"),
            email=update_data.get("email"),
            password=update_data.get("password")
        )
    except UserAlreadyExistsError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        ) from error
    except SQLAlchemyError as error:
        _raise_database_error(error)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user


@router.delete(
    "/{user_id}",
    response_model=UserMessage
)
def delete_user_endpoint(
    user_id: int,
    db: Session = Depends(get_db)
):
    try:
        deleted = delete_user(db, user_id)
    except SQLAlchemyError as error:
        _raise_database_error(error)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserMessage(message="User deleted successfully")
