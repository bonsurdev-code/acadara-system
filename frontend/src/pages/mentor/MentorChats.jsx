import { useState, useEffect, useRef } from 'react';
import { Send, Hash, Search, MoreVertical, Paperclip, MessageSquare, ArrowLeft } from 'lucide-react';
import { useUserService } from '../../core/api-hooks/useUserService';
import { useChat } from '../../core/api-hooks/useChat';
import { getInitials } from '../../utils/getInitials';

export default function MentorChats() {
  const { getReceivedRequests } = useUserService();
  const { messages, fetchMessages, sendMessage } = useChat();
  
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const init = async () => {
      const res = await getReceivedRequests();
      const accepted = res?.data?.filter(m => m.status === 'accepted') || [];
      setContacts(accepted);
      // Auto-select on desktop only
      if (window.innerWidth > 768 && accepted.length > 0) setActiveContact(accepted[0]);
    };
    init();
  }, []);

  useEffect(() => {
    if (activeContact) fetchMessages(activeContact.match_id);
  }, [activeContact, fetchMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;
    await sendMessage(activeContact.match_id, inputText);
    setInputText("");
  };

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] max-w-7xl mx-auto bg-slate-950 md:border md:border-slate-800 md:rounded-[3rem] overflow-hidden shadow-2xl">
      
      {/* SIDEBAR: CONTACTS */}
      <div className={`
        ${activeContact ? 'hidden md:flex' : 'flex'} 
        w-full md:w-80 border-r border-slate-800 bg-slate-900/50 flex-col
      `}>
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Messages</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input type="text" placeholder="Search chats..." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-indigo-500" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button 
              key={contact.match_id}
              onClick={() => setActiveContact(contact)}
              className={`w-full p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-all border-l-4 ${activeContact?.match_id === contact.match_id ? 'bg-indigo-600/10 border-indigo-500' : 'border-transparent opacity-60'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700 uppercase shrink-0">
                {getInitials(contact.Mentee?.user?.usr_name)}
              </div>
              <div className="text-left overflow-hidden">
                <h4 className="text-sm font-bold text-white truncate">{contact.Mentee?.user?.usr_name}</h4>
                <p className="text-[10px] text-slate-500 uppercase font-black truncate">{contact.Mentee?.mentee_subject || 'Mentee'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className={`
        ${!activeContact ? 'hidden md:flex' : 'flex'} 
        flex-1 flex flex-col bg-slate-950 relative
      `}>
        {activeContact ? (
          <>
            {/* Header */}
            <div className="p-4 md:px-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveContact(null)} className="md:hidden p-2 -ml-2 text-slate-400">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                  <Hash className="text-indigo-500" size={16} />
                </div>
                <span className="font-black text-white italic uppercase text-xs md:text-sm tracking-widest truncate max-w-[150px]">
                  {activeContact.Mentee?.user?.usr_name}
                </span>
              </div>
              <MoreVertical size={18} className="text-slate-600 cursor-pointer" />
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              {messages.map((msg, idx) => {
                // FIX: Check against mentor_id since we are in MentorChats
                const isMe = msg.sender_id === activeContact.mentor_id; 
                
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                      isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10' 
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                    }`}>
                      {msg.content}
                      <p className={`text-[9px] mt-2 opacity-50 font-bold ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 md:p-6 bg-slate-950 border-t border-slate-800 md:border-none">
              <div className="flex items-center gap-2 md:gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 md:p-2 pl-4 focus-within:border-indigo-500 transition-all">
                <Paperclip size={18} className="text-slate-600 cursor-pointer hover:text-white shrink-0" />
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm py-2 min-w-0"
                />
                <button type="submit" className="bg-indigo-600 p-2 md:p-2.5 rounded-xl hover:bg-indigo-500 transition-all shrink-0">
                  <Send size={18} className="text-white" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center opacity-20">
            <MessageSquare size={80} className="mb-4" />
            <p className="font-black italic uppercase tracking-widest">Select a mentee to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}