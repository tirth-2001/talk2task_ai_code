# 🔥 **TALK2TASK AI — FULL SYSTEM SUMMARY FOR AI IMPLEMENTATION**

---

# 1️⃣ **Product Vision**

**Talk2Task AI** is an agentic platform that transforms unstructured meeting inputs (summaries, transcripts, chats, emails, notes) into **structured actions**, such as:

- Tasks with owners
- Risks
- Decisions
- MoM
- Slack reminders
- Calendar events
- Jira tickets

It also features an **Automation Studio** for creating custom workflows that run autonomously based on triggers and conditions.

---

# 2️⃣ **Core Functional Pillars**

### **A. Input Understanding**

System ingests:

- Meeting summaries (Copilot, Gemini, Otter, Teams, Meet)
- Transcripts
- Chat messages (Slack, Teams)
- Emails
- Manual notes
- Calendar metadata

### **B. AI Interpretation**

Pipeline extracts:

- Tasks
- Decisions
- Owners
- Due dates
- Risks + risk type
- Keywords + context

### **C. Workflow Automation**

Automation Studio allows:

- Node-based flow creation
- Drag-and-drop input → AI → condition → action pipeline
- Conditional branching (IF task contains risk → send alert)
- Multi-step workflows
- Execution toggles, test mode, save mode, edit mode

### **D. Agentic Actions**

AI performs output actions:

- Send Slack messages
- Create Jira tickets
- Schedule follow-up meetings
- Send emails
- Trigger reminders
- Escalate risks

### **E. Centralized Dashboard**

Shows:

- Total tasks
- Risks
- Meetings processed
- Deadlines
- Charts (status, risk distribution)
- Recent meetings

---

# 3️⃣ **UI → Function Mapping (Based on Your 9 Screens)**

For the AI agent building the app, each screen represents a functional module:

| PDF Screen | Functional Component  | What to Implement                                                 |
| ---------- | --------------------- | ----------------------------------------------------------------- |
| **Page 1** | Input Selection       | UI for “Paste notes”, “Upload file”, “Choose source”.             |
| **Page 2** | Input Form            | Text editor + summary input + metadata extraction.                |
| **Page 3** | AI Processing         | Loading page + extraction pipeline + spinner + intermediate logs. |
| **Page 4** | Task Table            | Task list with owners, due dates, risk tags, priorities.          |
| **Page 5** | MoM Generation        | Auto-formatted MoM template (decisions, notes, action items).     |
| **Page 6** | Slack Reminder        | Output preview → Slack API integration.                           |
| **Page 7** | Follow-Up Suggestions | AI agent suggestions → buttons to trigger actions.                |
| **Page 8** | Dashboard             | Charts, graphs, recent meetings, deadlines, tasks.                |
| **Page 9** | Automation Studio     | Visual workflow builder (nodes, lines, triggers, actions).        |

---

# 4️⃣ **High-Level Technical Architecture**

### **Core Components**

```
Frontend: React with Typescript
Backend: Node.js with Typescript
AI Layer: LLM (OpenAI GPT / Gemini / Llama)
Agent Layer: MCP tooling for external APIs
DB: MongoDB
Message Queue: Redis (for workflows)
```

---

# 5️⃣ **System Architecture Flow (Step-by-Step)**

### **1. Input Layer (Connectors)**

- Slack
- Teams
- Google Calendar
- Outlook Calendar
- Email
- Manual uploads

These connect via:

- Webhooks
- REST APIs
- OAuth

### **2. Ingestion Layer**

- Normalizes input into JSON
- Extracts metadata (title, attendees, time)
- Cleans formatting

### **3. AI Core**

- Prompt template: “Extract tasks, owners, dates, decisions, risks…”
- LLM performs:
  - NER
  - Intent parsing
  - Temporal reasoning
  - Responsibility extraction (who owns what)
  - Risk classification
  - Decision boundary detection

### **4. Extraction Engine**

Post processing ensures:

- Validation
- Consistent structure
- Duplicate merging
- Date normalization
- Owner resolving (Jon vs John Doe)

### **5. Workflow Orchestration Engine**

Node-based runner:

```
Trigger → AI Step → Condition → Action → Next Action
```

