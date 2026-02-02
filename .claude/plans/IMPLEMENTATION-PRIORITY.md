# Unheard V2: Implementation Priority & Next Steps

**Date**: 2026-01-29
**Updated**: 2026-01-29 (Added SLICE 9: Startup Screening)
**Strategy**: Vertical slices - Complete working features, shipped incrementally
**Timeline**: 9 weeks MVP, 17 weeks V1.5, 19 weeks V2.0 (with VC extension)

---

## 🎯 Implementation Strategy

### **Vertical Slices (Not Horizontal Layers)**

```
❌ WRONG (Horizontal):
Month 1: All databases
Month 2: All backend
Month 3: All frontend
→ Nothing works until month 3

✅ RIGHT (Vertical):
Week 2: Basic experiment works end-to-end
Week 4: Context upload works end-to-end
Week 6: Dataset extraction works end-to-end
→ Always have demo-able software
```

---

## 📋 Priority Order: 9 Slices

### **Critical Path (Core Value)**

```
SLICE 1: Minimal Experiment (Week 1-2)
  ↓ Enables basic experiments
SLICE 2: Context & Personas (Week 3-4)
  ↓ Enables realistic personas
SLICE 3: Dataset Extraction (Week 5-6)
  ↓ Enables structured data
SLICE 4: AutoDS Discovery (Week 7-9) ⭐ DIFFERENTIATOR
  ↓ Delivers unique value

→ MVP COMPLETE (9 weeks)
```

### **Enhancement Path (UX Magic)**

```
SLICE 5: Templates (Week 10-11)
  ↓ Enables rapid reuse
SLICE 6: AI Assistant (Week 12-13) ⭐ UX TRANSFORMATION
  ↓ Eliminates configuration complexity

→ V1.0 COMPLETE (13 weeks)
```

### **Optimization Path (Production)**

```
SLICE 7: LLM Optimization (Week 14-15)
  ↓ 10x faster + cheaper
SLICE 8: Advanced Features (Week 16-17)
  ↓ CRM, Teams, Polish

→ V1.5 PRODUCTION (17 weeks)
```

### **Extension Path (New Market: VC)**

```
SLICE 9: Startup Screening - DIALECTIC (Week 18-19) ⭐ NEW MARKET
  ↓ Expands into venture capital domain
  ↓ Debate-based argument evaluation
  ↓ Ranked startup scoring

→ V2.0 COMPLETE (19 weeks - Full Platform)
```

---

## 🚀 START HERE: Slice 1 Implementation

### **Week 1-2 Deliverable**

**What User Can Do**:
1. Create 3 personas manually
2. Create pricing experiment via wizard
3. Run experiment with 3 personas
4. See results (sentiment, responses)

**What to Build**:

#### **Day 1-2: Electron Shell**

```bash
# Initialize project
npx create-electron-app unheard-desktop --template=vite-typescript

# Install dependencies
cd unheard-desktop
npm install react react-dom react-router-dom
npm install zustand zod
npm install -D @types/react tailwindcss autoprefixer

# Initialize shadcn/ui
npx shadcn-ui@latest init
```

**Structure**:
```
unheard-desktop/
├── src/
│   ├── main.ts              # Electron main process
│   ├── preload.ts           # IPC bridge
│   └── index.ts             # App initialization
│
├── renderer/
│   ├── src/
│   │   ├── main.tsx         # React entry
│   │   ├── App.tsx          # Root component
│   │   ├── router.tsx       # React Router setup
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── PersonaNew.tsx
│   │       └── ExperimentNew.tsx
│   ├── index.html
│   └── vite.config.ts
│
└── package.json
```

#### **Day 3-5: Database (Convex)**

```bash
npm install convex
npx convex dev
```

```typescript
// convex/schema.ts (minimal for Slice 1)

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
  }),

  personas: defineTable({
    userId: v.id("users"),
    name: v.string(),
    age: v.number(),
    gender: v.string(),
    jobTitle: v.string(),
    company: v.optional(v.string()),
    beliefs: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  experiments: defineTable({
    userId: v.id("users"),
    name: v.string(),
    hypothesis: v.string(),
    stimulus: v.string(),
    personaIds: v.array(v.id("personas")),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  experimentResponses: defineTable({
    experimentId: v.id("experiments"),
    personaId: v.id("personas"),
    response: v.string(),
    sentiment: v.number(),
    createdAt: v.number(),
  }).index("by_experiment", ["experimentId"]),
});
```

#### **Day 6-8: UI (shadcn/ui + Tailwind)**

