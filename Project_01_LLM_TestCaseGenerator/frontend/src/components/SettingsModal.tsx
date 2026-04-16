import React, { useState } from 'react';
import { X, Save, Plug } from 'lucide-react';
import type { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [testStatus, setTestStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('Testing...');
    try {
      // Mocking the backend test connection call for now
      const response = await fetch('http://localhost:3001/api/health'); // Check if backend is alive
      if (response.ok) {
        setTestStatus('Backend Connection Successful!');
      } else {
        setTestStatus('Failed to connect to Backend.');
      }
    } catch (e) {
      setTestStatus('Connection Error.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#151B2B] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[#1F293F]">
        <div className="flex justify-between items-center p-6 border-b border-[#1F293F] bg-[#0A0D14]">
          <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
			  <Plug size={20} className="text-blue-500" /> Connection Settings
		  </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
           <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Default Provider</label>
            <select
              name="defaultProvider"
              value={localSettings.defaultProvider}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-[#2A344A] focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-[#0A0D14] text-slate-300 shadow-sm"
            >
              <option value="ollama">Ollama (Local)</option>
              <option value="lmstudio">LM Studio (Local)</option>
              <option value="groq">Groq</option>
              <option value="openai">OpenAI</option>
              <option value="claude">Anthropic Claude</option>
              <option value="gemini">Google Gemini</option>
            </select>
          </div>

          <div className="pt-4 border-t border-[#1F293F]">
            <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Local Setup</h3>
            <div className="space-y-3">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Ollama API URL</label>
                        <input type="text" name="ollamaUrl" value={localSettings.ollamaUrl} onChange={handleChange} className="w-full p-2 rounded-lg border border-[#2A344A] bg-[#0A0D14] text-slate-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
                    </div>
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Model Name</label>
                        <input type="text" name="ollamaModel" value={localSettings.ollamaModel || 'llama3'} onChange={handleChange} className="w-full p-2 rounded-lg border border-[#2A344A] bg-[#0A0D14] text-slate-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">LM Studio API URL</label>
                    <input type="text" name="lmStudioUrl" value={localSettings.lmStudioUrl} onChange={handleChange} className="w-full p-2 rounded-lg border border-[#2A344A] bg-[#0A0D14] text-slate-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
                </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1F293F]">
            <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Cloud API Keys</h3>
            <div className="space-y-3">
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Groq API Key</label>
                    <input type="password" name="groqKey" value={localSettings.groqKey} onChange={handleChange} className="w-full p-2 rounded-lg border border-[#2A344A] bg-[#0A0D14] text-slate-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">OpenAI API Key</label>
                    <input type="password" name="openAiKey" value={localSettings.openAiKey} onChange={handleChange} className="w-full p-2 rounded-lg border border-[#2A344A] bg-[#0A0D14] text-slate-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Claude API Key</label>
                    <input type="password" name="claudeKey" value={localSettings.claudeKey} onChange={handleChange} className="w-full p-2 rounded-lg border border-[#2A344A] bg-[#0A0D14] text-slate-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Gemini API Key</label>
                    <input type="password" name="geminiKey" value={localSettings.geminiKey} onChange={handleChange} className="w-full p-2 rounded-lg border border-[#2A344A] bg-[#0A0D14] text-slate-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" />
                </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#1F293F] bg-[#0A0D14] flex items-center justify-between gap-4">
            <div className="flex-1 text-sm text-slate-400 font-medium">
                {testStatus}
            </div>
            <div className="flex items-center gap-3">
                 <button onClick={handleTestConnection} className="px-4 py-2 border border-[#2A344A] text-slate-300 bg-[#151B2B] rounded-xl hover:bg-[#1E273C] hover:text-white font-medium shadow-sm transition-colors flex items-center gap-2">
                    <Plug size={18} />
                    Test Connection
                </button>
                <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-md transition-colors flex items-center gap-2">
                    <Save size={18} />
                    Save
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
