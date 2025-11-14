"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Languages, Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  language?: "en" | "hi";
}
const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN || null;

// ----------------------------
// HUGGING FACE CONFIG
// ----------------------------
// ----------------------------
// HUGGING FACE CONFIG
// ----------------------------
const sendToHuggingFace = async (text: string) => {
  const url = `https://api-inference.huggingface.co/models/{HF_MODEL}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (HF_TOKEN) {
    headers["Authorization"] = `Bearer ${HF_TOKEN}`;
  }

  const body = {
    inputs: text,
    parameters: {
      max_new_tokens: 200,
      temperature: 0.4,
      top_p: 0.9,
      repetition_penalty: 1.1,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text;
  }

  return "I could not get a proper response from the AI model.";
};



export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I am your Sanjeevani Garden assistant. I can help you learn about herbs and translate between English and Hindi. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      language: "en",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi">("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ----------------------------
  // SIMPLE LOCAL FALLBACK AI
  // ----------------------------
  const generateAIResponse = (text: string) => {
    const msg = text.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi") || msg.includes("नमस्ते")) {
      return currentLanguage === "en"
        ? "Hello! Ask me about herbs, remedies, or translations."
        : "नमस्ते! आप मुझसे जड़ी-बूटियों, उपचार या अनुवाद के बारे में पूछ सकते हैं।";
    }

    return currentLanguage === "en"
      ? "Ask about a herb or symptom, for example: 'tulsi', 'cough', 'haldi'."
      : "किसी जड़ी-बूटी या लक्षण के बारे में पूछें, जैसे: 'तुलसी', 'खांसी', 'हल्दी'।";
  };

  // ----------------------------
  // SEND MESSAGE
  // ----------------------------
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      language: currentLanguage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let reply = "";

      // Try Hugging Face first
      try {
        reply = await sendToHuggingFace(inputMessage);
      } catch (err) {
        console.warn("HF failed, using fallback:", err);
        reply = generateAIResponse(inputMessage);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        sender: "bot",
        timestamp: new Date(),
        language: currentLanguage,
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg animate-pulse"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[92vw] h-[540px] z-50">
          <Card className="h-full flex flex-col shadow-2xl border-emerald-200">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <CardTitle className="text-lg">Sanjeevani AI Assistant</CardTitle>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    <Languages className="h-4 w-4" />
                    <span className="ml-1 text-xs">{currentLanguage.toUpperCase()}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                        <span className="text-xs opacity-70">
                          {msg.sender === "user" ? "You" : "AI Assistant"}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="h-3 w-3" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-3 bg-white">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      currentLanguage === "en"
                        ? "Ask about herbs or translations..."
                        : "जड़ी-बूटियों या अनुवाद के बारे में पूछें..."
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className="flex-1"
                  />

                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
