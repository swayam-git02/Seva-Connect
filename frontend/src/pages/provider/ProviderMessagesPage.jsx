import React, { useState } from 'react';
import { Send, Phone } from 'lucide-react';
import Button from '../../components/common/Button';

export const ProviderMessagesPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'customer', text: 'Namaste Ramesh ji. Please check the switchboard socket as well.', time: '01:50 PM' },
    { sender: 'provider', text: 'Ji sure, I have spare anchor switches with me.', time: '01:52 PM' },
    { sender: 'provider', text: 'Ji sir, reaching your Sector 15 house in 10 minutes.', time: '02:15 PM' },
    { sender: 'customer', text: 'Great, ringing the bell will open the gate.', time: '02:16 PM' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'provider', text: input.trim(), time: 'Just now' }]);
    setInput('');
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden h-[600px] flex flex-col">
      <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-muted">
        <div>
          <h3 className="text-sm font-bold text-content-dark">Adarsh Sharma</h3>
          <p className="text-[11px] text-content-muted">Sector 15, Faridabad • Booking #SC-8921</p>
        </div>
        <a
          href="tel:+919876543210"
          className="p-2 bg-white rounded-lg text-brand-600 border border-surface-border"
        >
          <Phone className="h-4 w-4" />
        </a>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.sender === 'provider' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-md p-3 rounded-2xl text-xs ${
              m.sender === 'provider' ? 'bg-brand-500 text-white rounded-br-none' : 'bg-white border border-slate-200 text-content-dark rounded-bl-none shadow-subtle'
            }`}>
              {m.text}
            </div>
            <span className="text-[10px] text-content-muted mt-0.5">{m.time}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-surface-border flex items-center gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Reply to customer..."
          className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
        />
        <Button type="submit" variant="primary" size="sm" rightIcon={Send}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default ProviderMessagesPage;
