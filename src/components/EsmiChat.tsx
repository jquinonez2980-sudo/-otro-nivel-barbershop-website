"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

// ── Types ─────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  slots?: string[];
  dateLabel?: string;
  streaming?: boolean;
  toolActive?: string | null;
};

type ChatEvent =
  | { type: "token"; content: string }
  | { type: "tool_start"; tool: string }
  | { type: "tool_end" }
  | { type: "done"; full_text: string; slots?: string[]; date_label?: string }
  | { type: "error"; message: string };

type Locale = "en" | "es";

// ── Copy ──────────────────────────────────────────────────────────────────────

const WELCOME: Record<Locale, string> = {
  en: `Hi! I'm Esmi, the receptionist at ${site.shortName}. I can book your cut, check open times at Weston or Keele, and answer anything about prices or services. How can I help?`,
  es: `¡Hola! Soy Esmi, la recepcionista de ${site.shortName}. Puedo agendar tu corte, revisar horarios en Weston o Keele y responder preguntas sobre precios y servicios. ¿En qué te ayudo?`,
};

const RESET_MSG: Record<Locale, string> = {
  en: "Fresh start! What can I do for you?",
  es: "¡Empecemos de nuevo! ¿En qué te puedo ayudar?",
};

const QUICK_REPLIES: Record<Locale, { label: string; value: string }[]> = {
  en: [
    { label: "Book a cut", value: "I'd like to book a haircut" },
    { label: "What's open this week?", value: "What times are available this week?" },
    { label: "Prices", value: "How much is a haircut at each location?" },
    { label: "Hours & locations", value: "What are your hours and where are you located?" },
  ],
  es: [
    { label: "Reservar un corte", value: "Quiero reservar un corte de pelo" },
    { label: "Horarios disponibles", value: "¿Qué horarios tienen disponibles esta semana?" },
    { label: "Precios", value: "¿Cuánto cuesta un corte en cada local?" },
    { label: "Horas y ubicaciones", value: "¿Cuál es su horario y dónde están ubicados?" },
  ],
};

