# Vertical Slice Implementation Plan
## Function-by-Function Delivery Strategy

**Date**: 2026-01-29
**Version**: 1.0
**Strategy**: Deliver complete, working features incrementally

---

## Philosophy: Vertical Slices Over Horizontal Layers

### **Traditional Approach** (Horizontal Layers - DON'T DO THIS)

```
Month 1: Build all databases
Month 2: Build all backend logic
Month 3: Build all frontend UI
→ Nothing works until month 3!
```

### **Our Approach** (Vertical Slices - DO THIS)

```
Week 2: Basic experiment works end-to-end ✓
Week 4: Context upload works end-to-end ✓
Week 6: Dataset extraction works end-to-end ✓
→ Always have working software!
```

**Benefits**:
- Demo progress every 2 weeks
- Get user feedback early
- Can ship anytime (not locked into full timeline)
- Reduces risk (find issues early)

---

## Complete Implementation Plan: 12 Weeks to Production

### **SLICE 1: Minimal Viable Experiment (Weeks 1-2)** ⭐ START HERE

#### **Goal**
User can run a simple pricing experiment and see results.

#### **Scope**
- Electron app shell
- Manual persona creation (3 personas)
- Simple experiment wizard (3 steps)
- Sequential execution (OpenAI GPT-4o-mini)
- Basic results display

#### **Features Included**

**1. Electron Setup**
```
npx create-electron-app unheard-desktop --template=vite-typescript
```
- Main process (Node.js)
- Renderer process (React + Vite)
- IPC bridge (contextBridge)
- Hot reload working

**2. Database Setup (Convex)**
```typescript
// Tables:
- users
- personas (manual creation)
- experiments
- experimentRounds
- experimentResponses
```

**3. UI Pages** (shadcn/ui + Tailwind)
```
/                    Home (Create Experiment button)
/personas/new        Create Persona form
/personas            Persona list
/experiments/new     Experiment wizard (3 steps)
/experiments/:id     Results page
```

**4. Core Components**
```
<PersonaForm />      Create/edit persona
<ExperimentWizard /> 3-step wizard:
                       Step 1: Basic info (name, hypothesis)
                       Step 2: Select personas (3)
                       Step 3: Write stimulus
<ResultsDashboard /> Show sentiment, responses
```

**5. Mastra Integration**
```typescript
// One agent: TinyPerson
const tinyPerson = new Agent({
  name: 'tiny-person',
  model: { provider: 'openai', name: 'gpt-4o-mini' },
  instructions: PERSONA_INSTRUCTIONS,
});

// Sequential execution (no parallelization yet)
for (const persona of personas) {
  const response = await tinyPerson.respond(persona, stimulus);
  // Save to Convex
}
```

#### **Demo Script**

```
1. User opens app
2. Creates persona: "Sarah, 35, CTO at startup"
3. Creates persona: "Mike, 42, VP Eng at enterprise"
4. Creates persona: "Lisa, 38, Director at mid-market"
5. Clicks "Create Experiment"
6. Wizard:
   - Name: "Test $50 pricing"
   - Hypothesis: "Developers will pay $50/mo"
   - Stimulus: "Imagine an API for background jobs at $50/mo. React?"
   - Select: Sarah, Mike, Lisa
7. Clicks "Run Experiment"
8. Progress: "Sarah responding... Mike responding... Lisa responding..."
9. Results (15 seconds later):
   - Sarah: 😊 Positive (0.7)
   - Mike: 😐 Neutral (0.5)
   - Lisa: 😞 Negative (0.3)
   - Overall: 50% positive
```

**User can run experiments! ✅**

#### **Implementation Checklist**

**Week 1**:
- [ ] Electron project setup (Vite + TypeScript)
- [ ] React Router setup
- [ ] shadcn/ui installation + theme configuration
- [ ] Convex setup (schema, client)
- [ ] Basic IPC handlers (ping/pong test)
- [ ] Home page with navigation

**Week 2**:
- [ ] Persona CRUD (Convex mutations + UI)
- [ ] Experiment wizard (3-step form)
- [ ] Mastra initialization (single TinyPerson agent)
- [ ] Experiment runner (sequential execution)
- [ ] Results page (display responses + sentiment)
- [ ] E2E test: Create personas → Run experiment → See results