```tsx
// renderer/src/pages/Home.tsx

export function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Unheard</h1>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button asChild>
              <Link to="/personas/new">Create Persona</Link>
            </Button>
            <Button asChild>
              <Link to="/experiments/new">Create Experiment</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Experiments</CardTitle>
          </CardHeader>
          <CardContent>
            <ExperimentList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

```tsx
// renderer/src/pages/PersonaNew.tsx

export function PersonaNew() {
  const form = useForm<PersonaFormData>({
    resolver: zodResolver(personaSchema),
  });

  const onSubmit = async (data: PersonaFormData) => {
    await window.electronAPI.createPersona(data);
    navigate('/personas');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField name="name" label="Name" />
        <FormField name="age" label="Age" type="number" />
        <FormField name="jobTitle" label="Job Title" />
        {/* ... more fields */}
        <Button type="submit">Create Persona</Button>
      </form>
    </Form>
  );
}
```

#### **Day 9-10: Mastra Integration**

```typescript
// src/mastra/index.ts

import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/storage';
import { TinyPersonAgent } from './agents/TinyPerson';

export const mastra = new Mastra({
  agents: {
    tinyPerson: TinyPersonAgent,
  },
  storage: new LibSQLStore({
    url: 'file:./data/mastra.db'
  }),
});
```

```typescript
// src/mastra/agents/TinyPerson.ts

export const TinyPersonAgent = new Agent({
  name: 'tiny-person',
  model: { provider: 'openai', name: 'gpt-4o-mini' },
  instructions: `
You are simulating a persona with these characteristics:
{persona_description}

Respond to stimuli as this person would, considering:
- Your demographics and background
- Your beliefs and values
- Your professional context

Be realistic and nuanced. Express genuine concerns and interests.
`,
});
```

#### **Day 11-14: Experiment Runner**

```typescript
// src/orchestration/experiment-runner.ts

