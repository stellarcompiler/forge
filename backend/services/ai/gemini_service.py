import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv(Path(__file__).resolve().parents[2] / ".env")

MODEL = "gemini-3.1-flash-lite"

PROJECT_CONTEXT = """
title: "Smart Campus Optimizer"
idea: "Real-time tracking of classroom and laboratory occupancy metrics
       using coordinate-cached sensory endpoints to prevent over-allocation."
"""

PRESENTATION_TITLE = "Smart Campus Optimizer"
AUDIENCE = "technical panel / professors"
DURATION_MINUTES = "10"
PRESENTATION_STYLE = "slide-deck / live walkthrough"
FOCUS_AREAS = "problem statement, results"
KNOWN_WEAK_SPOTS = "scalability not fully implemented, auth is mocked"

SYSTEM_INSTRUCTION = """
You are an expert presentation coach and technical writer.
Your job is to produce a structured PREP SUMMARY that the presenter
reads before walking into a project presentation, not slides or scripts,
but a sharp, scannable reference document.

Output format:

## 1. One-Line Elevator Pitch
A single sentence capturing what the project is and why it matters.

## 2. Problem -> Solution -> Impact
The core narrative arc the presenter must internalize.

## 3. Key Talking Points by Section
Mapped to the likely flow of the presentation.

## 4. Technical Highlights to Emphasize
The 3-5 decisions or components worth spotlighting for this audience.

## 5. Anticipated Questions & Suggested Answers
5-7 Q&A pairs the audience is most likely to ask.

## 6. Known Gaps & How to Handle Them
Honest framing of weak spots.

## 7. Confidence Anchors
2-3 things the presenter can fall back on when caught off-guard.

## 8. 60-Second Closing Statement
A memorizable wrap-up the presenter can deliver verbatim if needed.

Rules:
- Be direct. No fluff, no padding.
- Calibrate technical depth to the stated audience.
- Flag anything in the project context that is presentation-risky.
- Total length: readable in under 5 minutes.
""".strip()


def _build_user_prompt() -> str:
    return f"""
Presentation details:
- Title: {PRESENTATION_TITLE}
- Audience: {AUDIENCE}
- Duration: {DURATION_MINUTES} minutes
- Style: {PRESENTATION_STYLE}
- Focus areas requested: {FOCUS_AREAS}
- Known weak spots: {KNOWN_WEAK_SPOTS}

Project context:
\"\"\"
{PROJECT_CONTEXT}
\"\"\"

Generate the full prep summary now.
""".strip()


def generate_presentation_prep_summary():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured.")

    client = genai.Client(api_key=api_key)
    return client.models.generate_content(
        model=MODEL,
        contents=_build_user_prompt(),
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            temperature=0.4,
            max_output_tokens=25000,
        ),
    )