**Deliverable**: Working demo ✓

---

### **SLICE 2: Context Upload & Generated Personas (Weeks 3-4)**

#### **Goal**
User uploads customer CSV → System generates 20 realistic personas automatically.

#### **What Gets Added to Slice 1**

**1. File Upload System**
```typescript
// IPC handlers
ipcMain.handle('context:upload', async (event, filePath) => {
  const parser = ParserFactory.getParser('csv');
  const parsed = await parser.parse(filePath);
  // Store in Convex
  return documentId;
});
```

**2. CSV Parser**
```typescript
// Detects schema automatically
{
  rows: 500,
  columns: ["Name", "Title", "Company", "Industry", "Deal Size"],
  detectedType: "customer_data"
}
```

**3. Persona Generator**
```typescript
// Generates diverse personas from CSV
await personaGenerator.generateFromCSV(csvData, {
  count: 20,
  diversity: 'high'
});
```

**4. UI Pages**
```
/context             Context library
/context/upload      File upload (drag & drop)
/personas            Updated with "Generate from CSV" button
```

#### **Demo Script**

```
1. User clicks "Upload Context"
2. Drags "B2B_Customers.csv" (500 rows)
3. System: "Processing... Detected 500 customers"
4. System: "Generate personas? [20 recommended]"
5. User clicks "Generate"
6. System: "Creating personas..." (30 seconds)
7. 20 personas appear with:
   - Real job titles from CSV
   - Realistic demographics
   - Source attribution: "From row 47 of B2B_Customers.csv"
8. User runs experiment (Slice 1 flow) with generated personas
9. Results are more realistic
```

**User can generate realistic personas! ✅**

#### **Implementation Checklist**

**Week 3**:
- [ ] File upload component (drag & drop)
- [ ] CSV parser implementation
- [ ] Schema detection logic
- [ ] Context document storage (Convex)
- [ ] Context library UI

**Week 4**:
- [ ] Persona generation agent
- [ ] Generate from CSV logic
- [ ] Source attribution
- [ ] Focus group auto-organization
- [ ] E2E test: Upload CSV → Generate personas → Run experiment

**Deliverable**: Realistic personas from real data ✓

---

### **SLICE 3: Dataset Extraction + Quality Dashboard (Weeks 5-6)**

#### **Goal**
After experiment, user gets structured dataset with quality metrics and can review extractions.

#### **What Gets Added to Slices 1-2**

**1. SSR Extractor**
```typescript
// Semantic Similarity Rating implementation
const ssrExtractor = new SSRExtractor(embedder);
const ratings = await ssrExtractor.extractRatings(responses, {
  scale: 'likert-5',
  referenceSets: PRICING_REFERENCES
});
```

**2. Conversation Extractor**
```typescript
// LLM-based extraction for open-ended responses
const conversationExtractor = new ConversationExtractor(llm);
const dataset = await conversationExtractor.extract(responses, schema);
```

**3. Extraction Observability**
```typescript
// Real-time monitoring
const monitor = new ExtractionMonitor();
monitor.onProgress((metrics) => {
  // Update UI with confidence scores, warnings
});
```

**4. Quality Dashboard**
```
/experiments/:id/extraction
  - Overall quality score
  - Field-by-field confidence
  - Low-confidence record list
  - Export dataset (CSV, JSON)
```

#### **Demo Script**

```
1. User runs experiment (10 personas, from Slice 2)
2. After responses collected:
   "Extracting dataset... 8/10 responses processed"
3. Quality dashboard appears:
   "✅ Quality: Good (85% confidence)
    ✅ 10 rows × 12 columns
    ⚠️  1 low-confidence record"
4. User clicks "View Low Confidence"
5. Shows: Mike's response was ambiguous
6. User selects: "Mark as unsure"
7. Dataset validated
8. Clicks "Export CSV"
9. Opens in Excel → Structured data ready!
```

**User gets validated datasets! ✅**

#### **Implementation Checklist**

**Week 5**:
- [ ] SSR extractor implementation
- [ ] Embedding service (OpenAI text-embedding-3-small)
- [ ] Reference statement creation
- [ ] Similarity calculation (cosine)
- [ ] Distribution mapping

