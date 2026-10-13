"use client";

import {
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { Conversation, Profile } from "@/lib/api";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeId: number | null;
  onNew: () => void;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  profile: Profile | null;
  onOpen: (mode: "personalization" | "profile") => void;
};

export default function Sidebar({
  collapsed,
  onToggle,
  conversations,
  activeId,
  onNew,
  onSelect,
  onDelete,
  profile,
  onOpen,
}: Props) {
  const initial = (profile?.name || "Y").charAt(0).toUpperCase();
  const item =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition hover:bg-[var(--panel-2)] hover:text-[var(--text)]";

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-[var(--border)] bg-[var(--panel)]/80 backdrop-blur-xl transition-[width] duration-300 ${
        collapsed ? "w-[68px]" : "w-72"
      }`}
    >
      {/* header */}
      <div className={`flex items-center p-3 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 px-1">
            <div className="grad flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-semibold tracking-tight">Groq Chat</span>
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--panel-2)] hover:text-[var(--text)]"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* new chat */}
      <div className="px-3">
        <button
          onClick={onNew}
          className={`grad flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90 ${
            collapsed ? "px-0" : "px-3"
          }`}
        >
          <Plus size={18} />
          {!collapsed && "New chat"}
        </button>
      </div>

      {/* history */}
      <div className="mt-5 flex-1 overflow-y-auto px-2">
        {!collapsed && (
          <>
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
              History
            </p>
            {conversations.length === 0 && (
              <p className="px-3 text-sm text-[var(--muted)]">No chats yet.</p>
            )}
            <div className="space-y-1">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    c.id === activeId
                      ? "bg-[var(--panel-2)] text-[var(--text)]"
                      : "text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--text)]"
                  }`}
                >
                  <MessageSquare size={15} className="shrink-0" />
                  <span className="flex-1 truncate">{c.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(c.id);
                    }}
                    aria-label="Delete chat"
                    className="opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* bottom: personalization + profile */}
      <div className="space-y-1 border-t border-[var(--border)] p-2">
        <button onClick={() => onOpen("personalization")} className={`${item} ${collapsed ? "justify-center" : ""}`}>
          <SlidersHorizontal size={18} />
          {!collapsed && "Personalization"}
        </button>
        <button onClick={() => onOpen("profile")} className={`${item} ${collapsed ? "justify-center" : ""}`}>
          <span className="grad flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
            {initial}
          </span>
          {!collapsed && <span className="truncate">{profile?.name || "Profile"}</span>}
        </button>
      </div>
    </aside>
  );
}