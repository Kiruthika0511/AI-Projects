import { useState, useEffect } from 'react';
import { Settings, MessageSquare, Plus, Sparkles, Folder, Send } from 'lucide-react';
import { SettingsModal } from './components/SettingsModal';
import { defaultSettings } from './types';
import type { AppSettings, TestCase } from './types';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('aiTesterSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  
  const [history, setHistory] = useState<TestCase[]>(() => {
    const saved = localStorage.getItem('aiTesterHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentInput, setCurrentInput] = useState('');
  const [activeTest, setActiveTest] = useState<TestCase | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('aiTesterSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('aiTesterHistory', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!currentInput.trim() || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
        const response = await fetch('http://localhost:3001/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                provider: settings.defaultProvider,
                requirement: currentInput,
                keys: {
                    ollamaUrl: settings.ollamaUrl,
                    ollamaModel: settings.ollamaModel,
                    lmStudioUrl: settings.lmStudioUrl,
                    groqKey: settings.groqKey,
                    openAiKey: settings.openAiKey,
                    claudeKey: settings.claudeKey,
                    geminiKey: settings.geminiKey
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Generation failed');
        }

        const data = await response.json();

        const newTestCase: TestCase = {
            id: Date.now().toString(),
            requirement: currentInput,
            provider: settings.defaultProvider,
            timestamp: Date.now(),
            response: data.result || 'No response generated.'
        };

        setHistory(prev => [newTestCase, ...prev]);
        setActiveTest(newTestCase);
        setCurrentInput('');
    } catch (error: any) {
        alert(`Error generating test case: ${error.message}`);
    } finally {
        setIsGenerating(false);
    }
  };

  const startNewTest = () => {
      setActiveTest(null);
      setCurrentInput('');
  };

  const exportToWord = async (testInfo: TestCase | null) => {
      if (!testInfo) return;
      const doc = new Document({
          sections: [{
              properties: {},
              children: testInfo.response.split('\n').map(line => new Paragraph({
                  children: [
                      new TextRun({
                          text: line,
                          bold: line.startsWith('**') || line.startsWith('#'),
                          size: line.startsWith('#') ? 28 : 22,
                      }),
                  ],
              })),
          }],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `TestGenAI_${testInfo.id}.docx`);
  };

  const exportToExcel = (testInfo: TestCase | null) => {
      if (!testInfo) return;
      const lines = testInfo.response.split('\n').map(line => [line]);
      const ws = XLSX.utils.aoa_to_sheet(lines);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Test Cases");
      XLSX.writeFile(wb, `TestGenAI_${testInfo.id}.xlsx`);
  };

  return (
    <div className="flex h-screen w-full bg-[#0E131F] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-[#151B2B] border-r border-[#1F293F] flex flex-col shadow-xl z-10 relative">
        <div className="p-6 border-b border-[#1F293F]">
             <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                TestGen AI
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Smart Test Case Generation</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
            <div className="space-y-2 mb-8">
                <button 
                    onClick={startNewTest}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1E273C] text-slate-300 hover:text-white font-medium transition-all w-full border border-transparent shadow-sm"
                >
                    <Plus size={18} className="text-blue-400" />
                    Generator
                </button>

                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1E273C] text-slate-300 hover:text-white font-medium transition-all w-full border border-transparent shadow-sm"
                >
                    <Settings size={18} className="text-slate-400" />
                    Settings
                </button>
            </div>

            {/* History Folder Section at Bottom Left */}
            <div className="mt-auto pt-4 border-t border-[#1F293F]">
                <button 
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1E273C] w-full text-left transition-colors mb-2"
                >
                    <Folder size={18} className={isHistoryOpen ? "text-blue-400 fill-blue-400/20" : "text-slate-400"} />
                    <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">History</span>
                </button>
                
                {isHistoryOpen && (
                    <div className="space-y-1 max-h-64 overflow-y-auto pl-2 pr-1 custom-scrollbar">
                        {history.length === 0 ? (
                            <div className="text-xs text-slate-500 px-2 italic text-center py-4">No tests generated yet.</div>
                        ) : (
                            history.map(test => (
                                <button 
                                    key={test.id}
                                    onClick={() => setActiveTest(test)}
                                    className={`flex flex-col items-start gap-1 p-2.5 rounded-xl transition-all w-full text-left border ${activeTest?.id === test.id ? 'bg-[#1E273C] border-blue-500/30 shadow-sm' : 'hover:bg-[#1E273C] border-transparent'}`}
                                >
                                    <div className="flex items-center gap-2 w-full text-slate-300">
                                        <MessageSquare size={14} className={activeTest?.id === test.id ? 'text-blue-400' : 'text-slate-500'} />
                                        <span className="text-xs font-semibold truncate leading-tight w-full">
                                            {test.requirement}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 ml-5 pl-0.5 font-medium">{new Date(test.timestamp).toLocaleTimeString()} • {test.provider}</span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0D14]">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-8 border-b border-[#1F293F] bg-[#0A0D14]/80 backdrop-blur-md z-10 sticky top-0">
            <h1 className="text-sm font-bold text-slate-500 tracking-wide uppercase flex items-center gap-3">
                {activeTest ? 'View Test Case' : 'Create New Test Case'}
            </h1>
            <div className="flex items-center gap-4">
                 <div className="relative flex items-center group">
                    <select
                        value={settings.defaultProvider}
                        onChange={(e) => setSettings({ ...settings, defaultProvider: e.target.value as any })}
                        className="appearance-none pl-7 pr-7 py-1.5 bg-[#151B2B] hover:bg-[#1E273C] text-blue-400 text-xs font-bold rounded-lg border border-[#1F293F] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors shadow-sm cursor-pointer"
                    >
                        <option value="ollama">OLLAMA (Local)</option>
                        <option value="lmstudio">LM STUDIO</option>
                        <option value="groq">GROQ</option>
                        <option value="openai">OPENAI</option>
                        <option value="claude">CLAUDE</option>
                        <option value="gemini">GEMINI</option>
                    </select>
                    <span className="absolute left-2.5 flex h-2 w-2 pointer-events-none">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="absolute right-2.5 text-blue-500 pointer-events-none text-[8px] transform -translate-y-[1px]">▼</span>
                </div>
            </div>
          </header>

          {/* Output Area */}
          <main className="flex-1 overflow-y-auto p-8 relative flex shadow-inner custom-scrollbar">
             {!activeTest && !isGenerating ? (
                 <div className="m-auto text-center flex flex-col items-center justify-center max-w-md animate-in fade-in zoom-in duration-500">
                     <div className="h-20 w-20 bg-[#151B2B] rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-[#1F293F] text-blue-400">
                        <Sparkles size={36} />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-200 mb-2 tracking-tight">Ready to generate testing magic.</h2>
                     <p className="text-slate-500 leading-relaxed text-sm">Paste your Jira requirement or user story below to instantly structural test cases using your chosen AI model.</p>
                 </div>
             ) : isGenerating ? (
                 <div className="m-auto flex flex-col items-center gap-4 animate-pulse">
                     <div className="h-12 w-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                     <span className="text-blue-400 font-medium tracking-wide">Synthesizing Jira Test Case...</span>
                 </div>
             ) : (
                <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-[#151B2B] p-6 rounded-2xl shadow-lg border border-[#1F293F]">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Original Requirement</div>
                        <div className="text-slate-300 font-medium bg-[#0A0D14] p-4 rounded-xl border border-[#1F293F]">
                            {activeTest?.requirement}
                        </div>
                    </div>
                    <div className="bg-[#151B2B] p-8 rounded-2xl shadow-lg border border-[#1F293F] min-h-[400px]">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 border-b border-[#1F293F] pb-3 flex justify-between items-center">
                            <span>Generated Test Case</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => exportToWord(activeTest)} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-md font-semibold transition-colors shadow-sm cursor-pointer z-20 relative">Word</button>
                                <button onClick={() => exportToExcel(activeTest)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-md font-semibold transition-colors shadow-sm cursor-pointer z-20 relative">Excel</button>
                                <span className="ml-2 text-blue-400 bg-blue-900/20 border border-blue-500/20 px-2.5 py-1 rounded-md lowercase tracking-normal font-semibold shadow-inner">via {activeTest?.provider}</span>
                            </div>
                        </div>
                        <div className="markdown-output text-sm text-slate-300 leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {activeTest?.response || ''}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
             )}
          </main>

          {/* Input Box */}
          <div className="p-6 bg-[#151B2B] border-t border-[#1F293F] shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.5)] z-10">
              <div className="max-w-4xl mx-auto flex gap-4 relative items-end">
                 <textarea 
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    className="flex-1 p-4 pr-16 rounded-2xl border-2 border-[#2A344A] bg-[#0A0D14] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all shadow-inner text-slate-200 placeholder:text-slate-600 min-h-[60px] max-h-[200px]"
                    rows={1}
                    placeholder="Ask here or paste Jira requirements..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleGenerate();
                        }
                    }}
                 />
                 <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !currentInput.trim()}
                    className="absolute right-3 bottom-3 p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-[#2A344A] disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-md group"
                    title="Generate Test Case"
                 >
                    <Send size={20} className="transform translate-x-[1px] translate-y-[-1px] group-hover:-translate-y-[2px] group-hover:translate-x-[2px] transition-transform" />
                 </button>
              </div>
          </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onSave={setSettings}
      />
    </div>
  );
}

export default App;