**Week 6**:
- [ ] Conversation extractor (LLM)
- [ ] Observability layer (metrics, monitoring)
- [ ] Quality dashboard UI
- [ ] Low-confidence review UI
- [ ] Dataset export (CSV, JSON)
- [ ] E2E test: Experiment → Extraction → Quality review → Export

**Deliverable**: Observable dataset extraction ✓

---

### **SLICE 4: AutoDS/MCTS Discovery (Weeks 7-9)**

#### **Goal**
User triggers discovery on dataset → Gets surprising insights with statistical evidence.

#### **What Gets Added to Slices 1-3**

**1. MCTS Engine** (port from existing codebase)
```typescript
// Core MCTS algorithm
const mcts = new MCTSEngine({
  maxIterations: 100,
  explorationConstant: 1.414,
  dataset: validatedDataset,  // From Slice 3!
});
```

**2. Discovery Agents**
```typescript
// 5 agents:
- hypothesisGeneratorAgent: Proposes hypotheses
- experimentPlannerAgent: Generates Python code
- beliefElicitorAgent: Samples beliefs
- experimentAnalystAgent: Interprets results
- summaryGeneratorAgent: Human-readable summary
```

**3. Modal Integration**
```python
# Deploy Python sandbox
@app.function()
def execute_analysis(code: str, data: str):
    exec(code)  # Safe execution
    return results
```

**4. Discovery UI**
```
/discovery/:id           Discovery progress (live)
/discovery/:id/results   Insights + surprise scores
```

#### **Demo Script**

```
1. User completes pricing experiment (Slice 1)
2. Dataset extracted with 85% confidence (Slice 3)
3. User clicks "Run Discovery"
4. Discovery starts:
   "Exploring hypothesis 1/100...
    Found surprising pattern! (surprise: 0.82)"
5. Live updates:
   "Testing: Does job title affect willingness to pay?
    Running Python analysis...
    Result: VPs pay 40% more (p=0.01) ⭐ Surprising!"
6. After 2 minutes (100 iterations):
   "🎯 Top 3 Surprising Findings:
    1. VPs pay 40% more than CTOs (surprise: 0.89)
    2. Company size 50-200 is sweet spot (surprise: 0.73)
    3. Analytics required for $50+ (surprise: 0.61)"
7. User gets actionable recommendations with stats
```

**User discovers surprising insights! ✅**

#### **Implementation Checklist**

**Week 7**:
- [ ] Port MCTS engine from existing codebase
- [ ] Implement hypothesis generator agent
- [ ] Implement experiment planner agent (Python code gen)
- [ ] Basic belief update logic

**Week 8**:
- [ ] Modal setup and Python function deployment
- [ ] Code execution in sandbox
- [ ] Result parsing and interpretation
- [ ] Belief elicitor agent
- [ ] Analyst agent

**Week 9**:
- [ ] Discovery runner (orchestration)
- [ ] Discovery progress UI (live updates via IPC)
- [ ] Results page with surprise scores
- [ ] Summary generator agent
- [ ] E2E test: Dataset → Discovery → Insights

**Deliverable**: Working AutoDS discovery ✓

---

### **SLICE 5: Template System (Weeks 10-11)**

#### **Goal**
User can browse templates, customize variables, run experiments quickly, and save successful experiments as templates.

#### **What Gets Added**

**1. Template Library**
```
5 Official Templates:
- B2B SaaS Pricing Validation
- Feature Prioritization Survey
- Marketing Message Testing
- Competitive Analysis
- Open-Ended Discovery
```

**2. Template Customizer**
```typescript
// Simple form for variables
Template: "B2B SaaS Pricing"
Variables:
  - Product Name: [____]
  - Price Point: [$___]
  - Target Personas: [Select focus group ▼]
```

**3. Template CRUD**
```
Create: Save experiment as template
Read: Browse library
Update: Fork and modify
Delete: Remove personal templates
```

**4. UI Pages**
```
/                    Updated: Show templates on home
/templates           Template library
/templates/:id       Template customizer
/templates/new       Create from experiment
```

#### **Demo Script**

