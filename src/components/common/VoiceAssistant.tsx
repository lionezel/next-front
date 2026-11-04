"use client";

import React, { useEffect, useRef, useState } from "react";
import { useVoiceAssistant, type VoiceState } from "@/src/hooks/useVoiceAssistant";
import {
  Mic,
  MicOff,
  X,
  Trash2,
  Volume2,
  Loader2,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div
      className="flex items-center justify-center gap-[3px]"
      aria-hidden="true"
    >
      {[1, 1.6, 0.8, 1.4, 0.9, 1.5, 1].map((h, i) => (
        <span
          key={i}
          className="block w-[3px] rounded-full bg-white"
          style={{
            height: active ? `${h * 14}px` : "4px",
            animation: active
              ? `voiceBar ${0.5 + i * 0.08}s ease-in-out infinite alternate`
              : "none",
            transition: "height 0.2s ease",
            opacity: active ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

function StateLabel({ state }: { state: VoiceState }) {
  const labels: Record<VoiceState, string> = {
    idle: "Habla con Nova",
    recording: "Escuchando…",
    transcribing: "Transcribiendo…",
    thinking: "Pensando…",
    speaking: "Nova está hablando",
    error: "Error",
  };
  return (
    <span className="text-[11px] font-semibold tracking-wide text-white/90 select-none">
      {labels[state]}
    </span>
  );
}

function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-2 mt-1 shrink-0 shadow-sm">
          <Volume2 className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
          isUser
            ? "bg-emerald-600 text-white rounded-tr-sm"
            : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-2 mt-1 shrink-0">
        <Volume2 className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-2 h-2 rounded-full bg-emerald-400"
              style={{ animation: `typingDot 1s ease-in-out infinite`, animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    state,
    messages,
    error,
    startRecording,
    stopRecording,
    clearConversation,
    dismissError,
    isRecording,
    isProcessing,
    isSpeaking,
  } = useVoiceAssistant();

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, state]);

  // Show tooltip hint after 3 seconds on first render
  useEffect(() => {
    if (messages.length === 0) {
      tooltipTimer.current = setTimeout(() => setShowTooltip(true), 3000);
    }
    return () => {
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };
  }, [messages.length]);

  const handleMicClick = () => {
    setShowTooltip(false);
    if (isRecording) {
      stopRecording();
    } else if (state === "idle" || state === "error") {
      startRecording();
    }
  };

  const handleToggle = () => {
    setIsOpen((v) => !v);
    setShowTooltip(false);
  };

  // Button colors by state
  const fabGradient =
    isRecording
      ? "from-red-500 to-rose-600 shadow-red-500/40"
      : isProcessing
      ? "from-amber-500 to-orange-500 shadow-amber-500/40"
      : isSpeaking
      ? "from-sky-500 to-blue-600 shadow-sky-500/40"
      : "from-emerald-500 via-teal-500 to-emerald-600 shadow-emerald-500/40";

  return (
    <>
      {/* ── Keyframe injection ── */}
      <style>{`
        @keyframes voiceBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1);   }
        }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
        @keyframes ripple {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* ── Floating Panel ── */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        role="region"
        aria-label="Asistente de voz Nova"
      >
        {/* Chat panel */}
        {isOpen && (
          <div
            className="w-[340px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden"
            style={{ animation: "fadeInUp 0.25s ease" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Volume2 className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">Nova</p>
                  <p className="text-[11px] text-white/75 leading-tight">Asesora de Créditos IA</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {messages.length > 0 && (
                  <button
                    onClick={clearConversation}
                    title="Limpiar conversación"
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    aria-label="Limpiar conversación"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
                <button
                  onClick={handleToggle}
                  title="Cerrar"
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  aria-label="Cerrar asistente"
                >
                  <ChevronDown className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="h-[320px] overflow-y-auto p-4 bg-slate-50/60">
              {messages.length === 0 && state === "idle" && (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">¡Hola! Soy Nova 👋</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-[220px] leading-relaxed">
                      Soy tu asesora de créditos. Presiona el micrófono y pregúntame lo que necesites.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                    {[
                      "¿Cuánto puedo pedir?",
                      "¿Qué tasas manejan?",
                      "¿Cuáles son los requisitos?",
                    ].map((hint) => (
                      <span
                        key={hint}
                        className="text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full font-medium"
                      >
                        {hint}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <MessageBubble key={i} role={msg.role} content={msg.content} />
              ))}

              {/* Typing / processing indicator */}
              {(isProcessing || isSpeaking) && <TypingIndicator />}

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl p-3 mb-2">
                  <p className="text-xs text-red-700 flex-1">{error}</p>
                  <button
                    onClick={dismissError}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Cerrar error"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Controls bar */}
            <div className="px-4 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
              <StateLabel state={error ? "error" : state} />

              {/* Mic button */}
              <button
                id="nova-mic-button"
                onClick={handleMicClick}
                disabled={isProcessing || isSpeaking}
                aria-label={isRecording ? "Detener grabación" : "Iniciar grabación"}
                className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${fabGradient} shadow-lg flex items-center justify-center transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
              >
                {/* Ripple when recording */}
                {isRecording && (
                  <>
                    <span
                      className="absolute inset-0 rounded-full bg-red-400"
                      style={{ animation: "ripple 1.2s ease-out infinite" }}
                    />
                    <span
                      className="absolute inset-0 rounded-full bg-red-400"
                      style={{ animation: "ripple 1.2s ease-out infinite 0.6s" }}
                    />
                  </>
                )}

                {isProcessing ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : isRecording ? (
                  <WaveformBars active />
                ) : isSpeaking ? (
                  <Volume2 className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── FAB Button ── */}
        <div className="relative flex items-center gap-3">
          {/* Tooltip */}
          {showTooltip && !isOpen && (
            <div
              className="bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap"
              style={{ animation: "fadeInUp 0.3s ease" }}
            >
              💬 ¿Necesitas ayuda con tu crédito?
              <span
                className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 rotate-45"
              />
            </div>
          )}

          <button
            id="nova-voice-fab"
            onClick={handleToggle}
            aria-label={isOpen ? "Cerrar asistente Nova" : "Abrir asistente de voz Nova"}
            className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${fabGradient} shadow-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95`}
          >
            {/* Ambient glow pulse */}
            <span
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${fabGradient} opacity-30`}
              style={{ animation: "ripple 2.5s ease-out infinite" }}
            />

            {isOpen ? (
              <X className="w-6 h-6 text-white relative z-10" />
            ) : (
              <>
                <MessageCircle className="w-5 h-5 text-white relative z-10" />
                {/* Unread dot when has messages */}
                {messages.length > 0 && !isOpen && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] text-white font-bold flex items-center justify-center z-20">
                    {messages.filter((m) => m.role === "assistant").length}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
