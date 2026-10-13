"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, Sparkles } from "lucide-react";
import type { Message } from "@/lib/api";

const SUGGESTIONS = [
  "Explain a concept in simple words",
  "Help me debug some code",
  "Plan my study week",
  "Brainstorm project ideas",
];

type Props = {
  messages: Message[];
  loading: boolean;
  error: string | null;
  name: string;
  onSend: (text: string) => void;
};

export default function ChatView({ messages, loading, error, name, onSend }: Props) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submit = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || loading) return;
    setInput("");
    if (areaRef.current) areaRef.current.style.height = "auto";
    onSend(t);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="grad mb-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl shadow-violet-500/30">
                <Sparkles className="text-white" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Hi {name}, <span className="grad-text">what's on your mind?</span>
              </h1>
              <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/70 px-4 py-3 text-left text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[var(--panel-2)] px-4 py-3 text-[15px] leading-relaxed">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-3">
                    <div className="grad mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                      <Sparkles size={15} className="text-white" />
                    </div>
                    <div className="md min-w-0 flex-1 text-[15px]">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                ),
              )}

              {loading && (
                <div className="flex gap-3">
                  <div className="grad mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Sparkles size={15} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-3">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* input */}
      <div className="px-4 pb-5">
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/90 p-2 shadow-xl backdrop-blur focus-within:border-[var(--accent)]">
          <textarea
            ref={areaRef}
            rows={1}
            value={input}
            placeholder="Message Groq Chat…"
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            className="max-h-[200px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none placeholder:text-[var(--muted)]"
          />
          <button
            onClick={() => submit()}
            disabled={!input.trim() || loading}
            aria-label="Send"
            className="grad flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition hover:opacity-90 disabled:opacity-30"
          >
            <ArrowUp size={18} />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--muted)]">
          Enter to send · Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}