```
1. User opens app → Template library (home page)
2. Browses: "B2B SaaS Pricing Validation" (⭐ 4.8, used 247x)
3. Clicks template
4. Customizer shows 3 fields:
   - Product: "CloudQueue API"
   - Price: "$50"
   - Personas: "Enterprise Developers" (auto-selected)
5. Clicks "Run"
6. Experiment executes (Slices 1-3)
7. Discovery runs (Slice 4)
8. Results appear
9. User clicks "Save as Template"
10. Template saved to personal library
11. Next experiment: User runs template in 30 seconds
```

**User can reuse experiments! ✅**

#### **Implementation Checklist**

**Week 10**:
- [ ] Template data model (Convex)
- [ ] 5 official templates (JSON configs)
- [ ] Template CRUD operations
- [ ] Template library UI (browse, search)

**Week 11**:
- [ ] Template customizer component
- [ ] Variable substitution logic
- [ ] Save experiment as template
- [ ] Fork template feature
- [ ] E2E test: Select template → Customize → Run → Save new template

**Deliverable**: Template-driven workflow ✓

---

### **SLICE 6: AI Assistant (Weeks 12-13)** ⭐ GAME CHANGER

#### **Goal**
User describes goal → AI generates complete config → User runs experiment.

#### **What Gets Added**

**1. Enhanced Experiment Assistant Agent**
```typescript
const enhancedAssistant = new Agent({
  name: 'enhanced-assistant',
  model: { provider: 'openai', name: 'gpt-4o' },
  tools: [
    searchTemplateLibrary,
    getUserPersonas,
    validateConfig,
    estimateCost,
    forkTemplate,
  ],
});
```

**2. Conversation UI**
```
/assistant           Chat interface
/                    Updated: "Ask AI" button on home
```

**3. Template Matching**
```typescript
// AI searches templates based on user intent
User: "test pricing"
  → AI: searchTemplateLibrary({ query: "pricing validation" })
  → Suggests: "B2B SaaS Pricing Validation"
```

#### **Demo Script**

```
1. User clicks "Ask AI"
2. User types: "I want to test if developers will pay $50/mo for my API"
3. AI responds (3 seconds):
   "I found the perfect template: B2B SaaS Pricing Validation

    I just need:
    - Product name?"

4. User: "CloudQueue API"
5. AI:
   "Ready! I'll test CloudQueue API at $50/mo with your
    Developer focus group (12 personas).

    Using local AI (free, 10 seconds)

    [Run Experiment]"

6. User clicks "Run"
7. Experiment executes (Slices 1-4)
8. Results + Discovery appear
9. AI suggests: "Want to test tiered pricing?"
```

**User can design experiments conversationally! ✅**

#### **Implementation Checklist**

**Week 12**:
- [ ] Enhanced Assistant agent implementation
- [ ] 10 tool definitions (searchTemplateLibrary, etc.)
- [ ] Conversation state management
- [ ] Template matching logic
- [ ] Config generation from conversation

**Week 13**:
- [ ] Conversation UI (chat interface)
- [ ] Message streaming (real-time responses)
- [ ] Config preview component
- [ ] Integration with template system (Slice 5)
- [ ] E2E test: Conversation → Config → Run → Results

**Deliverable**: Conversational experiment design ✓

---

### **SLICE 7: LLM Optimization (10x Faster) (Weeks 14-15)**

#### **Goal**
Experiments run 10x faster and 50x cheaper with Ollama local + parallelization.

#### **What Gets Added**

**1. Multi-Provider System**
```typescript
// 3 providers:
- OllamaProvider (local, free, fast)
- ModalProvider (serverless, cheap)
- OpenAIProvider (cloud, quality)
```

**2. Worker Pool**
```typescript
// 10 parallel workers for local execution
const pool = new WorkerPool(10);
const responses = await pool.executeBatch(personas, stimulus);
// 10 personas in 2 seconds (was 20 seconds)
```

**3. Execution Optimizer**
```typescript
// Auto-select best strategy
optimizer.optimize(config, { intent: 'speed' });
  → Uses: Ollama + 10 workers
  → Result: 6 seconds, $0
```

**4. Settings UI**
```
/settings/models     LLM provider configuration
/settings/advanced   Worker pool size, concurrency limits
```

#### **Demo Script**

