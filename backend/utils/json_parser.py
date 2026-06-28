"""
json_parser.py
--------------
Utility for parsing and filtering AI API responses.
Supports Gemini (google-generativeai SDK) and Anthropic response formats.
"""

import json
import re
from dataclasses import dataclass, field
from typing import Any, Optional


# ─────────────────────────────────────────────
# Data Classes
# ─────────────────────────────────────────────

@dataclass
class ParsedResponse:
    """Normalized container for any AI response."""
    provider: str                       # "gemini" | "anthropic" | "unknown"
    model: str
    text: str
    finish_reason: str
    input_tokens: int
    output_tokens: int
    total_tokens: int
    raw: dict = field(repr=False)       # original dict, hidden from repr


# ─────────────────────────────────────────────
# Parsers
# ─────────────────────────────────────────────

def parse_gemini(data: dict) -> ParsedResponse:
    """
    Parse a Gemini SDK response dict.

    Handles both raw dicts and the string representation
    that the SDK prints (auto-detected via _from_repr).
    """
    candidates = data.get("candidates", [])
    if not candidates:
        raise ValueError("No candidates found in Gemini response.")

    candidate   = candidates[0]
    parts       = candidate.get("content", {}).get("parts", [])
    text        = " ".join(p.get("text", "") for p in parts if "text" in p).strip()
    finish      = candidate.get("finish_reason", "UNKNOWN")

    usage       = data.get("usage_metadata", {})
    in_tok      = usage.get("prompt_token_count", 0)
    out_tok     = usage.get("candidates_token_count", 0)
    total_tok   = usage.get("total_token_count", in_tok + out_tok)

    model       = data.get("model_version", data.get("model", "unknown"))

    return ParsedResponse(
        provider="gemini",
        model=model,
        text=text,
        finish_reason=str(finish),
        input_tokens=in_tok,
        output_tokens=out_tok,
        total_tokens=total_tok,
        raw=data,
    )


def parse_anthropic(data: dict) -> ParsedResponse:
    """
    Parse an Anthropic /v1/messages response dict.
    """
    content     = data.get("content", [])
    text_blocks = [b.get("text", "") for b in content if b.get("type") == "text"]
    text        = " ".join(text_blocks).strip()

    usage       = data.get("usage", {})
    in_tok      = usage.get("input_tokens", 0)
    out_tok     = usage.get("output_tokens", 0)

    return ParsedResponse(
        provider="anthropic",
        model=data.get("model", "unknown"),
        text=text,
        finish_reason=data.get("stop_reason", "UNKNOWN"),
        input_tokens=in_tok,
        output_tokens=out_tok,
        total_tokens=in_tok + out_tok,
        raw=data,
    )


def auto_parse(data: dict) -> ParsedResponse:
    """
    Auto-detect provider and delegate to the correct parser.
    Raises ValueError if the format is unrecognised.
    """
    if "candidates" in data or "model_version" in data:
        return parse_gemini(data)
    if "content" in data and "stop_reason" in data:
        return parse_anthropic(data)
    raise ValueError(
        "Could not detect provider. Pass the dict to parse_gemini() or "
        "parse_anthropic() explicitly."
    )


def response_to_dict(response: Any) -> dict:
    """
    Convert common SDK response objects into a plain dict for parsing.
    """
    if isinstance(response, dict):
        return response

    if hasattr(response, "model_dump"):
        return response.model_dump(mode="json", exclude_none=True)

    if hasattr(response, "to_json_dict"):
        return response.to_json_dict()

    if hasattr(response, "to_dict"):
        return response.to_dict()

    if isinstance(response, str):
        return json.loads(response)

    raise TypeError("Unsupported AI response type for JSON parsing.")


def parse_ai_response(response: Any) -> ParsedResponse:
    """
    Normalize and parse an AI SDK response object.
    """
    return auto_parse(response_to_dict(response))


def parsed_response_to_payload(parsed: ParsedResponse) -> dict:
    """
    Convert ParsedResponse into the JSON shape returned by API routes.
    """
    return json.loads(to_json(parsed, pretty=False))


# ─────────────────────────────────────────────
# Filters
# ─────────────────────────────────────────────

def filter_sections(text: str, headings: list[str]) -> dict[str, str]:
    """
    Extract named Markdown sections (## Heading) from the response text.

    Args:
        text:     Full response text.
        headings: Section headings to extract, e.g. ["Problem", "Solution"].

    Returns:
        Dict mapping each heading to its section body (empty string if absent).

    Example:
        >>> sections = filter_sections(resp.text, ["Key Talking Points", "Known Gaps"])
    """
    result: dict[str, str] = {}
    for heading in headings:
        pattern = rf"##\s+(?:\d+\.\s+)?{re.escape(heading)}(.*?)(?=\n##|\Z)"
        match   = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        result[heading] = match.group(1).strip() if match else ""
    return result


