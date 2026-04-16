# Findings

## Research
- QA Engineers need a dedicated tool to generate formatted Jira test cases from raw Jira requirements.
- The UI contains two main interfaces:
  - **Main View**: History sidebar, Output area (center) for the generated test case, Input area (bottom) for pasting requirements.
  - **Settings View**: Inputs/settings for Ollama, Groq, OpenAI, Claude, LM Studio, and Gemini, along with a Save button and a Test Connection button.

## Discoveries
- Based on the `Design.png` mockup, the user flow is straightforward and chat-like. 
- Output test cases must strictly adhere to Jira format, meaning the LLM system prompt will need explicit formatting instructions.

## Constraints
- **Privacy vs Cloud APIs**: The constraint "no data sent over the internet for privacy reasons" implies that local LLMs (Ollama, LM Studio) must be heavily prioritized and likely the default options. Integrating OpenAI, Groq, Claude, and Gemini inherently sends data over the internet, so these should be clearly marked or understood as optional for users without strict offline constraints.