const TOOL_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    list_available_slots: "Checking the calendar…",
    book_appointment: "Booking your appointment…",
    search_knowledge_base: "Looking that up…",
  },
  es: {
    list_available_slots: "Consultando el calendario…",
    book_appointment: "Agendando tu cita…",
    search_knowledge_base: "Buscando información…",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function getOrCreateThreadId(): string {
  const key = "esmi-thread-id:otro-nivel";
  try {
    const stored = localStorage.getItem(key);
    if (stored) return stored;
    const id = uid();
    localStorage.setItem(key, id);
    return id;
  } catch {
    return uid();
  }
}

/** Esmi lists slots in prose too; the chips replace those lines. */
function stripSlotLines(text: string): string {
  return text
    .replace(/\n\s*[-•]\s*\d{1,2}:\d{2}\s*(?:AM|PM)\s*[–-]\s*\d{1,2}:\d{2}\s*(?:AM|PM)/g, "")
    .replace(/\n\s*\d{1,2}:\d{2}\s*(?:AM|PM)\s*[–-]\s*\d{1,2}:\d{2}\s*(?:AM|PM)/g, "")
    .replace(/Which of these works best for you\?\s*/g, "")
    .trim();
}

// ── Widget ────────────────────────────────────────────────────────────────────

export default function EsmiChat() {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: uid(), role: "assistant", content: WELCOME.en },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const id = getOrCreateThreadId();
    setThreadId(id);
    try {
      const saved = localStorage.getItem(`esmi-messages-${id}`);
      if (saved) {
        const parsed: Message[] = JSON.parse(saved);
        if (parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* ok */
    }
  }, []);

  useEffect(() => {
    if (!threadId || messages.some((m) => m.streaming)) return;
    try {
      const toSave = messages.slice(-30).map((m) => ({ ...m, toolActive: null }));
      localStorage.setItem(`esmi-messages-${threadId}`, JSON.stringify(toSave));
    } catch {
      /* ok */
    }
  }, [messages, threadId]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      setLocale(next);
      if (messages.length === 1 && messages[0].role === "assistant") {
        setMessages([{ id: uid(), role: "assistant", content: WELCOME[next] }]);
      }
    },
    [locale, messages],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading || !threadId) return;

      const userMsg: Message = { id: uid(), role: "user", content: text.trim() };
      const assistantId = uid();
      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, role: "assistant", content: "", streaming: true, toolActive: null },
      ]);
      setInput("");
      setLoading(true);
      if (inputRef.current) inputRef.current.style.height = "auto";

      const patch = (updates: Partial<Message>) =>
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, ...updates } : m)),
        );

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim(), thread_id: threadId }),
        });
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            let evt: ChatEvent;
            try {
              evt = JSON.parse(line.slice(6)) as ChatEvent;
            } catch {
              continue;
            }
            if (evt.type === "token") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + evt.content, toolActive: null }
                    : m,
                ),
              );
            } else if (evt.type === "tool_start") {
              patch({ toolActive: evt.tool });
            } else if (evt.type === "tool_end") {
              patch({ toolActive: null });
            } else if (evt.type === "done") {
              patch({
                content: evt.full_text,
                slots: evt.slots,
                dateLabel: evt.date_label,
                streaming: false,
                toolActive: null,
              });
            } else if (evt.type === "error") {
              patch({ content: evt.message, streaming: false, toolActive: null });
            }
          }
        }
      } catch {
        patch({
          content:
            locale === "es"
              ? `Error de conexión — llámanos al ${site.phone}.`
              : `Connection error — give us a call at ${site.phone}.`,
          streaming: false,
          toolActive: null,
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, threadId, locale],
  );

  const resetConversation = useCallback(() => {
    try {
      localStorage.removeItem(`esmi-messages-${threadId}`);
    } catch {
      /* ok */
    }
    const newThread = uid();
    try {
      localStorage.setItem("esmi-thread-id:otro-nivel", newThread);
    } catch {
      /* ok */
    }
    setThreadId(newThread);
    setMessages([{ id: uid(), role: "assistant", content: RESET_MSG[locale] }]);
    setInput("");
    setLoading(false);
  }, [threadId, locale]);

  const lastMsg = messages[messages.length - 1];
  const showQuickReplies =
    !loading && messages.length === 1 && lastMsg.role === "assistant";

  return (
    <>
      {/* Launcher — Esmi logo FAB (matches Coastline pattern); sits above mobile action bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={
          open ? "Close chat with Esmi" : "Chat with Esmi — English o español"
        }
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/25 bg-[linear-gradient(145deg,#06122A_0%,#0A2540_55%,#0D3A4A_100%)] p-2.5 text-white shadow-[0_8px_28px_rgba(10,37,64,0.45),0_0_20px_rgba(0,240,255,0.18)] transition-transform hover:scale-105 md:bottom-6 md:right-6"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/esmi-logo.png"
            alt=""
            width={40}
            height={20}
            className="h-auto w-full object-contain"
            draggable={false}
          />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Esmi"
          className="fixed bottom-36 right-4 z-50 flex h-[min(34rem,calc(100dvh-11rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-edge bg-ink shadow-[0_12px_48px_rgba(0,0,0,0.65)] md:bottom-24 md:right-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-edge bg-[linear-gradient(135deg,#06122A_0%,#0A2540_60%,#0D3A4A_100%)] px-4 py-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-[#06122A] p-1.5 shadow-[0_0_14px_rgba(0,240,255,0.22)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/esmi-logo.png"
                alt=""
                width={72}
                height={35}
                className="h-auto w-full object-contain"
                draggable={false}
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#06122A] bg-green-500"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-baseline gap-1.5 text-sm font-semibold text-[#EAF2FF]">
                Esmi
                <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#EAF2FF]/55">
                  {locale === "es" ? "Recepcionista IA" : "AI Receptionist"}
                </span>
              </p>
              <p className="flex items-center gap-1.5 truncate text-[11px] text-[#EAF2FF]/75">
                <span
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-500"
                  aria-hidden="true"
                />
                {locale === "es"
                  ? `En línea · ${site.shortName}`
                  : `Online · ${site.shortName}`}
              </p>
            </div>
            <div
              className="flex overflow-hidden rounded border border-white/15 text-[11px] font-bold"
              role="group"
              aria-label="Chat language"
            >
              {(["en", "es"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => switchLocale(l)}
                  aria-pressed={locale === l}
                  className={
                    locale === l
                      ? "bg-gold px-2.5 py-1 uppercase text-ink"
                      : "px-2.5 py-1 uppercase text-[#EAF2FF]/70 hover:text-[#EAF2FF]"
                  }
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={resetConversation}
              aria-label={locale === "es" ? "Reiniciar conversación" : "Restart conversation"}
              className="text-[#EAF2FF]/70 transition-colors hover:text-[#EAF2FF]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-lg rounded-br-sm bg-red px-3.5 py-2.5 text-sm text-white">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex flex-col items-start gap-2">
                  <div className="max-w-[85%] whitespace-pre-wrap rounded-lg rounded-bl-sm border border-edge bg-surface px-3.5 py-2.5 text-sm text-cream">
                    {msg.streaming && !msg.content && !msg.toolActive ? (
                      <span className="inline-flex gap-1" aria-label="Esmi is typing">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:240ms]" />
                      </span>
                    ) : msg.streaming ? (
                      stripSlotLines(msg.content)
                    ) : (
                      msg.content
                    )}
                    {msg.toolActive && (
                      <span className="mt-1.5 flex items-center gap-1.5 text-xs italic text-gold">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                        {TOOL_LABELS[locale][msg.toolActive] ?? "Working…"}
                      </span>
                    )}
                  </div>
                  {msg.slots && msg.slots.length > 0 && !msg.streaming && (
                    <div className="w-full">
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-bright">
                        {msg.dateLabel ??
                          (locale === "es" ? "Horarios disponibles" : "Available times")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.slots.map((slot, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => sendMessage(slot)}
                            className="rounded border border-gold/50 bg-surface px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold hover:text-ink"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}

            {showQuickReplies && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_REPLIES[locale].map((qr) => (
                  <button
                    key={qr.label}
                    type="button"
                    onClick={() => sendMessage(qr.value)}
                    className="rounded-full border border-edge bg-surface px-3 py-1.5 text-xs font-semibold text-cream transition-colors hover:border-gold hover:text-gold"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-end gap-2 border-t border-edge bg-surface px-3 py-3"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={
                locale === "es" ? "Escribe un mensaje…" : "Type a message…"
              }
              aria-label={locale === "es" ? "Mensaje para Esmi" : "Message for Esmi"}
              className="max-h-24 flex-1 resize-none rounded border border-edge bg-ink px-3 py-2 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label={locale === "es" ? "Enviar" : "Send"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-red text-white transition-colors hover:bg-red-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
