"use client";

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 rounded-3xl p-10 text-white shadow-xl mb-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-700"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-700"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-blue-50 text-xs font-bold tracking-widest mb-6 border border-white/20 shadow-sm backdrop-blur-md">
            <span className="text-yellow-300 text-sm">✨</span> AI-POWERED QA PLATFORM
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white drop-shadow-sm leading-tight text-left">
            Build smarter test strategies with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-200">AI-driven precision.</span>
          </h1>
          <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 mt-8 shadow-lg transition-all hover:bg-white/15">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl animate-bounce transform origin-bottom text-left">👋</span>
              <p className="text-2xl font-bold tracking-tight text-left">Welcome back!</p>
            </div>
            <p className="text-blue-50/90 mb-5 text-lg leading-relaxed max-w-3xl text-left">
              Your QA workspace is ready. Sync your Jira projects, configure your AI engine, and instantly turn requirements into structured test plans and detailed test cases.
            </p>
            <div className="inline-block px-4 py-2 bg-indigo-900/40 rounded-lg border border-indigo-500/30">
              <p className="text-sm text-cyan-100 font-semibold tracking-wide uppercase text-left">
                Move from manual effort to intelligent automation—designed for speed, accuracy, and scalability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
