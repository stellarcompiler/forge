import hashlib
import hmac
import secrets
from typing import Optional

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from backend.models.user import User


PASSWORD_HASH_ALGORITHM = "pbkdf2_sha256"
PASSWORD_HASH_ITERATIONS = 260000


class UserAlreadyExistsError(ValueError):
    pass


def _hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PASSWORD_HASH_ITERATIONS
    ).hex()
    return (
        f"{PASSWORD_HASH_ALGORITHM}"
        f"${PASSWORD_HASH_ITERATIONS}"
        f"${salt}"
        f"${password_hash}"
    )


def _verify_password(password: str, password_hash: str) -> bool:
    try:
        algorithm, iterations, salt, expected_hash = password_hash.split("$")
    except ValueError:
        return False

    if algorithm != PASSWORD_HASH_ALGORITHM:
        return False

    actual_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        int(iterations)
    ).hex()
    return hmac.compare_digest(actual_hash, expected_hash)


def create_user(
    db: Session,
    name: str,
    email: str,
    password: str
) -> User:
    user = User(
        name=name,
        email=email.lower(),
        password_hash=_hash_password(password)
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError as error:
        db.rollback()
        raise UserAlreadyExistsError("Email already registered") from error
    except SQLAlchemyError:
        db.rollback()
        raise


def authenticate_user(
    db: Session,
    email: str,
    password: str
) -> Optional[User]:
    user = get_user_by_email(db, email)

    if not user:
        return None

    if not _verify_password(password, user.password_hash):
        return None

    return user


def get_user_by_id(
    db: Session,
    user_id: int
) -> Optional[User]:
    return db.get(User, user_id)


def get_user_by_email(
    db: Session,
    email: str
) -> Optional[User]:
    return (
        db.query(User)
        .filter(User.email == email.lower())
        .first()
    )


def list_users(
    db: Session,
    page: int = 1,
    page_size: int = 20
) -> tuple[int, list[User]]:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    offset = (page - 1) * page_size

    query = db.query(User)
    total = query.count()
    users = (
        query
        .order_by(User.created_at.desc(), User.id.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )
    return total, users


def update_user(
    db: Session,
    user_id: int,
    name: Optional[str] = None,
    email: Optional[str] = None,
    password: Optional[str] = None
) -> Optional[User]:
    user = get_user_by_id(db, user_id)

    if not user:
        return None

    if name is not None:
        user.name = name

    if email is not None:
        user.email = email.lower()

    if password is not None:
        user.password_hash = _hash_password(password)

    try:
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError as error:
        db.rollback()
        raise UserAlreadyExistsError("Email already registered") from error
    except SQLAlchemyError:
        db.rollback()
        raise


def delete_user(
    db: Session,
    user_id: int
) -> bool:
    user = get_user_by_id(db, user_id)

    if not user:
        return False

    try:
        db.delete(user)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        raise
