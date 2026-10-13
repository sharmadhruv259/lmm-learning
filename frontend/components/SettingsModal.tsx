"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Profile } from "@/lib/api";

const TONES = [
  ["balanced", "Balanced"],
  ["concise", "Concise"],
  ["friendly", "Friendly"],
  ["detailed", "Detailed"],
] as const;

type Props = {
  mode: "personalization" | "profile";
  profile: Profile;
  onClose: () => void;
  onSave: (p: Partial<Profile>) => void;
};

export default function SettingsModal({ mode, profile, onClose, onSave }: Props) {
  const [form, setForm] = useState<Profile>(profile);
  const field =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]";
  const label = "mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--muted)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {mode === "profile" ? "Profile" : "Personalization"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)] hover:text-[var(--text)]">
            <X size={18} />
          </button>
        </div>

        {mode === "profile" ? (
          <div>
            <label className={label}>Your name</label>
            <input
              className={field}
              value={form.name}
              maxLength={80}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        ) : (
          <div className="space-y-5">
            {/* <div>
              <label className={label}>Response style</label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(([value, text]) => (
                  <button
                    key={value}
                    onClick={() => setForm({ ...form, tone: value })}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      form.tone === value
                        ? "border-[var(--accent)] bg-[var(--accent)]/15"
                        : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div> */}

            {/* <div>
              <label className={label}>Custom instructions</label>
              <textarea
                rows={4}
                className={`${field} resize-none`}
                placeholder="e.g. Explain things with examples. Keep answers short."
                value={form.custom_instructions}
                onChange={(e) => setForm({ ...form, custom_instructions: e.target.value })}
              />
            </div> */}

            <div>
              <label className={label}>Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {(["dark", "light"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, theme: t })}
                    className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${
                      form.theme === t
                        ? "border-[var(--accent)] bg-[var(--accent)]/15"
                        : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => onSave(form)}
          className="grad mt-6 w-full rounded-xl py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  );
}