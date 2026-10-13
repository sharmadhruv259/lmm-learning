
# from llm_services import ask_grok

# def main():
#     print("Welcome")
#     print("Type 'exit' to quit.\n")

#     while True:
#         question = input("You: ").strip()

#         if question.lower() == "exit":
#             print("Chatbot: Goodbye!")
#             break

#         if not question:
#             continue

#         try:
#             answer = ask_grok(question)
#             print(f"\nGroq: {answer}\n")
#         except Exception as error:
#             print(f"Something went wrong: {error}")

# if __name__ == "__main__":
#     main()

from llm_services import ask_groq
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel

console = Console()


def main():
    console.print(
        Panel(
            "[bold green]Welcome to the AI Chatbot![/bold green]\n"
            "Type [bold yellow]exit[/bold yellow] to quit.",
            title="Groq Chatbot",
            border_style="blue",
        )
    )

    while True:
        try:
            question = console.input("[bold cyan]You:[/bold cyan] ").strip()

            if question.lower() == "exit":
                console.print("[bold green]Chatbot:[/bold green] Goodbye!")
                break

            if not question:
                continue

            answer = ask_groq(question)

            console.print(
                Panel(
                    Markdown(answer),
                    title="[bold green]Groq[/bold green]",
                    border_style="green",
                    padding=(1, 2),
                )
            )

        except KeyboardInterrupt:
            console.print("\n[yellow]Chatbot stopped. Goodbye![/yellow]")
            break

        except Exception as error:
            console.print(
                f"[bold red]Something went wrong:[/bold red] {error}"
            )


if __name__ == "__main__":
    main()