```
1. User runs same experiment from Slice 1
2. Before running, system asks:
   "Optimize for: ⚡ Speed / 💰 Cost / ✨ Quality?"
3. User selects "Speed"
4. System: "Using Ollama (local AI)
            10 personas in parallel
            Estimated: 6 seconds, $0"
5. User clicks "Run"
6. Experiment completes in 6 seconds (was 60 seconds!)
7. Quality: 90% of GPT-4o results
8. Cost: $0 (was $0.03)
```

**10x faster, 50x cheaper! ✅**

#### **Implementation Checklist**

**Week 14**:
- [ ] Ollama provider implementation
- [ ] Modal provider implementation
- [ ] Worker pool (Node.js worker threads)
- [ ] Rate limiter
- [ ] Cost tracker

**Week 15**:
- [ ] Execution optimizer
- [ ] Settings UI (model selection)
- [ ] Intent selector component
- [ ] Benchmarking (measure speedup)
- [ ] E2E test: Ollama parallel vs OpenAI sequential

**Deliverable**: 10x performance improvement ✓

---

### **SLICE 8: Advanced Features (Weeks 16-17)**

#### **Goal**
Production-ready: Attio CRM, team collaboration, polish.

#### **What Gets Added**

**1. Attio CRM Connector**
```typescript
// OAuth flow + sync
const attio = new AttioConnector({ accessToken });
await attio.sync();
// 347 contacts → 20 personas
```

**2. Workspaces (Team Collaboration)**
```
/workspaces          Team workspace management
/templates           Updated: Show team templates
```

**3. Polish**
- System tray integration
- Desktop notifications
- Dark mode (auto-detect)
- Keyboard shortcuts (⌘K command palette)
- Onboarding wizard

#### **Demo Script**

```
1. User clicks "Connect CRM"
2. Attio OAuth flow (30 seconds)
3. System: "Synced 347 contacts. Create personas?"
4. 20 personas generated automatically
5. User invites team member
6. Team member sees shared personas + templates
7. Both can collaborate on experiments
```

**Production-ready! ✅**

#### **Implementation Checklist**

**Week 16**:
- [ ] Attio connector (OAuth + sync)
- [ ] Workspaces (team model)
- [ ] Template sharing
- [ ] Persona sharing

**Week 17**:
- [ ] System tray
- [ ] Notifications
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Onboarding wizard
- [ ] Final polish + bug fixes

**Deliverable**: Ship to users ✓

---

## Complete Timeline Summary

```
┌──────────────────────────────────────────────────────────┐
│  MONTH 1: Core Experiment Flow                            │
├──────────────────────────────────────────────────────────┤
│  Week 1-2: SLICE 1 - Basic Experiment                    │
│    → Demo: Manual personas → Experiment → Results        │
│                                                           │
│  Week 3-4: SLICE 2 - Context & Generated Personas        │
│    → Demo: Upload CSV → 20 personas → Realistic results  │
│                                                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  MONTH 2: Data Quality & Discovery                        │
├──────────────────────────────────────────────────────────┤
│  Week 5-6: SLICE 3 - Dataset Extraction                  │
│    → Demo: Structured dataset with quality dashboard     │
│                                                           │
│  Week 7-9: SLICE 4 - AutoDS Discovery ⭐                 │
│    → Demo: Surprising insights with stats                │
│                                                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  MONTH 3: UX Magic & Optimization                         │
├──────────────────────────────────────────────────────────┤
│  Week 10-11: SLICE 5 - Templates                         │
│    → Demo: 30-second experiments via templates           │
│                                                           │
│  Week 12-13: SLICE 6 - AI Assistant ⭐                   │
│    → Demo: "Test pricing" → Complete experiment          │
│                                                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  MONTH 4: Polish & Ship                                   │
├──────────────────────────────────────────────────────────┤
│  Week 14-15: SLICE 7 - Optimization (10x faster)         │
│    → Demo: Same experiment, 10x faster, free             │
│                                                           │
│  Week 16-17: SLICE 8 - Advanced (CRM, Teams, Polish)     │
│    → Demo: Production-ready app                          │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**Total: 17 weeks (4 months)**

---

## Aggressive Alternative: 6-Week MVP

If you want to ship faster:

```
MONTH 1 (Weeks 1-2): SLICE 1
MONTH 1.5 (Weeks 3-4): SLICE 2 + Simplified SLICE 3
MONTH 2 (Weeks 5-6): Simplified SLICE 4 (Basic AutoDS, no full MCTS)

