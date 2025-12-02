import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MessageCircle, X, Send } from 'lucide-react'; // Make sure you installed lucide-react

const ChatWidget = ({ receiverId, receiverName }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Don't render anything if the user is not logged in
    if (!user) return null;

    // Fetch conversation when chat opens
    useEffect(() => {
        if (isOpen && receiverId) {
            const fetchMessages = async () => {
                try {
                    const res = await api.get(`/chat/${receiverId}`);
                    setMessages(res.data);
                } catch (err) {
                    console.error("Failed to load chat");
                }
            };
            fetchMessages();
            
            // Poll for new messages every 3 seconds
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen, receiverId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await api.post('/chat/send', {
                receiverId,
                content: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.error("Failed to send");
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl flex flex-col border border-gray-200 mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-10">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="font-bold">{receiverName}</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 mt-10 text-sm">
                                <p>Start a conversation with the owner.</p>
                                <p>Ask about availability! 👋</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                                msg.sender === user.id 
                                ? 'bg-blue-600 text-white self-end rounded-br-none' 
                                : 'bg-white text-gray-800 border border-gray-100 self-start rounded-bl-none'
                            }`}>
                                {msg.content}
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input 
                            className="flex-1 bg-gray-100 border-0 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={!newMessage.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-blue-500/40 font-bold hover:bg-blue-700 transition flex items-center gap-3 transform hover:-translate-y-1"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span>Chat with Owner</span>
                </button>
            )}
        </div>
    );
};

export default ChatWidget;