def filter_by_keyword(text: str, keywords: list[str]) -> list[str]:
    """
    Return lines that contain any of the given keywords (case-insensitive).

    Example:
        >>> lines = filter_by_keyword(resp.text, ["latency", "sensor"])
    """
    hits: list[str] = []
    for line in text.splitlines():
        if any(kw.lower() in line.lower() for kw in keywords):
            hits.append(line.strip())
    return hits


def filter_usage(parsed: ParsedResponse, max_total_tokens: Optional[int] = None) -> dict:
    """
    Return a usage summary, optionally flagging responses over a token budget.

    Example:
        >>> usage = filter_usage(resp, max_total_tokens=1500)
    """
    summary = {
        "model":         parsed.model,
        "input_tokens":  parsed.input_tokens,
        "output_tokens": parsed.output_tokens,
        "total_tokens":  parsed.total_tokens,
        "finish_reason": parsed.finish_reason,
    }
    if max_total_tokens is not None:
        summary["over_budget"] = parsed.total_tokens > max_total_tokens
    return summary


def to_json(parsed: ParsedResponse, pretty: bool = True) -> str:
    """
    Serialise a ParsedResponse to a JSON string (excludes raw field).

    Example:
        >>> print(to_json(resp))
    """
    payload = {
        "provider":      parsed.provider,
        "model":         parsed.model,
        "finish_reason": parsed.finish_reason,
        "tokens": {
            "input":  parsed.input_tokens,
            "output": parsed.output_tokens,
            "total":  parsed.total_tokens,
        },
        "text": parsed.text,
    }
    return json.dumps(payload, indent=2 if pretty else None, ensure_ascii=False)


# ─────────────────────────────────────────────
# Demo — mirrors the Gemini response in the doc
# ─────────────────────────────────────────────

if __name__ == "__main__":
    sample_gemini: dict = {
        "model_version": "gemini-3.1-flash-lite",
        "candidates": [
            {
                "content": {
                    "parts": [
                        {
                            "text": (
                                "## 1. One-Line Elevator Pitch\n"
                                "The Smart Campus Optimizer is a real-time occupancy tracking platform.\n\n"
                                "## 2. Problem → Solution → Impact\n"
                                "**Problem**\n* Manual scheduling fails to account for real-time fluctuations.\n\n"
                                "**Solution**\n* Deploy coordinate-cached sensory endpoints.\n\n"
                                "**Impact**\n* Increased facility utilization rates.\n\n"
                                "## 6. Known Gaps & How to Handle Them\n"
                                "* Scalability: frame as a 'Modular MVP'.\n"
                                "* Mocked Auth: abstracted and ready for SSO integration.\n\n"
                                "## 7. Confidence Anchors\n"
                                "* The Data: validated against manual counts.\n"
                                "* The Architecture: decoupled design.\n"
                            )
                        }
                    ],
                    "role": "model",
                },
                "finish_reason": "STOP",
                "index": 0,
            }
        ],
        "usage_metadata": {
            "prompt_token_count": 450,
            "candidates_token_count": 898,
            "total_token_count": 1348,
        },
        "response_id": "U0tBatmzK5awjuMPlICn6AE",
    }

    # ── 1. Parse ─────────────────────────────
    resp = auto_parse(sample_gemini)
    print("=" * 60)
    print(f"Provider : {resp.provider}")
    print(f"Model    : {resp.model}")
    print(f"Tokens   : {resp.total_tokens} total "
          f"({resp.input_tokens} in / {resp.output_tokens} out)")
    print(f"Finish   : {resp.finish_reason}")

    # ── 2. Section filter ────────────────────
    print("\n── Section Filter ──────────────────────")
    sections = filter_sections(resp.text, ["Known Gaps & How to Handle Them", "Confidence Anchors"])
    for heading, body in sections.items():
        print(f"\n[{heading}]\n{body}")

    # ── 3. Keyword filter ────────────────────
    print("\n── Keyword Filter ──────────────────────")
    hits = filter_by_keyword(resp.text, ["latency", "sensor", "auth"])
    for line in hits:
        print(f"  • {line}")

    # ── 4. Usage check ───────────────────────
    print("\n── Usage ───────────────────────────────")
    usage = filter_usage(resp, max_total_tokens=1500)
    print(json.dumps(usage, indent=2))

    # ── 5. Full JSON export ──────────────────
    print("\n── JSON Export ─────────────────────────")
    print(to_json(resp))