→ SHIP MVP at Week 6
→ Users can: Upload CSV → Run experiment → Get basic insights

THEN add remaining slices post-launch
```

---

## Design System Specification

### **Component Library: shadcn/ui**

Already includes all components you need:
```
✅ Button, Input, Textarea, Select
✅ Card, Sheet, Dialog, Alert
✅ Table, Progress, Skeleton
✅ Badge, Tabs, Tooltip
✅ Command (⌘K palette)
✅ Form components (React Hook Form integration)
```

**Installation**:
```bash
npx shadcn-ui@latest init
```

### **Theme Configuration**

```typescript
// tailwind.config.ts

export default {
  darkMode: ['class'],  // Support dark mode
  content: ['./renderer/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... shadcn default theme
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### **Global Styles**

```css
/* renderer/src/index.css */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;
    /* ... rest of theme variables */
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}

body {
  @apply bg-background text-foreground;
  font-feature-settings: 'rlig' 1, 'calt' 1;
}
```

---

## Recommended Tech Stack (Final)

```typescript
{
  "name": "unheard-desktop",
  "version": "1.0.0",
  "main": "dist-electron/main.js",

  "dependencies": {
    // Electron
    "electron": "^28.0.0",

    // React
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",

    // State Management
    "zustand": "^4.4.7",

    // Forms & Validation
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",

    // UI Components
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    // ... other Radix primitives (shadcn uses these)
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "lucide-react": "^0.294.0",

    // Styling
    "tailwindcss": "^4.0.0",
    "tailwindcss-animate": "^1.0.7",

    // Database
    "convex": "^1.7.0",
    "better-sqlite3": "^9.2.2",

    // Mastra
    "@mastra/core": "latest",
    "@mastra/storage": "latest",

    // LLM Providers
    "openai": "^4.24.0",
    "@anthropic-ai/sdk": "^0.9.0",
    "@modal-labs/modal": "latest",

    // Context System
    "pdf-parse": "^1.1.1",
    "xlsx": "^0.18.5",
    "csv-parse": "^5.5.0",
    "mammoth": "^1.6.0",
    "@pinecone-database/pinecone": "^1.1.0",
    "tiktoken": "^1.0.10",

    // Utilities
    "axios": "^1.6.2",
    "date-fns": "^3.0.0",
    "keytar": "^7.9.0"
  },

  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "electron-builder": "^24.9.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## Design System Quick Reference

### **Component Usage Examples**

```tsx
// Button variants
<Button>Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>

// Cards
<Card>
  <CardHeader>
    <CardTitle>Experiment Results</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// Forms
<Form {...form}>
  <FormField
    control={form.control}
    name="productName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Product Name</FormLabel>
        <FormControl>
          <Input placeholder="e.g., Slack" {...field} />
        </FormControl>
        <FormDescription>What's your product called?</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>

// Progress
<Progress value={progress} max={100} />

// Command Palette
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command..." />
  <CommandList>
    <CommandGroup heading="Actions">
      <CommandItem>New Experiment</CommandItem>
      <CommandItem>New Persona</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

### **Design Tokens** (Consistent spacing, colors)

```tsx
// Spacing (use Tailwind classes)
<div className="p-4">     {/* padding: 16px */}
<div className="gap-6">   {/* gap: 24px */}
<div className="mt-8">    {/* margin-top: 32px */}

// Colors
<div className="bg-background text-foreground">
<div className="border border-border">
<Button className="bg-primary text-primary-foreground">

// Typography
<h1 className="text-3xl font-bold">
<p className="text-sm text-muted-foreground">
```

---

## Updated Implementation Plan Document

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "Review complete system architecture", "status": "completed", "activeForm": "Reviewing complete system architecture"}, {"content": "Define vertical slice priorities", "status": "completed", "activeForm": "Defining vertical slice priorities"}, {"content": "Clarify Electron platform requirements", "status": "completed", "activeForm": "Clarifying Electron platform requirements"}, {"content": "Recommend design system", "status": "completed", "activeForm": "Recommending design system"}]