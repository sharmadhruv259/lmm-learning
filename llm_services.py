import os
from dotenv import load_dotenv
from groq import Groq
from prompts import SYSTEM_PROMPT

load_dotenv()

client = Groq(
    api_key=os.environ["GROQ_API_KEY"]
)

chat_history = [
    {"role": "system", "content": SYSTEM_PROMPT}
]


def ask_groq(question):
    # Add the new question to history
    chat_history.append({
        "role": "user",
        "content": question
    })

    response = client.chat.completions.create(
        model=os.environ["GROQ_MODEL"],
        messages=chat_history,
        temperature=0.2,
        max_tokens=1000
    )

    # Extract the AI response
    answer = response.choices[0].message.content

    # Save the AI response to history
    chat_history.append({
        "role": "assistant",
        "content": answer
    })

    return answer
