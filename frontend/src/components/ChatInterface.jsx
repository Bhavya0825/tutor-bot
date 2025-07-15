import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Bot, User, Loader2, Trash2 } from "lucide-react"; // Added Trash2
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// Define the default message outside so it can be reused
const defaultInitialMessage = [
  {
    role: "assistant",
    content:
      "Hello! I'm your AI tutor. I can help with DSA, algorithms, and more. What would you like to learn today?",
  },
];

const ChatInterface = () => {
  const getInitialMessages = () => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure saved history isn't empty
        return parsed.length > 0 ? parsed : defaultInitialMessage;
      } catch (e) {
        console.error("Error parsing chatHistory from localStorage");
      }
    }
    return defaultInitialMessage;
  };

  const [messages, setMessages] = useState(getInitialMessages);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // --- NEW FUNCTION TO CLEAR CHAT ---
  const handleClearChat = () => {
    localStorage.removeItem("chatHistory");
    setMessages(defaultInitialMessage);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      role: "user",
      content: inputText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("https://tutor-bot-u5v7.vercel.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: inputText, topic: "General" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get a response.");
      }

      const data = await response.json();
      const aiMessage = {
        role: "assistant",
        content: data.answer,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat API error:", error  );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, an error occurred: ${error.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b p-4">
        {/* Updated header with justify-between */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">AI Tutor Chat</h2>
            </div>
          </div>

          {/* New Clear Chat Button */}
          <Button variant="destructive" size="sm" onClick={handleClearChat}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-br-md"
                  : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-md"
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === "assistant" && (
                  <Bot className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                {message.role === "user" && (
                  <User className="h-5 w-5 text-blue-100 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-2xl rounded-bl-md">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;