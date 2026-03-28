# Findings

## Research & Discoveries
- **UI Structure:** Requires a sidebar (TestingBuddy AI design) and a main content area with a 4-step wizard (Setup, Fetch Issues, Review, Test Plan).
- **Setup Requirements:** Needs Jira connection setup, as well as an LLM connection configuration (Ollama, Groq, xAI/Grok) up front.
- **Goal:** Fetch issue from Jira, feed requirements to the LLM, and generate a Test Plan in the provided template format.
- **Tech Stack:** TypeScript, React (Next.js), to be deployed on Vercel.

## Constraints
- POC currently focuses on Jira integration but must scale to ADO, X-Ray, etc.
- Must support Dark and Light themes.
