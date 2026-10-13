const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type Message = { id: number | string; role: "user" | "assistant"; content: string };
export type Conversation = { id: number; title: string; updated_at: string };
export type Profile = {
  name: string;
  tone: string;
  custom_instructions: string;
  theme: "dark" | "light";
};

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  conversations: () => req<Conversation[]>("/conversations/"),
  conversation: (id: number) =>
    req<Conversation & { messages: Message[] }>(`/conversations/${id}/`),
  deleteConversation: (id: number) =>
    req<void>(`/conversations/${id}/`, { method: "DELETE" }),
  chat: (message: string, conversation_id?: number) =>
    req<{ conversation: Conversation; message: Message }>("/chat/", {
      method: "POST",
      body: JSON.stringify({ message, conversation_id }),
    }),
  profile: () => req<Profile>("/profile/"),
  saveProfile: (p: Partial<Profile>) =>
    req<Profile>("/profile/", { method: "PUT", body: JSON.stringify(p) }),
};