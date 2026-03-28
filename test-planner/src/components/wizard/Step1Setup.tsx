"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Workflow, CheckCircle2, ChevronDown } from 'lucide-react';

interface Step1Props {
  onComplete: () => void;
}

export default function Step1Setup({ onComplete }: Step1Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [llmProvider, setLlmProvider] = useState('ollama');
  const [ollamaHost, setOllamaHost] = useState('');
  const [ollamaModel, setOllamaModel] = useState('llama3');
  const [groqKey, setGroqKey] = useState('');
  const [groqModel, setGroqModel] = useState('llama-3.3-70b-versatile');
  
  const [jiraName, setJiraName] = useState('');
  const [jiraUrl, setJiraUrl] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraToken, setJiraToken] = useState('');

  const [llmTested, setLlmTested] = useState(false);
  const [jiraTested, setJiraTested] = useState(false);
  const [jiraSaved, setJiraSaved] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('testPlanner_step1');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.llmProvider) setLlmProvider(data.llmProvider);
        if (data.ollamaHost) setOllamaHost(data.ollamaHost);
        if (data.ollamaModel) setOllamaModel(data.ollamaModel);
        if (data.groqKey) setGroqKey(data.groqKey);
        if (data.groqModel) setGroqModel(data.groqModel);

        if (data.jiraName) setJiraName(data.jiraName);
        if (data.jiraUrl) setJiraUrl(data.jiraUrl);
        if (data.jiraEmail) setJiraEmail(data.jiraEmail);
        if (data.jiraToken) setJiraToken(data.jiraToken);
      } catch (e) {
        console.error("Failed to restore Step 1 state", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('testPlanner_step1', JSON.stringify({
        llmProvider, ollamaHost, ollamaModel, groqKey, groqModel, jiraName, jiraUrl, jiraEmail, jiraToken
      }));
    }
  }, [llmProvider, ollamaHost, ollamaModel, groqKey, groqModel, jiraName, jiraUrl, jiraEmail, jiraToken, isMounted]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* LLM Connection Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">LLM Connection</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Configure your language model provider for generating test plans</p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Provider</label>
          <div className="relative">
            <select 
              value={llmProvider}
              onChange={(e) => {
                setLlmProvider(e.target.value);
                setLlmTested(false);
              }}
              className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
            >
              <option value="ollama">Ollama (Local)</option>
              <option value="groq">Groq (Cloud)</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {llmProvider === 'ollama' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ollama Host URL</label>
              <input 
                type="text" 
                value={ollamaHost}
                onChange={(e) => { setOllamaHost(e.target.value); setLlmTested(false); }}
                placeholder="http://localhost:11434" 
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Model Name</label>
              <input 
                type="text" 
                value={ollamaModel}
                onChange={(e) => { setOllamaModel(e.target.value); setLlmTested(false); }}
                placeholder="llama3" 
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" 
              />
            </div>
          </div>
        )}

        {llmProvider === 'groq' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">API Key</label>
              <input 
                type="password" 
                value={groqKey}
                onChange={(e) => { setGroqKey(e.target.value); setLlmTested(false); }}
                placeholder="gsk_..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Model Name</label>
              <input 
                type="text" 
                value={groqModel}
                onChange={(e) => { setGroqModel(e.target.value); setLlmTested(false); }}
                placeholder="llama-3.3-70b-versatile" 
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" 
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => setLlmTested(true)}
            className="px-4 py-2 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-900 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            Test Connection
          </button>
          <div className="h-6">
            {llmTested && <span className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium h-full"><CheckCircle2 className="w-4 h-4 mr-1"/> Connected</span>}
          </div>
        </div>
      </div>

      {/* Jira Connection Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Jira Connection</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Connect to your Jira instance to fetch user stories</p>
        
        <div className="space-y-4 mb-6">
          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Connection Name</label>
             <input 
               type="text" 
               value={jiraName}
               onChange={(e) => { setJiraName(e.target.value); setJiraTested(false); setJiraSaved(false); }}
               placeholder="e.g., VWO Production" 
               className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" 
             />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jira URL</label>
             <input 
               type="url" 
               value={jiraUrl}
               onChange={(e) => { setJiraUrl(e.target.value); setJiraTested(false); setJiraSaved(false); }}
               placeholder="https://yourcompany.atlassian.net" 
               className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" 
             />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jira Email</label>
             <input 
               type="email" 
               value={jiraEmail}
               onChange={(e) => { setJiraEmail(e.target.value); setJiraTested(false); setJiraSaved(false); }}
               placeholder="your-email@company.com" 
               className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" 
             />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">API Token</label>
             <input 
               type="password" 
               value={jiraToken}
               onChange={(e) => { setJiraToken(e.target.value); setJiraTested(false); setJiraSaved(false); }}
               placeholder="Your Jira API token" 
               className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" 
             />
             <p className="text-xs text-slate-500 mt-2">Generate at: https://id.atlassian.com/manage-profile/security/api-tokens</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
             type="button" 
             onClick={() => setJiraTested(true)}
             className="px-4 py-2 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-900 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            Test Connection
          </button>
          <div className="h-6">
            {jiraTested && <span className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium h-full"><CheckCircle2 className="w-4 h-4 mr-1"/> Connected</span>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onComplete}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none focus:ring-offset-2 dark:focus:ring-offset-slate-900 shadow-lg shadow-primary-500/30 flex justify-center items-center"
        >
          Continue to Fetch Requirements
        </button>
      </div>
    </div>
  );
}
