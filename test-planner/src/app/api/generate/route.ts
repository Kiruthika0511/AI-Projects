import { NextResponse } from 'next/server';

const TEMPLATE = `
1. Objective
2. Scope
3. Inclusions
4. Test Environments
5. Defect Reporting Procedure
6. Test Strategy
7. Test Schedule
8. Test Deliverables
9. Entry and Exit Criteria
`;

export async function POST(request: Request) {
  try {
    const { provider, host, apiKey, model, issues, context } = await request.json();

    const issuesContext = issues.map((i: any) => `ID: ${i.id}\nType: ${i.type}\nStatus: ${i.status}\nSummary: ${i.summary}\nDescription: ${i.description}`).join('\n\n');

    const prompt = `You are an expert QA Test Planner representing the Intelligent Test Planner Agent. Generate a comprehensive Test Plan based on the following Jira Issues and additional context. 
    
Ensure the output STRICTLY follows this template structure and format it cleanly in Markdown:
${TEMPLATE}

Additional Context:
${context || 'None provided'}

Jira Issues to include:
${issuesContext}

Generate the Markdown Test Plan now. Only output the Markdown content, no conversational filler. Do not include phrases like "Here is the test plan". Just output the Markdown directly starting with the Objective.`;

    let generatedText = '';

    if (provider === 'groq') {
       if (!apiKey) throw new Error('Groq API Key is missing. Ensure you setup the API key in Step 1.');
       const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model || "llama-3.1-8b-instant", 
            messages: [{ role: "user", content: prompt }]
          })
       });
       if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || 'Error calling Groq API');
       }
       const data = await res.json();
       generatedText = data.choices[0].message.content;

    } else {
       // Ollama
       if (!host) throw new Error('Ollama Host is missing. Ensure you provided the host in Step 1.');
       const cleanHost = host.endsWith('/') ? host.slice(0, -1) : host;
       const res = await fetch(`${cleanHost}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             model: "llama3", 
             prompt: prompt,
             stream: false
          })
       });
       if (!res.ok) {
          throw new Error('Error calling Ollama API. Ensure Ollama is running and accessible at the provided host.');
       }
       const data = await res.json();
       generatedText = data.response;
    }

    return NextResponse.json({ markdown: generatedText });

  } catch (error: any) {
    console.error("LLM Generation Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate test plan' }, { status: 500 });
  }
}