Supports:

- Branching
- Looping
- Wait conditions
- API actions

### **6. MCP Action Layer**

MCP (Model Context Protocol) enables the agent to act safely:

- MCP Tool: Slack
- MCP Tool: Jira
- MCP Tool: Email
- MCP Tool: Calendar
- MCP Tool: Task DB

MCP ensures:

- safe sandboxed execution
- explicit permissions
- consistent interfaces

### **7. Data Layer**

Stores:

- Meetings
- Tasks
- Actions performed
- Workflow definitions
- Execution logs
- Users & settings

---

# 6️⃣ **Data Models (High-Level)**

### **Task Object**

```json
{
  "id": "string",
  "title": "string",
  "owner": "string",
  "dueDate": "date",
  "priority": "low|medium|high",
  "risk": "none|timeline|dependency|resource",
  "sourceMeetingId": "string",
  "status": "open|in_progress|done"
}
```

### **Meeting Object**

```json
{
  "id": "string",
  "title": "string",
  "datetime": "timestamp",
  "attendees": ["string"],
  "summary": "text",
  "tasksExtracted": ["taskId"],
  "risksFound": "number"
}
```

### **Workflow Definition**

```json
{
  "nodes": [ ... ],
  "edges": [ ... ],
  "triggers": ["meeting_end", "new_summary"],
  "actions": ["slack_reminder", "jira_ticket", "email"]
}
```

---

# 7️⃣ **Automation Studio Implementation Plan**

### **A. Node Types**

- Trigger node
- Input node
- AI extraction node
- Condition node
- Slack action node
- Jira action node
- Email action node
- Calendar action node

### **B. Editor Features**

- Drag & drop
- Connect nodes with arrows
- Save workflow
- Test workflow
- Enable/disable toggle
- Execution logs

### **C. Execution Runtime**

Workflow runner should:

- execute nodes sequentially
- evaluate condition branches
- call MCP action tools
- return statuses
- retry failures
- log each step

---

# 8️⃣ **Backend APIs to Implement**

### **Meeting / Input Handling**

- POST `/ingest`
- GET `/meeting/:id`

### **AI Processing**

- POST `/process`

### **Task Management**

- GET `/tasks`
- PATCH `/tasks/:id`

### **MoM**

- GET `/mom/:meetingId`

### **Automation Workflow**

- POST `/workflow`
- GET `/workflow/:id`
- POST `/workflow/:id/run`

### **Integrations**

- Slack: MCP tool → message.post
- Jira: MCP tool → ticket.create
- Email: MCP tool → send.mail
- Calendar: MCP tool → create.event

---

# 9️⃣ **Agent Behavior Instructions (Important!)**

### The AI agent should:

- Always extract structured JSON
- Always produce consistent field formats
- Detect missing owners and label “Unassigned”
- Infer due dates when possible, otherwise null
- Summarize risks under defined risk categories
- Validate task clarity (e.g., “Follow up with client” is OK; “Check this” is not)
- Never hallucinate facts — only use provided input
- Avoid over-automation unless configured in workflow

---

# 🔟 **End-to-End Execution Example**

### User uploads a meeting summary

→ ingestion → AI extraction → task list → MoM
→ suggestions screen
→ workflow checks risk = yes
→ automation sends Slack reminder to owner
→ logs stored
→ task appears in dashboard

---

# 1️⃣1️⃣ **Implementation Roadmap**

### **Phase 1 (MVP)**

- Input ingestion
- AI extraction
- Task view
- MoM
- Slack reminders
- Dashboard

### **Phase 2**

- Workflow studio
- Conditions + branching
- Jira + Email integrations

### **Phase 3**

- Multi-agent orchestration
- User-level permissions
- Analytics + insights
- Marketplace for ready-made workflows

---

# ✅ **This is the complete system blueprint.**

If you want, I can also provide:

✔ API contract in full detail
✔ MCP tool definitions
✔ User stories (Jira-ready)
✔ Detailed database schema
✔ Architecture diagram visuals
✔ Prompts for AI extraction
✔ Automation Studio data model
✔ Complete PRD (Product Requirements Document)

Just tell me!
