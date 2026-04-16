# Project Constitution (gemini.md)

## Data Schemas
(Pending Confirmation)

### `JiraIssueSchema`
```json
{
  "issueKey": "string",
  "summary": "string",
  "description": "string",
  "acceptanceCriteria": "string"
}
```

### `TestPlanPayloadSchema`
```json
{
  "objective": "string",
  "scope": "string",
  "inclusions": "string",
  "testEnvironments": "array of strings",
  "defectReportingProcedure": "string",
  "testStrategy": "string",
  "testSchedule": "string",
  "testDeliverables": "array of strings",
  "entryAndExitCriteria": "string"
}
```

## Behavioral Rules
- System must ask for LLM Configuration (Ollama, Groq) first, followed by Jira Configuration.
- Support Light and Dark Modes.
- Strictly follow the 4-step flow: 1. Setup, 2. Fetch Issues, 3. Review, 4. Test Plan.
- Use Next.js/React with TypeScript to ensure Vercel compatibility.
- The final generated Test Plan must have an option to export it to `.docx` and `.pdf` formats using the provided template structure.

## Architectural Invariants
- Frontend is decoupled from direct database reliance (store configs locally or via lightweight secure storage for POC).
- Integrations must test handshake before proceeding.
