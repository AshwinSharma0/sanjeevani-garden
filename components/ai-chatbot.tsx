"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Languages, Bot, User } from "lucide-react";
import { useLayoutEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  language?: "en" | "hi";
}

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
  //const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  const scrollToBottom = () => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
};
  useLayoutEffect(() => {

    scrollToBottom();

}, [messages]);

  // ----------------------------
  // SEND MESSAGE
  // ----------------------------
  const handleSendMessage = async () => {
    const messageToSend = inputMessage.trim();

    if (!messageToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: "user",
      timestamp: new Date(),
      language: currentLanguage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [
    ...messages,
    userMessage,
  ], }),
      });

      const data = await response.json();
      const aiReply = data.reply || "Sorry, I couldn't generate a reply right now.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiReply,
        sender: "bot",
        timestamp: new Date(),
        language: currentLanguage,
      };

      setMessages((prev) => [...prev, botMessage]);
      setTimeout(() => { scrollToBottom();

      }, 50);
    } catch (err) {
      console.error("Chat request failed:", err);

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, I couldn't connect right now. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        language: currentLanguage,
      };

      setMessages((prev) => [...prev, errorMessage]);
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
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[95vw] h-[700px] max-h-[90vh]">
          <Card className="h-full flex flex-col overflow-hidden shadow-2xl border-emerald-200">
            <CardHeader className="sticky top-0 z-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
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
            <CardContent className="flex flex-col h-full p-0 overflow-hidden">
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                          : "bg-emerald-50 border border-emerald-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                        <span className="text-xs opacity-70">
                          {msg.sender === "user" ? "You" : "AI Assistant"}
                        </span>
                      </div>
                      
                      <div 
                      className="
                      prose
                      prose-sm
                      max-w-none
                      prose-headings:text-emerald-700
                      prose-strong:text-emerald-800
                      prose-li:marker:text-emerald-600
                      prose-p:leading-7"
                      >
                        <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({ children }) => (
      <h1 className="text-xl font-bold text-emerald-700 mb-3">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-semibold text-emerald-700 mb-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-semibold text-emerald-700 mb-2">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-3 leading-7">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
    ),
    li: ({ children }) => (
      <li>{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-emerald-800">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 rounded px-1 py-0.5 text-sm">
        {children}
      </code>
    ),
  }}
>
  {msg.content}
</ReactMarkdown>
                          </div>
                      <p
                      className={`text-[10px] mt-2 ${
                        msg.sender === "user"
                        ? "text-emerald-100"
                        : "text-gray-500"
                        }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        })}
                        </p>
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
                <div className="h-24"></div>

                
              </div>

              {/* Input */}
              <div className="border-t bg-white p-3 flex-shrink-0">
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
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />

                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    {isLoading ? "Thinking..." : <Send className="h-4 w-4" />}
                    
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
