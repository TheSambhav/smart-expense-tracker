"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, Plus, History, ChevronDown, Trash2 } from "lucide-react";
import { processChatQuery } from "@/actions/chat";
import ReactMarkdown from "react-markdown";

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

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

const DEFAULT_WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi! 👋 I'm your AI finance assistant. Ask me about your spending.",
};

export function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("finance_chat_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveId(parsed[0].id);
          return;
        }
      } catch (e) { console.error("Failed to parse sessions", e); }
    }
    // Create first session if none exists
    createNewSession();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("finance_chat_sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeId, isOpen]);

  const activeSession = sessions.find(s => s.id === activeId) || sessions[0];
  const messages = activeSession?.messages || [];

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [DEFAULT_WELCOME],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveId(newSession.id);
    setShowHistory(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    if (updated.length === 0) {
      createNewSession();
    } else {
      setSessions(updated);
      if (activeId === id) setActiveId(updated[0].id);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || !activeId) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    // Update session title on first user message
    setSessions(prev => prev.map(s => {
      if (s.id === activeId) {
        const isFirst = s.messages.length <= 1;
        return {
          ...s,
          title: isFirst ? text.slice(0, 30) + (text.length > 30 ? "..." : "") : s.title,
          messages: [...s.messages, userMsg]
        };
      }
      return s;
    }));

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
      
      setSessions(prev => prev.map(s => 
        s.id === activeId ? { ...s, messages: [...s.messages, assistantMsg] } : s
      ));
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "⚠️ Error processing query.",
      };
      setSessions(prev => prev.map(s => 
        s.id === activeId ? { ...s, messages: [...s.messages, errorMsg] } : s
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-950 flex flex-col 
      shrink-0 transition-all duration-300 ease-in-out relative
      ${isOpen ? "h-[500px] lg:h-full" : "h-14 lg:h-full"}
    `}>
      <div className="p-3.5 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Sparkles size={16} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">AI Assistant</h2>
            <p className="text-[10px] text-gray-400 truncate max-w-[150px]">
              {activeSession?.title || "Ask about spending"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors flex items-center gap-1.5"
            >
              <History size={16} />
              <ChevronDown size={14} className={`transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`} />
            </button>

            {showHistory && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-2 border-b border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 ml-2">Recent Chats</span>
                  <button onClick={createNewSession} className="p-1.5 hover:bg-blue-600/20 text-blue-400 rounded-md transition-colors flex items-center gap-1 text-[10px] font-bold">
                    <Plus size={12} /> NEW
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {sessions.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => { setActiveId(s.id); setShowHistory(false); }}
                      className={`group p-3 flex items-center justify-between cursor-pointer transition-colors ${s.id === activeId ? 'bg-blue-600/10' : 'hover:bg-gray-800'}`}
                    >
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className={`text-xs truncate ${s.id === activeId ? 'text-blue-400 font-medium' : 'text-gray-300'}`}>
                          {s.title}
                        </span>
                        <span className="text-[9px] text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button onClick={(e) => deleteSession(s.id, e)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-400 text-gray-500 transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 hover:bg-gray-800 rounded-md transition-colors text-gray-400">
            {isOpen ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className={`flex-1 flex flex-col overflow-hidden ${!isOpen ? "hidden lg:flex" : "flex"}`}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-gray-800"}`}>
                {msg.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-gray-300" />}
              </div>
              <div className={`max-w-[82%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none"}`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
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
