"use client";

import { useState, useRef, useCallback } from "react";

export type VoiceState =
  | "idle"
  | "recording"
  | "transcribing"
  | "thinking"
  | "speaking"
  | "error";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export function useVoiceAssistant() {
  const [state, setState] = useState<VoiceState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCurrentAudio = useCallback(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    // Stop any playing audio
    stopCurrentAudio();
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Determine supported MIME type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.start(100); // collect data every 100ms
      setState("recording");
    } catch (err) {
      console.error("[VOICE] Error starting recording:", err);
      setError("No se pudo acceder al micrófono. Verifica los permisos.");
      setState("error");
    }
  }, [stopCurrentAudio]);

  const stopRecording = useCallback(() => {
    return new Promise<void>((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        resolve();
        return;
      }

      recorder.onstop = () => {
        // Stop all tracks
        streamRef.current?.getTracks().forEach((t) => t.stop());
        resolve();
      };

      recorder.stop();
    });
  }, []);

  const processVoice = useCallback(async () => {
    if (state !== "recording") return;

    await stopRecording();
    setState("transcribing");

    try {
      // 1. Transcribe audio
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType ?? "audio/webm",
      });

      if (audioBlob.size < 1000) {
        setState("idle");
        return; // Audio too short, ignore
      }

      const formData = new FormData();
      // Whisper needs a filename with extension to detect format
      const ext = (mediaRecorderRef.current?.mimeType ?? "audio/webm").includes("mp4")
        ? "m4a"
        : "webm";
      formData.append("audio", audioBlob, `recording.${ext}`);

      const transcribeRes = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeRes.ok) throw new Error("Transcription failed");
      const { text: userText } = await transcribeRes.json();

      if (!userText?.trim()) {
        setState("idle");
        return;
      }

      // Add user message to history
      const userMessage: Message = { role: "user", content: userText };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // 2. Get GPT response
      setState("thinking");
      const chatRes = await fetch("/api/voice/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!chatRes.ok) throw new Error("Chat failed");
      const { reply } = await chatRes.json();

      const assistantMessage: Message = { role: "assistant", content: reply };
      setMessages([...updatedMessages, assistantMessage]);

      // 3. Convert reply to speech
      setState("speaking");
      const speakRes = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reply }),
      });

      if (!speakRes.ok) throw new Error("TTS failed");

      const audioBuffer = await speakRes.arrayBuffer();
      const audioBlob2 = new Blob([audioBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob2);

      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setState("idle");
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setState("idle");
      };

      await audio.play();
    } catch (err) {
      console.error("[VOICE] Processing error:", err);
      setError("Ocurrió un error. Intenta de nuevo.");
      setState("error");
    }
  }, [state, stopRecording, messages]);

  const clearConversation = useCallback(() => {
    stopCurrentAudio();
    setMessages([]);
    setState("idle");
    setError(null);
  }, [stopCurrentAudio]);

  const dismissError = useCallback(() => {
    setError(null);
    setState("idle");
  }, []);

  return {
    state,
    messages,
    error,
    startRecording,
    stopRecording: processVoice,
    clearConversation,
    dismissError,
    isRecording: state === "recording",
    isProcessing: state === "transcribing" || state === "thinking",
    isSpeaking: state === "speaking",
    isIdle: state === "idle",
  };
}
