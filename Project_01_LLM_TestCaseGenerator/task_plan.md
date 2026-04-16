# Task Plan - LLM TestCaseGenerator

## Phase 1: Discovery & Initialization
- [x] Understand project requirements and constraints
- [x] Answer discovery questions
- [ ] Finalize and approve the blueprint

## Blueprint
### Purpose & Scope
- **Application**: LLM Test Case Generator (API & Web Application test cases, Functional & Non-functional).
- **End Users**: QA Engineers.

### Input & Output
- **Input**: Jira requirements provided via copy-paste or chat interface.
- **Output**: Test cases formatted exactly for Jira.

### Technology Stack
- **Backend**: Node.js with TypeScript.
- **Frontend**: React.
- **LLM Integrations**: Ollama, LM Studio, Groq, OpenAI, Claude, Gemini.

### Core Workflows & Features
1. **Chat UI**: Users input Jira requirements into a chatbox.
2. **History Sidebar**: View previously generated test cases.
3. **Generation Engine**: Generate test cases using the selected LLM provider.
4. **Settings UI**: Configure API keys (or local URLs) for LLM providers, "Test Connection", and "Save".

### Constraints & Edge Cases
- **Privacy Constraint Note**: Primary requirement states "no data sent over the internet for privacy reasons." This implies local models (Ollama, LM Studio) will be heavily utilized for strict privacy. Cloud integrations (OpenAI, Claude, Groq, Gemini) will be available as optional configurations for scenarios where privacy constraints allow internet data transmission.

---

## Phase 2: Setup & Environment
- [ ] Initialize Node.js & TypeScript backend.
- [ ] Initialize React frontend.
- [ ] Setup testing framework.

## Phase 3: Core Implementation
- [ ] Implement Settings UI & Local Storage (API keys, test connection).
- [ ] Implement LLM Integration Service (supporting all 6 providers).
- [ ] Implement main Chat UI and History sidebar.
- [ ] Implement test case generation prompt logic (Jira formatting).
