"use client";

import React, { useState, useEffect } from 'react';

interface Step2Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function Step2Fetch({ onComplete, onBack }: Step2Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [productName, setProductName] = useState('');
  const [ticketIds, setTicketIds] = useState('');
  const [context, setContext] = useState('');
  const [connectedTo, setConnectedTo] = useState('Jira (Not configured)');
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  useEffect(() => {
    setIsMounted(true);
    const savedStep2 = localStorage.getItem('testPlanner_step2');
    if (savedStep2) {
      try {
        const data = JSON.parse(savedStep2);
        if (data.productName) setProductName(data.productName);
        if (data.ticketIds) setTicketIds(data.ticketIds);
        if (data.context) setContext(data.context);
      } catch (e) {
        console.error("Failed to restore Step 2 state", e);
      }
    }
    
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
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('testPlanner_step2', JSON.stringify({
        productName, ticketIds, context
      }));
    }
  }, [productName, ticketIds, context, isMounted]);

  const handleFetch = async () => {
    setErrorMsg('');
    if (!ticketIds.trim()) {
      setErrorMsg('Please enter at least one Ticket ID.');
      return;
    }

    const savedStep1 = localStorage.getItem('testPlanner_step1');
    if (!savedStep1) {
      setErrorMsg('Jira connection details are missing. Please go back to Setup.');
      return;
    }

    let url, email, token;
    try {
      const data = JSON.parse(savedStep1);
      url = data.jiraUrl;
      email = data.jiraEmail;
      token = data.jiraToken;
    } catch(e) {}

    if (!url || !email || !token) {
      setErrorMsg('Jira connection details are incomplete. Please go back to Setup.');
      return;
    }

    setIsFetching(true);
    try {
      const res = await fetch('/api/jira/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, email, token, ticketIds })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch');
      }

      localStorage.setItem('testPlanner_fetchedIssues', JSON.stringify(json.issues));
      onComplete(); // proceed to step 3
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while fetching.');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Fetch Jira Requirements</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Enter project details to fetch user stories and requirements</p>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 flex justify-between items-center border border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-0.5">Connected to:</p>
            <p className="text-sm text-slate-900 dark:text-white font-medium">{connectedTo}</p>
          </div>
          <button 
            onClick={onBack}
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
          >
            Change
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <div className="mb-6">
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Product Name & URL (Optional)</label>
           <input 
             type="text" 
             value={productName}
             onChange={e => setProductName(e.target.value)}
             placeholder="e.g., App.vwo.com" 
             className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" 
           />
        </div>
        
        <div className="mb-6">
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ticket ID(s) *</label>
           <input 
             type="text" 
             value={ticketIds}
             onChange={e => setTicketIds(e.target.value)}
             placeholder="e.g., VWO-1234, KAN-1" 
             className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white" 
           />
           <p className="text-xs text-slate-500 mt-2">Enter one or more Jira ticket IDs separated by commas.</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Additional Context (Optional)</label>
          <textarea 
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="Any additional information about the product, testing goals, or constraints..." 
            className="w-full h-32 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white resize-none"
          ></textarea>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onBack}
            disabled={isFetching}
            className="px-6 py-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-slate-500 focus:outline-none disabled:opacity-50"
          >
            Back
          </button>
          <button 
            onClick={handleFetch}
            disabled={isFetching}
            className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none focus:ring-offset-2 dark:focus:ring-offset-slate-900 shadow-lg shadow-primary-500/30 flex justify-center items-center gap-2"
          >
            {isFetching ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Fetching...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Fetch Jira Requirements
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
