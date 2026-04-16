"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { DownloadCloud, FileText, ArrowLeft, File } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun } from "docx";

interface Step4Props {
  onBack: () => void;
}

export default function Step4Plan({ onBack }: Step4Props) {
  const [content, setContent] = useState('Generating or loading plan...');

  useEffect(() => {
    const saved = localStorage.getItem('testPlanner_generatedPlan');
    if (saved) {
      setContent(saved);
    }
  }, []);

  const exportDocx = () => {
    // Split by literal newline characters
    const lines = content.split('\n');
    const docChildren = lines.map(line => {
      // Basic markdown to docx paragraph mapping
      if (line.startsWith('# ')) {
        return new Paragraph({ 
          children: [new TextRun({ text: line.replace('# ', ''), bold: true, size: 32 })], 
          spacing: { after: 200 }
        });
      } else if (line.startsWith('## ')) {
        return new Paragraph({ 
          children: [new TextRun({ text: line.replace('## ', ''), bold: true, size: 28 })], 
          spacing: { before: 200, after: 120 }
        });
      } else if (line.startsWith('### ')) {
        return new Paragraph({ 
          children: [new TextRun({ text: line.replace('### ', ''), bold: true, size: 24 })], 
          spacing: { before: 120, after: 120 }
        });
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        return new Paragraph({ 
          children: [new TextRun({ text: "• " + line.substring(2) })], 
          indent: { left: 360 },
          spacing: { after: 100 }
        });
      } else if (line.trim() === '') {
        return new Paragraph({ children: [new TextRun({ text: "" })] });
      } else {
        return new Paragraph({ 
          children: [new TextRun({ text: line })], 
          spacing: { after: 120 }
        });
      }
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "Test Plan Generation Output", bold: true, size: 36 }),
            ],
            spacing: { after: 400 }
          }),
          ...docChildren
        ],
      }],
    });
    
    Packer.toBlob(doc).then(blob => {
      const docxBlob = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = window.URL.createObjectURL(docxBlob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = url;
      a.download = "Test_Plan.docx";
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    }).catch(error => {
      console.error("Failed to generate docx", error);
      alert("Failed to generate DOCX document. Check console for details.");
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 print-wrapper">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Review
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={exportDocx}
            className="flex items-center gap-2 px-4 py-2 border w-40 justify-center border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium shadow-sm"
          >
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400"/>
            Export DOCX
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm print:border-none print:shadow-none print:p-0 print:bg-transparent">
        <div className="prose dark:prose-invert prose-slate max-w-none print:text-black">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
