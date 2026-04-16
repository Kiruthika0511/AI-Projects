"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface Step3Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function Step3Review({ onComplete, onBack }: Step3Props) {
  const [issues, setIssues] = useState<any[]>([]);
  const [connectedTo, setConnectedTo] = useState('Jira (Not configured)');
  const [isMounted, setIsMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setIsMounted(true);
    // Load connected Jira details
    const savedStep1 = localStorage.getItem('testPlanner_step1');
    if (savedStep1) {
      try {
        const data = JSON.parse(savedStep1);
        if (data.jiraName && data.jiraUrl) {
          setConnectedTo(`${data.jiraName} (${data.jiraUrl})`);
        } else if (data.jiraUrl) {
          setConnectedTo(`${data.jiraUrl}`);
        }
      } catch (e) {}
    }

    // Load fetched issues
    const fetched = localStorage.getItem('testPlanner_fetchedIssues');
    if (fetched) {
      try {
        setIssues(JSON.parse(fetched));
      } catch (e) {}
    }
  }, []);

  const handleGenerate = async () => {
    setErrorMsg('');
    setIsGenerating(true);
    try {
      const savedStep1 = localStorage.getItem('testPlanner_step1');
      const step1 = savedStep1 ? JSON.parse(savedStep1) : {};
      const savedStep2 = localStorage.getItem('testPlanner_step2');
      const step2 = savedStep2 ? JSON.parse(savedStep2) : {};

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           provider: step1.llmProvider || 'ollama',
           host: step1.ollamaHost,
           apiKey: step1.groqKey,
           model: step1.llmProvider === 'groq' ? (step1.groqModel || 'llama-3.3-70b-versatile') : (step1.ollamaModel || 'llama3'),
           issues: issues,
           context: step2.context
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to generate');

      localStorage.setItem('testPlanner_generatedPlan', json.markdown);
      onComplete();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error generating test plan');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          {connectedTo}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Review Jira Requirements ({issues.length})</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Requirements that will be used to generate the test plan</p>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {issues.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 mb-8">
             No requirements fetched yet. Go back to fetch requirements.
          </div>
        ) : (
          <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
            {issues.map((issue, idx) => (
              <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{issue.id}</span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">{issue.type}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${issue.status === 'Error' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{issue.summary}</h3>
                {issue.status !== 'Error' && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {issue.description && issue.description.length > 0 ? issue.description : 'No description provided.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button 
            onClick={onBack}
            disabled={isGenerating}
            className="px-6 py-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
          >
            Back
          </button>
          <button 
            onClick={handleGenerate}
            disabled={issues.length === 0 || isGenerating}
            className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none focus:ring-offset-2 dark:focus:ring-offset-slate-900 shadow-lg shadow-primary-500/30 flex justify-center items-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Plan with AI...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                Generate Test Plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
