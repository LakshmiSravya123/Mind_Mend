import { MessageCircle, X, Send, Brain, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChatMessages, useSendMessage } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AICompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: messages, isLoading } = useChatMessages();
  const sendMessage = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessage.isPending) return;

    const messageToSend = message;
    setMessage("");
    
    try {
      await sendMessage.mutateAsync(messageToSend);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleQuickAction = (action: string) => {
    const quickMessages = {
      breathing: "Can you guide me through a breathing exercise?",
      walk: "I need motivation for a short walk",
      music: "Can you recommend some calming music?"
    };
    
    if (quickMessages[action as keyof typeof quickMessages]) {
      sendMessage.mutate(quickMessages[action as keyof typeof quickMessages]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" data-testid="ai-companion">
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-primary to-mood-calm rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all transform hover:scale-105"
        data-testid="button-toggle-chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col" data-testid="window-chat">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-mood-calm rounded-full flex items-center justify-center">
                <Brain className="text-xs font-bold text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">MoodSync Assistant</h3>
                <p className="text-xs text-green-500">● Online</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600"
              data-testid="button-close-chat"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3" data-testid="container-messages">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {!messages || messages.length === 0 ? (
                  // Welcome message
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="text-xs font-bold text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 max-w-xs">
                      <p className="text-sm text-gray-700">
                        Hi! I'm your MoodSync AI companion. I'm here to help you understand your mood patterns and provide personalized wellness advice. How are you feeling today?
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`flex items-start space-x-2 ${msg.isFromUser ? 'justify-end' : ''}`}
                      data-testid={`message-${index}`}
                    >
                      {msg.isFromUser ? (
                        <>
                          <div className="bg-primary rounded-2xl rounded-tr-sm p-3 max-w-xs">
                            <p className="text-sm text-white">{msg.message}</p>
                          </div>
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="text-xs font-bold text-gray-600" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Brain className="text-xs font-bold text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 max-w-xs">
                            <p className="text-sm text-gray-700">{msg.message}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}

                {/* Quick Action Buttons */}
                {(!messages || messages.length <= 2) && (
                  <div className="flex flex-wrap gap-2 mt-3" data-testid="quick-actions">
                    <Button
                      onClick={() => handleQuickAction('breathing')}
                      variant="ghost"
                      size="sm"
                      className="px-3 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full hover:bg-opacity-20 transition-colors"
                      data-testid="button-breathing"
                    >
                      🧘 Breathing exercise
                    </Button>
                    <Button
                      onClick={() => handleQuickAction('walk')}
                      variant="ghost" 
                      size="sm"
                      className="px-3 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full hover:bg-opacity-20 transition-colors"
                      data-testid="button-walk"
                    >
                      🚶 Short walk
                    </Button>
                    <Button
                      onClick={() => handleQuickAction('music')}
                      variant="ghost"
                      size="sm" 
                      className="px-3 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full hover:bg-opacity-20 transition-colors"
                      data-testid="button-music"
                    >
                      🎵 Calming music
                    </Button>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sendMessage.isPending}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                data-testid="input-message"
              />
              <Button
                type="submit"
                disabled={!message.trim() || sendMessage.isPending}
                size="sm"
                className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-opacity-90 transition-colors disabled:bg-gray-300"
                data-testid="button-send"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
