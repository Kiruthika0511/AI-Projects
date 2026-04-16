export type LLMProvider = 'ollama' | 'lmstudio' | 'groq' | 'openai' | 'claude' | 'gemini';

export interface GenerateOptions {
    provider: LLMProvider;
    requirement: string;
    keys: {
        ollamaUrl: string;
        ollamaModel?: string;
        lmStudioUrl: string;
        groqKey: string;
        openAiKey: string;
        claudeKey: string;
        geminiKey: string;
    }
}

const generatePrompt = (requirement: string) => `
You are an expert QA Engineer. 
Based on the following requirement, generate a comprehensive suite of BOTH Functional and Non-Functional test cases.

Important: Format the output strictly using Markdown Tables. Create separate tables for Functional and Non-Functional test cases.
For each table, include the following columns:
| Test ID | Scenario Type | Summary | Priority | Preconditions | Steps | Expected Results |

Requirement:
"${requirement}"
`;

export const generateTestCase = async (options: GenerateOptions): Promise<string> => {
    const { provider, requirement, keys } = options;
    const prompt = generatePrompt(requirement);

    try {
        switch (provider) {
            case 'ollama':
                return await fetchOllama(keys.ollamaUrl, keys.ollamaModel || 'llama3', prompt);
            case 'lmstudio':
                return await fetchLMStudio(keys.lmStudioUrl, prompt);
            case 'groq':
                return await fetchGroq(keys.groqKey, prompt);
            case 'openai':
                return await fetchOpenAI(keys.openAiKey, prompt);
            case 'claude':
                return await fetchClaude(keys.claudeKey, prompt);
            case 'gemini':
                return await fetchGemini(keys.geminiKey, prompt);
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    } catch (error: any) {
        console.error(`Error with provider ${provider}:`, error);
        throw new Error(`Failed to generate via ${provider}: ${error.message}`);
    }
};

async function fetchOllama(url: string, model: string, prompt: string): Promise<string> {
    const res = await fetch(`${url.replace(/\/$/, '')}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: model, 
            prompt: prompt,
            stream: false
        })
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Ollama API error: ${errText || res.statusText}`);
    }
    const data = await res.json();
    return data.response;
}

// LM Studio uses an OpenAI-compatible API format usually mapped to /v1/chat/completions
async function fetchLMStudio(url: string, prompt: string): Promise<string> {
    const res = await fetch(`${url.replace(/\/$/, '')}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'local-model', 
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3
        })
    });
    if (!res.ok) throw new Error(`LM Studio API error: ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content;
}

async function fetchGroq(key: string, prompt: string): Promise<string> {
    if (!key) throw new Error('Groq API Key is missing');
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
            model: 'llama3-8b-8192', 
            messages: [{ role: 'user', content: prompt }]
        })
    });
    if (!res.ok) throw new Error(`Groq API error: ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content;
}

async function fetchOpenAI(key: string, prompt: string): Promise<string> {
    if (!key) throw new Error('OpenAI API Key is missing');
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        })
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content;
}

async function fetchClaude(key: string, prompt: string): Promise<string> {
    if (!key) throw new Error('Claude API Key is missing');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1500,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    if (!res.ok) throw new Error(`Claude API error: ${res.statusText}`);
    const data = await res.json();
    return data.content[0].text;
}

async function fetchGemini(key: string, prompt: string): Promise<string> {
    if (!key) throw new Error('Gemini API Key is missing');
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });
    if (!res.ok) throw new Error(`Gemini API error: ${res.statusText}`);
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
}
