import React, { useState } from 'react';
import { Send, Phone, User, CheckCheck } from 'lucide-react';
import Button from '../../components/common/Button';

export const CustomerMessagesPage = () => {
  const [conversations] = useState([
    {
      id: 'c-1',
      providerName: 'Ramesh Kumar',
      category: 'Electrician',
      lastMessage: 'Ji sir, reaching your Sector 15 house in 10 minutes.',
      time: '02:15 PM',
      unread: 1,
      online: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 'c-2',
      providerName: 'Sunita Verma',
      category: 'Home Cleaning',
      lastMessage: 'Thank you for the 5-star review! Happy to serve.',
      time: 'Yesterday',
      unread: 0,
      online: false,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    },
  ]);

  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [messages, setMessages] = useState([
    { sender: 'provider', text: 'Namaste Adarsh ji, I have accepted your booking for ceiling fan repair.', time: '01:45 PM' },
    { sender: 'customer', text: 'Namaste Ramesh ji. Please check the switchboard socket as well.', time: '01:50 PM' },
    { sender: 'provider', text: 'Ji sure, I have spare anchor switches with me.', time: '01:52 PM' },
    { sender: 'provider', text: 'Ji sir, reaching your Sector 15 house in 10 minutes.', time: '02:15 PM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([
      ...messages,
      { sender: 'customer', text: newMessage.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden h-[600px] flex flex-col md:flex-row">
      {/* Conversations List Left */}
      <div className="w-full md:w-80 border-r border-surface-border flex flex-col bg-surface-muted">
        <div className="p-4 border-b border-surface-border">
          <h2 className="text-sm font-bold text-content-dark">Direct Messages</h2>
          <p className="text-[11px] text-content-muted">Chat with assigned service technicians</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveConv(c)}
              className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                activeConv.id === c.id ? 'bg-white shadow-subtle' : 'hover:bg-slate-100/60'
              }`}
            >
              <div className="relative shrink-0">
                <img src={c.avatar} alt={c.providerName} className="h-10 w-10 rounded-full object-cover" />
                {c.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-content-dark truncate">{c.providerName}</h4>
                  <span className="text-[10px] text-content-muted">{c.time}</span>
                </div>
                <p className="text-[11px] text-brand-700 font-medium truncate">{c.category}</p>
                <p className="text-xs text-content-secondary truncate mt-0.5">{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area Right */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={activeConv.avatar} alt={activeConv.providerName} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h3 className="text-sm font-bold text-content-dark">{activeConv.providerName}</h3>
              <p className="text-[11px] text-emerald-600 font-medium">Online • Verified Partner</p>
            </div>
          </div>

          <a
            href="tel:+919811234567"
            className="p-2 rounded-lg bg-surface-muted text-brand-600 hover:bg-brand-50 transition-colors"
            title="Call Partner"
          >
            <Phone className="h-4 w-4" />
          </a>
        </div>

        {/* Message Bubble List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-subtle/30">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'customer' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'customer'
                    ? 'bg-brand-500 text-white rounded-br-none'
                    : 'bg-white border border-surface-border text-content-dark rounded-bl-none shadow-subtle'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-content-muted mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-surface-border flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message to your technician..."
            className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
          />
          <Button type="submit" variant="primary" size="sm" rightIcon={Send}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CustomerMessagesPage;