export class ExperimentRunner {
  async run(experimentId: string) {
    const experiment = await convex.query(api.experiments.get, { experimentId });
    const personas = await convex.query(api.personas.getByIds, {
      ids: experiment.personaIds
    });

    // Update status
    await convex.mutation(api.experiments.updateStatus, {
      experimentId,
      status: 'running'
    });

    // Run sequentially (for now)
    for (const persona of personas) {
      const agent = mastra.getAgent('tinyPerson');

      const response = await agent.generate(
        this.buildPrompt(persona, experiment.stimulus)
      );

      // Parse response and sentiment
      const { text, sentiment } = this.parseResponse(response);

      // Save response
      await convex.mutation(api.experimentResponses.create, {
        experimentId,
        personaId: persona._id,
        response: text,
        sentiment,
        createdAt: Date.now(),
      });

      // Emit progress event
      this.emit('progress', {
        personaId: persona._id,
        personaName: persona.name,
        complete: true,
      });
    }

    // Update status
    await convex.mutation(api.experiments.updateStatus, {
      experimentId,
      status: 'completed'
    });
  }
}
```

#### **End of Week 2: Working Demo!**

```
✅ User can create personas
✅ User can create experiments
✅ User can run experiments
✅ User can see results
```

**Demo this to stakeholders/users and get feedback before proceeding!**

---

## Decision Points Before Starting

### **1. Platform: Confirmed**

✅ **Electron** (not Tauri, not web app)
✅ **Vite + React** (not Next.js)
✅ **React Router** (not Next.js routing)
✅ **shadcn/ui + Tailwind** (design system)

### **2. Design: Confirmed**

✅ **Color palette**: Professional blue-gray (similar to Linear)
✅ **Typography**: Inter font
✅ **Dark mode**: Auto-detect from OS
✅ **Component library**: shadcn/ui

### **3. Slice Order: Choose One**

**Option A: Full Feature Path (17 weeks)**
- All 8 slices in order
- Each slice complete before next
- Ship at week 17

**Option B: MVP Fast (9 weeks) → Iterate**
- Slices 1-4 only (core value)
- Ship MVP at week 9
- Add Slices 5-8 post-launch based on feedback

**Option C: Hybrid (13 weeks)**
- Slices 1-6 (core + UX magic)
- Skip Slice 7 (optimization) for V1
- Skip Slice 8 (advanced) for V1
- Ship at week 13

**Recommendation**: **Option B (MVP at 9 weeks)**

Why:
- AutoDS is your differentiator → Get to it fast
- User feedback will inform Slices 5-8
- Less risk (validate assumptions early)
- Can still ship full product later

### **4. Open Questions**

1. **Team Size**: Solo dev or team? (Affects timeline)
2. **Design Help**: Need designer or use defaults?
3. **User Research**: Talk to users before building?
4. **Alpha Testing**: Plan to release to small group first?

---

## Next Actions (This Week)

### **Day 1: Setup**
- [ ] Clone/create new repo
- [ ] Initialize Electron project with Vite template
- [ ] Install shadcn/ui
- [ ] Set up Convex
- [ ] Configure Tailwind

### **Day 2-3: Hello World**
- [ ] Get Electron app launching
- [ ] Get hot reload working
- [ ] Create home page
- [ ] Test IPC (ping/pong)

### **Day 4-5: First CRUD**
- [ ] Persona form
- [ ] Save to Convex
- [ ] List personas
- [ ] Basic routing

### **Week 2: First Experiment**
- [ ] Experiment wizard
- [ ] Mastra integration
- [ ] Run experiment (3 personas)
- [ ] Show results

**By Week 2 Friday**: Working demo to show!

---

## Detailed SLICE 1 Checklist (Week 1-2)

See `vertical-slice-implementation.md` for complete breakdown.

### **Must-Have**
- [ ] Electron app launches
- [ ] Home page with navigation
- [ ] Persona CRUD (create, list, delete)
- [ ] Experiment wizard (3 steps)
- [ ] Mastra TinyPerson agent
- [ ] Experiment runner (sequential)
- [ ] Results page (sentiment + responses)
- [ ] Convex integration

### **Nice-to-Have** (if time)
- [ ] Dark mode toggle
- [ ] Loading states
- [ ] Error handling
- [ ] Form validation (Zod)

### **Skip for Now**
- ❌ Context upload (Slice 2)
- ❌ Dataset extraction (Slice 3)
- ❌ Templates (Slice 5)
- ❌ AI Assistant (Slice 6)
- ❌ Parallelization (Slice 7)

---

## Design System Quick Start

### **Install shadcn/ui**

```bash
npx shadcn-ui@latest init
```

When prompted:
```
Style: Default
Base color: Slate
CSS variables: Yes
```

### **Add Components as Needed**

```bash
# For Slice 1, you'll need:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add alert
```

### **Theme Configuration**

Use the default shadcn theme, customize later.

```tsx
// renderer/src/App.tsx

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </div>
  );
}
```

---

## Tech Stack Summary

### **Confirmed Decisions**

| Layer | Technology | Why |
|-------|-----------|-----|
| Desktop | Electron 28 | Native Node.js, mature ecosystem |
| Frontend | React 18 + Vite | Fast dev, modern tooling |
| Routing | React Router v6 | Standard React routing |
| UI | shadcn/ui | Beautiful, accessible, customizable |
| Styling | Tailwind CSS v4 | Utility-first, fast |
| State | Zustand | Simple, no boilerplate |
| Forms | React Hook Form + Zod | Type-safe validation |
| Database | Convex | Real-time, easy to use |
| Agents | Mastra | Proven, TypeScript-native |

### **NOT Using**

- ❌ Next.js (it's for web apps, not Electron)
- ❌ Tauri (too complex, Rust learning curve)
- ❌ Redux (Zustand is simpler)
- ❌ Emotion/Styled Components (Tailwind is better)

---

## Effort Estimation

### **By Slice**

| Slice | Feature | Weeks | Complexity | Value |
|-------|---------|-------|------------|-------|
| 1 | Basic Experiment | 2 | Low | High (foundation) |
| 2 | Context/Personas | 2 | Medium | High (realism) |
| 3 | Dataset Extraction | 2 | Medium | High (quality) |
| 4 | AutoDS | 3 | High | **Critical** (differentiator) |
| 5 | Templates | 2 | Medium | High (reuse) |
| 6 | AI Assistant | 2 | Medium | **Critical** (UX magic) |
| 7 | Optimization | 2 | Medium | Medium (performance) |
| 8 | Advanced | 2 | Low | Low (nice-to-have) |

### **Recommended Milestones**

```
Week 2: DEMO Slice 1 to users
  → Validate: Is basic experiment flow intuitive?

Week 4: DEMO Slice 2 to users
  → Validate: Do generated personas feel realistic?

Week 6: DEMO Slice 3 to users
  → Validate: Is quality dashboard useful?

Week 9: DEMO Slice 4 to users ⭐
  → Validate: Are AutoDS insights valuable?
  → Decision: Ship MVP or continue?

Week 13: SHIP V1.0 (Slices 1-6)
  → Public beta or early access

Week 17: SHIP V1.5 (Full feature set)
  → General availability
```

---

## Alternative Timelines

### **Aggressive: 6-Week MVP**

```
Week 1-2: SLICE 1 (Basic Experiment)
Week 3-4: SLICE 2 (Context) + SLICE 3 (Extraction - simplified)
Week 5-6: SLICE 4 (AutoDS - basic, not full MCTS)

