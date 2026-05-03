"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { processChatQuery } from "@/actions/chat";

const SUGGESTIONS = [
  "Total spend in March?",
  "Average spend this month?",
  "Show my recent transactions",
  "Spending breakdown by category",
  "Highest spend this year?",
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  data?: any;
}

export function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default on mobile
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! 👋 I'm your AI finance assistant. Ask me about your spending.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await processChatQuery(text.trim());
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res?.answer ?? "I couldn't interpret that.",
        data: res?.data,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "⚠️ Error processing query.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-950 flex flex-col 
      shrink-0 transition-all duration-300 ease-in-out
      ${isOpen ? "h-[500px] lg:h-full" : "h-14 lg:h-full"}
    `}>
      <div
        className="p-3.5 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 cursor-pointer lg:cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Sparkles size={16} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">AI Finance Assistant</h2>
            <p className="text-[10px] text-gray-400">Ask about your spending</p>
          </div>
        </div>
        <button className="lg:hidden p-1 hover:bg-gray-800 rounded-md transition-colors text-gray-400">
          {isOpen ? "Close" : "Open"}
        </button>
      </div>

      <div className={`flex-1 flex flex-col overflow-hidden ${!isOpen ? "hidden lg:flex" : "flex"}`}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-gray-800"}`}>
                {msg.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-gray-300" />}
              </div>
              <div className={`max-w-[82%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none"}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.data && msg.role === "assistant" && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-2">
                    {Object.entries(msg.data).filter(([, v]) => typeof v !== "object").slice(0, 4).map(([k, v]) => (
                      <span key={k} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full border border-blue-500/20">
                        {k}: {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center"><Bot size={14} className="text-gray-300" /></div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => sendMessage(s)} className="text-[10px] border border-gray-800 rounded-lg px-2.5 py-1 text-gray-400 hover:text-white hover:border-gray-600 transition-colors bg-gray-900/50">
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
            <button type="submit" disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-colors">
              {loading ? <Loader2 size={18} className="text-white animate-spin" /> : <Send size={18} className="text-white" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
