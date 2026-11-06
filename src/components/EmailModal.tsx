import React, { useState } from 'react';
import { Mail, X, Check, Copy, ExternalLink, Inbox } from 'lucide-react';
import { useStore, EmailNotification } from '../context/StoreContext';

export const EmailModal: React.FC = () => {
  const { latestEmail, dismissEmail, sentEmails, viewEmail } = useStore();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'history'>('preview');

  if (!latestEmail) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(latestEmail.htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#151518] text-[#F5F3EC] border border-[#282830] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#282830] flex items-center justify-between bg-[#0E0E10]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-primary">
                  Resend + React Email Notification
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded font-mono">
                  Delivered 200 OK
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white truncate max-w-md">
                {latestEmail.subject}
              </h3>
            </div>
          </div>
          <button
            onClick={dismissEmail}
            className="p-1.5 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-[#202024] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispatch Metadata */}
        <div className="px-4 py-2.5 bg-[#1B1B20] border-b border-[#282830] text-xs font-mono text-[#A1A1AA] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span>From: <strong className="text-white">orders@jbluxenterprises.com</strong></span>
            <span>·</span>
            <span>To: <strong className="text-white">{latestEmail.recipientEmail}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeTab === 'preview' ? 'bg-primary text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Visual Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeTab === 'code' ? 'bg-primary text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              HTML Template
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeTab === 'history' ? 'bg-primary text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Sent Log ({sentEmails.length})
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0E0E10]">
          {activeTab === 'preview' && (
            <div className="bg-black rounded-lg p-2 shadow-inner border border-[#202024]">
              <div
                dangerouslySetInnerHTML={{ __html: latestEmail.htmlContent }}
                className="overflow-x-auto"
              />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="relative">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#202024] hover:bg-[#282830] text-xs font-mono text-white rounded border border-[#3A3A45] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
                <span>{copied ? 'Copied' : 'Copy HTML'}</span>
              </button>
              <pre className="p-4 bg-[#151518] border border-[#282830] rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
                {latestEmail.htmlContent}
              </pre>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              <p className="text-xs text-[#A1A1AA] mb-3">All automated notification emails dispatched in this session:</p>
              {sentEmails.map(em => (
                <div
                  key={em.id}
                  onClick={() => {
                    viewEmail(em);
                    setActiveTab('preview');
                  }}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-colors flex items-center justify-between ${
                    em.id === latestEmail.id
                      ? 'bg-primary/10 border-primary text-white'
                      : 'bg-[#151518] border-[#282830] text-[#A1A1AA] hover:bg-[#202024] hover:text-white'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white">{em.subject}</p>
                    <p className="text-[11px] font-mono text-primary">To: {em.recipientEmail} · Ref: {em.orderNumber}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#666666]">
                    {new Date(em.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#151518] border-t border-[#282830] flex items-center justify-between text-xs text-[#A1A1AA]">
          <span>Triggered automatically via JB Lux notification pipeline</span>
          <button
            onClick={dismissEmail}
            className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Close Notification
          </button>
        </div>
      </div>
    </div>
  );
};
