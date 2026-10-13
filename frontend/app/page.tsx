"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type Conversation, type Message, type Profile } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ChatView from "@/components/ChatView";
import SettingsModal from "@/components/SettingsModal";

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [panel, setPanel] = useState<"personalization" | "profile" | null>(null);

  const refreshList = useCallback(async () => {
    try {
      setConversations(await api.conversations());
    } catch {
      setError("Can't reach the backend. Is Django running on port 8000?");
    }
  }, []);

  useEffect(() => {
    refreshList();
    api.profile().then(setProfile).catch(() => {});
  }, [refreshList]);

  useEffect(() => {
    if (profile) document.documentElement.dataset.theme = profile.theme;
  }, [profile]);

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
    setError(null);
  };

  const select = async (id: number) => {
    setError(null);
    setActiveId(id);
    try {
      const c = await api.conversation(id);
      setMessages(c.messages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load that chat");
    }
  };

  const remove = async (id: number) => {
    try {
      await api.deleteConversation(id);
      if (id === activeId) newChat();
      refreshList();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't delete that chat");
    }
  };

  const send = async (text: string) => {
    setError(null);
    setMessages((m) => [...m, { id: `tmp-${Date.now()}`, role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await api.chat(text, activeId ?? undefined);
      setActiveId(res.conversation.id);
      setMessages((m) => [...m, res.message]);
      refreshList();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (p: Partial<Profile>) => {
    try {
      setProfile(await api.saveProfile(p));
      setPanel(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save settings");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        conversations={conversations}
        activeId={activeId}
        onNew={newChat}
        onSelect={select}
        onDelete={remove}
        profile={profile}
        onOpen={setPanel}
      />
      <main className="min-w-0 flex-1">
        <ChatView
          messages={messages}
          loading={loading}
          error={error}
          name={profile?.name || "there"}
          onSend={send}
        />
      </main>
      {panel && profile && (
        <SettingsModal
          key={panel}
          mode={panel}
          profile={profile}
          onClose={() => setPanel(null)}
          onSave={saveProfile}
        />
      )}
    </div>
  );
}