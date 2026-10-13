import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq

from .prompts import SYSTEM_PROMPT

# .env lives in lmm-learning/ (two levels above this file's folder)
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = Groq(api_key=os.environ["GROQ_API_KEY"])
    return _client


def build_system_prompt(profile):
    prompt = SYSTEM_PROMPT
    prompt += f"\n\nThe user's name is {profile.name}."
    prompt += f"\nPreferred response style: {profile.tone}."
    if profile.custom_instructions.strip():
        prompt += f"\nUser's custom instructions: {profile.custom_instructions.strip()}"
    return prompt


def generate_reply(history, profile):
    """history: list of {"role": ..., "content": ...} in order."""
    messages = [{"role": "system", "content": build_system_prompt(profile)}] + history
    response = _get_client().chat.completions.create(
        model=os.environ["GROQ_MODEL"],
        messages=messages,
        temperature=0.2,
        max_tokens=1000,
    )
    return response.choices[0].message.contents