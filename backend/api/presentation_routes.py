import logging

from fastapi import APIRouter, HTTPException, status

from backend.services.ai.gemini_service import generate_presentation_prep_summary
from backend.utils.json_parser import parse_ai_response, parsed_response_to_payload


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/presentation",
    tags=["Presentation"]
)


@router.post("/ai-prep-summary")
def generate_ai_prep_summary_endpoint():
    try:
        ai_response = generate_presentation_prep_summary()
        parsed_response = parse_ai_response(ai_response)
        return parsed_response_to_payload(parsed_response)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        ) from error
    except Exception as error:
        logger.exception("Presentation AI generation failed: %s", error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Presentation AI generation failed"
        ) from error
