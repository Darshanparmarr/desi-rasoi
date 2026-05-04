import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const QUICK_REPLIES = [
  "Where is my order?",
  "What are the shipping charges?",
  "Do you offer international shipping?",
  "How can I return an item?"
];

const BOT_RESPONSES: Record<string, string> = {
  "Where is my order?": "You can track your order in the 'Order Lookup' section by entering your order ID.",
  "What are the shipping charges?": "We offer free shipping on orders above ₹500. For orders below that, a standard charge applies.",
  "Do you offer international shipping?": "Currently, we ship only within India. We hope to expand internationally soon!",
  "How can I return an item?": "You can initiate a return within 7 days of delivery from your Orders page.",
  "default": "Thanks for reaching out! A customer support representative will get back to you shortly. For immediate assistance, message us on WhatsApp at +91 9867008801."
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Akshar E-Commerce. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const responseText = BOT_RESPONSES[text] || BOT_RESPONSES["default"];
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMessage]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-3rem)] sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 transform origin-bottom-right animate-in fade-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-amber-600 dark:bg-amber-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6" />
              <h3 className="font-semibold text-lg">Support Chat</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-amber-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-amber-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-none shadow-sm'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-amber-200' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length < 3 && (
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-800">
              {QUICK_REPLIES.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(reply)}
                  className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors border border-amber-200 dark:border-amber-800 text-left"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 border focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-full px-4 py-2 text-sm dark:text-white transition-colors outline-none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0 opacity-0 hidden' : 'scale-100 opacity-100'} bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:shadow-amber-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
        aria-label="Chat with Support"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ChatBot;