→ SHIP at Week 6
→ Iterate based on feedback
```

**Trade-offs**:
- ✅ Fast to market
- ✅ Early user validation
- ❌ Missing templates, AI assistant
- ❌ Missing optimization

### **Conservative: 20-Week Full Product**

```
Add 3 weeks of polish after Slice 8:
- Week 18: Comprehensive testing
- Week 19: Bug fixes
- Week 20: Documentation + onboarding

→ SHIP fully polished product
```

**Trade-offs**:
- ✅ Very polished
- ✅ Fewer bugs
- ❌ Slower to market
- ❌ No early feedback

**Recommendation**: Start with **9-week MVP path**, reassess after Slice 4.

---

## Success Metrics Per Slice

### **Slice 1: Does experiment flow work?**
- [ ] User can create persona in <2 minutes
- [ ] User can create experiment in <3 minutes
- [ ] Experiment runs without errors
- [ ] Results display correctly

### **Slice 2: Are personas realistic?**
- [ ] CSV upload works for 500+ row files
- [ ] Generated personas feel authentic
- [ ] Source attribution is clear
- [ ] Experiment results are more believable

### **Slice 3: Is dataset quality good?**
- [ ] >80% extraction confidence
- [ ] Quality dashboard is understandable
- [ ] User can identify bad extractions
- [ ] Dataset is usable in Excel/Python

### **Slice 4: Are insights valuable?**
- [ ] Discovery finds ≥1 surprising pattern
- [ ] Insights are actionable
- [ ] Statistical evidence is trustworthy
- [ ] Users say "I didn't expect that!"

### **Slice 5: Do templates save time?**
- [ ] User reuses template <30 seconds
- [ ] Templates reduce experiment creation time by >80%
- [ ] Users create their own templates

### **Slice 6: Is AI assistant useful?**
- [ ] User describes goal → Config in <2 minutes
- [ ] <3 clarifying questions needed
- [ ] >80% of generated configs are valid
- [ ] Users prefer AI vs wizard

### **Slice 7: Is 10x speedup noticeable?**
- [ ] Experiments complete in <10 seconds
- [ ] Cost drops to ~$0
- [ ] Quality is >85% of GPT-4o

### **Slice 8: Ready for production?**
- [ ] CRM sync works automatically
- [ ] Team collaboration works
- [ ] No critical bugs
- [ ] Polished UX

---

## Final Recommendations

### **START HERE** (Next 48 Hours)

1. **Initialize project** (Day 1)
   ```bash
   npx create-electron-app unheard-desktop --template=vite-typescript
   cd unheard-desktop
   npm install react react-dom react-router-dom zustand
   npx shadcn-ui@latest init
   npm install convex
   ```

2. **Get app launching** (Day 1-2)
   - Electron window opens
   - React renders "Hello World"
   - Hot reload works

3. **Add Convex** (Day 2-3)
   - Schema defined
   - Can create user
   - Can create persona (test in Convex dashboard)

4. **Build home page** (Day 3-4)
   - shadcn/ui Card component
   - "Create Persona" button
   - Navigation works

5. **Build persona form** (Day 4-5)
   - React Hook Form + Zod
   - Save to Convex
   - Navigate to persona list

**By Day 5**: You should be able to create a persona and see it in a list.

### **Timeline Choice**

**Recommended**: **9-week MVP** (Slices 1-4)

- Week 9: Ship MVP with AutoDS working
- Get user feedback
- Decide: Add Slices 5-8? Or pivot based on feedback?

**Rationale**:
- AutoDS is your unique value → Get there fast
- Real users will tell you if templates/AI assistant are needed
- Can always add UX improvements after validating core value

### **Design System**

**Use shadcn/ui defaults for Slice 1**
- Don't customize theme yet
- Use default components
- Focus on functionality, not aesthetics
- Polish in Slice 8

---

## Summary

You now have:

1. **Clear implementation order** (8 vertical slices)
2. **Function-by-function breakdown** (each slice is complete)
3. **Confirmed tech stack** (Electron + Vite + React + shadcn)
4. **Design system** (shadcn/ui + Tailwind, consistent & simple)
5. **Detailed Slice 1 plan** (Week 1-2 checklist)
6. **Decision framework** (9-week MVP vs 17-week full product)

**Total Documentation**: 200+ pages across 9 documents

**Next Action**: Initialize Electron project and start Slice 1!

Want me to:
1. **Write the complete Slice 1 code** (Electron setup + basic experiment)?
2. **Create UI mockups** for key screens?
3. **Set up the project structure** (folder organization)?
4. **Write the Convex schema** for Slice 1?
