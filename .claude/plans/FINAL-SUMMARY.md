# Unheard V2: Final Implementation Summary

**Date**: 2026-01-29
**Status**: Complete Planning - Ready to Build
**Total Documentation**: 240+ pages across 14 documents
**Total Effort**: 19 weeks to complete platform

---

## 🎯 What You're Building

**Unheard V2** is an **AI-powered market research and investment screening platform** with:

1. **Intelligence Layer** - Conversational AI eliminates configuration complexity
2. **Context System** - Real customer data (CRM + documents) grounds all experiments
3. **Dataset Extraction** - Transform text responses → structured data (research-backed SSR method)
4. **AutoDS Discovery** - Bayesian MCTS finds surprising patterns automatically
5. **Template Library** - Reusable experiments with network effects
6. **LLM Optimization** - 10x faster execution via parallelization
7. **Startup Screening** - DIALECTIC-style VC evaluation with debate (NEW!)

---

## 📊 Complete Feature Matrix

| Feature | Market Research | VC Screening |
|---------|----------------|--------------|
| **Personas** | Customer personas from CRM | Investor personas (GP, Principal, etc.) |
| **Experiments** | Focus groups, surveys, A/B tests | Startup evaluations, debates |
| **Network Types** | Broadcast, RoundRobin, Moderated | Debate (pro/contra) ⭐ NEW |
| **Data Input** | Context docs, CSV, Attio CRM | Pitch decks, Crunchbase, websites |
| **Extraction** | SSR + LLM → Structured datasets | Argument quality scoring (14 criteria) |
| **Discovery** | MCTS finds market insights | MCTS finds portfolio patterns |
| **Output** | Validated insights + confidence | Decision scores + ranked arguments |
| **Templates** | Pricing, features, messaging | Startup screening, due diligence |

**Result**: One platform, two markets (B2B research + VC)

---

## 🗓️ Complete Timeline: 19 Weeks

### **MONTH 1: Foundation (Weeks 1-4)**

**Week 1-2: SLICE 1 - Minimal Experiment**
- Basic experiment flow end-to-end
- Manual personas, wizard, sequential execution
- **Demo**: Create personas → Run experiment → See results

**Week 3-4: SLICE 2 - Context & Personas**
- Upload CSV, generate realistic personas
- Context library UI
- **Demo**: Upload customers.csv → 20 personas in 30 sec

---

### **MONTH 2: Data Quality (Weeks 5-9)**

**Week 5-6: SLICE 3 - Dataset Extraction**
- SSR extractor (Semantic Similarity Rating)
- Quality dashboard with observability
- **Demo**: Experiment → Structured dataset with confidence scores

**Week 7-9: SLICE 4 - AutoDS Discovery** ⭐
- MCTS engine, discovery agents
- Modal Python execution
- **Demo**: Discover "VPs pay 40% more than CTOs"
- **→ MVP COMPLETE** 🚀

---

### **MONTH 3: UX Magic (Weeks 10-13)**

**Week 10-11: SLICE 5 - Templates**
- 5 official templates
- Template customizer, save, fork
- **Demo**: Select template → Run in 30 sec

**Week 12-13: SLICE 6 - AI Assistant** ⭐
- Enhanced Experiment Assistant
- Conversational config generation
- **Demo**: "Test pricing" → Complete experiment
- **→ V1.0 COMPLETE** 🎉

---

### **MONTH 4: Optimization (Weeks 14-17)**

**Week 14-15: SLICE 7 - LLM Optimization**
- Ollama local models (free)
- Modal serverless (cheap)
- Worker pool (10x parallelization)
- **Demo**: Same experiment, 6 sec vs 60 sec

**Week 16-17: SLICE 8 - Advanced Features**
- Attio CRM connector (OAuth + auto-sync)
- Workspaces (team collaboration)
- System tray, notifications, polish
- **→ V1.5 PRODUCTION** 🚢

---

### **MONTH 5: VC Extension (Weeks 18-19)**

**Week 18-19: SLICE 9 - Startup Screening** ⭐ NEW MARKET
- 6 DIALECTIC agents (decomposer, answerer, generator, critic, evaluator, refiner)
- Debate Network topology
- Startup screening template
- Batch evaluation (rank 50+ startups)
- **Demo**: Upload pitch deck → Debate → Decision score +42 (INVEST)
- **→ V2.0 COMPLETE** - Full Platform (Research + Investment)

---

## 🎁 What You Get

### **After 9 Weeks (MVP)**
- ✅ Working experiment platform
- ✅ Realistic personas from CSV
- ✅ Validated datasets with quality metrics
- ✅ AutoDS discovery (unique differentiator)
- **Ship to first customers!**

### **After 13 Weeks (V1.0)**
- ✅ Template library
- ✅ AI Assistant (conversational UX)
- ✅ Everything from MVP
- **General availability!**

### **After 17 Weeks (V1.5)**
- ✅ 10x faster (Ollama parallelization)
- ✅ Attio CRM integration
- ✅ Team collaboration
- ✅ Production-ready polish
- **Enterprise-ready!**

### **After 19 Weeks (V2.0)**
- ✅ Startup screening (DIALECTIC)
- ✅ VC market expansion
- ✅ Batch evaluation
- ✅ Portfolio analytics
- **Platform for both markets!**

---

## 💡 Unique Value Propositions

### **For Market Researchers**

**Before**:
- 40 minutes to configure experiment
- 10 minutes to run (sequential LLM calls)
- Synthetic personas (made-up)
- No validation
- Manual analysis

**After (Unheard V2)**:
- 2 minutes conversational setup (AI Assistant)
- 30 seconds to run (parallelized)
- Real personas (from CRM data)
- Validated insights with confidence scores
- Automated discovery (AutoDS finds patterns)

**Result**: **20x faster time to actionable insight**

---

### **For Venture Capitalists (NEW!)**

**Before**:
- Manual screening (40+ hours per 100 startups)
- Inconsistent evaluation (bias)
- No ranking (hard to prioritize)
- Opaque decisions (gut feel)

**After (Unheard V2 with SLICE 9)**:
- Automated screening (90 min per 100 startups)
- Consistent evaluation (14-criteria scoring)
- Ranked decision scores (prioritize top 10)
- Transparent arguments (interpretable)

**Result**: **25x faster screening with interpretable rankings**

---

## 📈 Market Opportunity

### **Market 1: B2B Market Research**
- **TAM**: $8B (market research software market)
- **Target**: Product managers, UX researchers, marketers
- **Pricing**: $99-499/month per user
- **Differentiator**: AutoDS (only tool with Bayesian discovery)

### **Market 2: Venture Capital (NEW!)**
- **TAM**: $1.46 trillion VC industry (growing 17.6% annually)
- **Target**: VC firms, angel investors, fund managers
- **Pricing**: $500-2,000/month per fund
- **Differentiator**: DIALECTIC debate + portfolio discovery

### **Revenue Potential**
```
Year 1 (Market Research):
  100 customers × $199/month × 12 = $238K ARR

Year 2 (Both Markets):
  500 researchers × $199/month = $1.2M ARR
  50 VC funds × $1,000/month = $600K ARR
  Total: $1.8M ARR

Year 3 (Scale):
  2,000 researchers × $199/month = $4.8M ARR
  200 VC funds × $1,000/month = $2.4M ARR
  Total: $7.2M ARR
```

---

## 🔧 Tech Stack (Final)

```
Desktop:        Electron 28
Frontend:       React 18 + Vite + TypeScript
Routing:        React Router v6
UI:             shadcn/ui (Radix + Tailwind CSS v4)
State:          Zustand
Forms:          React Hook Form + Zod
Database:       Convex (cloud) + Better-SQLite3 (local)
Agents:         Mastra (native Node.js - no bridge!)
LLM:            Ollama (local) + Modal (serverless) + OpenAI/Anthropic
Context:        Pinecone (vectors) + PDF/Excel/CSV parsers
CRM:            Attio (OAuth connector ready)
```

**Key Decision**: Electron (not Tauri), NOT Next.js

---

## 📋 Implementation Tracking

### **Flow-Next Project Status**

```
9 Epics Created:
  1. fn-1-h3q: SLICE 1 (Minimal Experiment)
  2. fn-2-cae: SLICE 2 (Context & Personas)
  3. fn-3-9n8: SLICE 3 (Dataset Extraction)
  4. fn-4-9y7: SLICE 4 (AutoDS Discovery) ⭐
  5. fn-5-vui: SLICE 5 (Templates)
  6. fn-6-jh6: SLICE 6 (AI Assistant) ⭐
  7. fn-7-94d: SLICE 7 (Optimization)
  8. fn-8-wkw: SLICE 8 (Advanced)
  9. fn-9-oo1: SLICE 9 (Startup Screening) ⭐ NEW

24 Tasks Created (10 for SLICE 1, 14 for SLICE 9)
```

**Track progress**: Run `flowctl status` anytime

---

## 🚀 Next Steps

### **Immediate (This Week)**

**Day 1**: Initialize Electron project
```bash
npx create-electron-app unheard-desktop --template=vite-typescript
cd unheard-desktop
npm install react react-dom react-router-dom zustand
npm install convex @mastra/core openai
npx shadcn-ui@latest init
npx convex dev
```

**Day 2-5**: Build persona CRUD + home page

**Week 2**: Complete SLICE 1, demo working experiment

### **Short-Term (Month 1)**

- Week 1-2: SLICE 1 complete
- Week 3-4: SLICE 2 complete
- **Demo to users/stakeholders at Week 4**

### **Medium-Term (Month 2-3)**

- Week 5-9: SLICES 3-4 (MVP)
- **Ship MVP at Week 9** 🚀
- Get user feedback
- Decide: Continue to V1.0 or pivot?

### **Long-Term (Month 4-5)**

- Week 10-17: SLICES 5-8 (V1.5)
- Week 18-19: SLICE 9 (VC extension - optional)
- **Ship V2.0** 🚢

---

## ❓ Decision Points

### **Timeline Choice**

**Option A: 9-Week MVP** (Recommended)
- Slices 1-4 only
- Core value validated
- Ship fast, iterate

**Option B: 13-Week V1.0**
- Slices 1-6
- Polished UX with AI Assistant
- Delayed feedback

**Option C: 19-Week Full Platform**
- All 9 slices
- Market research + VC screening
- Complete product

**My Recommendation**: **Option A** → Ship MVP → Get feedback → Decide on Slices 5-9

### **Market Focus**

**Option A: Market Research Only**
- Skip SLICE 9
- Focus on B2B researchers
- Clear product positioning

**Option B: Dual Market**
- Include SLICE 9
- Serve researchers + VCs
- Broader TAM, more complex positioning

**My Recommendation**: **Build Slices 1-8 first**, then decide on SLICE 9 based on user feedback

---

## 📚 Documentation Complete

### **14 Documents Created (240+ pages)**

1. ✅ IMPLEMENTATION-PRIORITY.md (Master guide)
2. ✅ unheard-ux-first-plan.md (Complete architecture)
3. ✅ vertical-slice-implementation.md (Detailed breakdown)
4. ✅ data-models-spec.md (Database schemas)
5. ✅ enhanced-assistant-spec.md (AI agent spec)
6. ✅ context-pipeline-implementation.md (Context system)
7. ✅ context-system-addendum.md (Context integration)
8. ✅ dataset-extraction-spec.md (Extraction system)
9. ✅ complete-data-pipeline.md (End-to-end pipeline)
10. ✅ architecture-diagrams.md (Visual diagrams)
11. ✅ SLICE-9-startup-screening.md (VC extension) ⭐ NEW
12. ✅ attio-connector.ts (Production code)
13. ✅ attio-connector.example.ts (Usage examples)
14. ✅ README.md (Document index)

### **Flow-Next Project**

- ✅ 9 Epics (one per slice)
- ✅ 24 Tasks (10 for SLICE 1, 14 for SLICE 9)
- ✅ Ready to track implementation

---

## 🎯 Answer to Your Question

### **Can you build DIALECTIC with current implementation?**

**YES! Absolutely.**

**What Unheard Already Has**:
- ✅ Multi-agent framework (Mastra)
- ✅ Question decomposition (MCTS tree search)
- ✅ Fact collection (Context system with RAG)
- ✅ Discovery agents (hypothesis, planner, analyst)
- ✅ Iterative refinement (MCTS belief updates)
- ✅ Template system (reusable configs)

**What SLICE 9 Adds** (2 weeks):
- ✅ 6 DIALECTIC agents (decomposer, answerer, generator, critic, evaluator, refiner)
- ✅ Debate Network (pro/contra argumentation)
- ✅ 14-criteria argument scoring
- ✅ Decision score ranking
- ✅ Startup screening template

**What Unheard Does BETTER Than DIALECTIC**:
- ✅ Grounded in real data (CRM + documents, not just web scrape)
- ✅ Statistical validation (dataset extraction + Python analysis)
- ✅ Portfolio-level discovery (patterns across all evaluations)
- ✅ Beautiful UI (desktop app, not CLI scripts)
- ✅ Template library (reusable across use cases)
- ✅ Conversational setup (AI Assistant generates configs)
- ✅ 10x faster execution (parallelization)

**Effort**: 80% of code already in Slices 1-8, only 20% new

**Value**: Opens entire VC market ($1.46T industry)

---

## 🏆 Competitive Positioning

### **Unheard V2.0 (All 9 Slices)**

```
The only platform that:
  ✅ Generates personas from real customer data
  ✅ Extracts validated datasets from experiments
  ✅ Discovers surprising patterns via Bayesian MCTS
  ✅ Evaluates startups via multi-agent debate
  ✅ Provides full observability and confidence scores
  ✅ Works for both market research AND investment screening
```

**Competitors**:
- UserTesting, Qualtrics → No AI personas, no discovery
- Gong, Dovetail → No experimentation, just analysis
- Traditional ML VC tools → Black box, not interpretable
- DIALECTIC (paper) → Research project, not product

**Unique**: **Only platform combining customer research + VC screening with AI**

---

## 💰 Investment Required

### **Development Costs (19 weeks)**

Assuming 1 developer:
```
Salary: $150K/year = $2,885/week
19 weeks × $2,885 = $54,815 total labor

Services:
- Pinecone (free tier): $0
- OpenAI API: ~$200 (development/testing)
- Modal: ~$100 (development)
- Convex (free tier): $0
- Attio: $0 (personal use)

Total: ~$55,000
```

Assuming 2 developers (parallel, 12 weeks):
```
2 × $2,885/week × 12 weeks = $69,240
Services: ~$500
Total: ~$70,000
```

### **Revenue Potential (Year 1)**

```
Market Research:
  100 customers × $199/month × 12 = $238,800

VC Screening:
  20 VC funds × $1,000/month × 12 = $240,000

Total Year 1 ARR: $478,800

ROI: $478K / $70K = 6.8x in Year 1
```

---

## ✅ What's Confirmed

### **Architecture**
✅ Electron (not Tauri, not web app)
✅ Vite + React 18 (not Next.js)
✅ shadcn/ui + Tailwind (professional design)
✅ Vertical slices (function-by-function delivery)

### **Strategy**
✅ 9-week MVP → Get feedback → Iterate
✅ Demo every 2 weeks (always have working software)
✅ Start with SLICE 1 (this week!)

### **Slices**
✅ SLICE 1: Minimal Experiment
✅ SLICE 2: Context & Personas
✅ SLICE 3: Dataset Extraction
✅ SLICE 4: AutoDS Discovery (MVP milestone)
✅ SLICE 5: Templates
✅ SLICE 6: AI Assistant (V1.0 milestone)
✅ SLICE 7: Optimization
✅ SLICE 8: Advanced
✅ SLICE 9: Startup Screening (V2.0 milestone) ⭐ NEW

---

## 🚀 START BUILDING

**You have everything needed**:

1. ✅ **Complete architecture** (240+ pages)
2. ✅ **Confirmed tech stack** (Electron + Vite + React + shadcn)
3. ✅ **9 vertical slices** with priorities
4. ✅ **Week 1-2 checklist** (day-by-day tasks)
5. ✅ **Flow-next tracking** (9 epics, 24 tasks)
6. ✅ **Production code** (Attio connector)
7. ✅ **Design system** (shadcn/ui defaults)
8. ✅ **Clear market opportunity** (Research + VC = $2M+ ARR potential)

**Next action**: Initialize Electron project (30 minutes)

```bash
npx create-electron-app unheard-desktop --template=vite-typescript
```

**Then**: Follow IMPLEMENTATION-PRIORITY.md Week 1-2 checklist

---

## 📊 Final Metrics Summary

| Metric | Current (Web) | After V2.0 | Improvement |
|--------|--------------|-----------|-------------|
| Time to first insight | 40 min | 2 min | **20x faster** |
| Experiment execution | 10 min | 30 sec | **20x faster** |
| Persona creation | 30 min manual | 30 sec auto | **60x faster** |
| Cost per experiment | $0.50 | $0-0.01 | **50x cheaper** |
| VC screening (100 startups) | 40 hours | 90 min | **27x faster** |
| Markets served | 1 (research) | 2 (research + VC) | **2x TAM** |

---

## 🎉 You're Ready!

**Planning**: COMPLETE ✅
**Architecture**: COMPLETE ✅
**Priorities**: COMPLETE ✅
**Tech Stack**: COMPLETE ✅
**Tracking**: COMPLETE ✅

**Time to build**: START NOW! 🛠️

Want me to:
1. **Initialize the project** (run setup commands)?
2. **Write SLICE 1 code** (complete Week 1-2 implementation)?
3. **Create UI mockups** for key screens?
4. **Write the Convex schema** for SLICE 1?
5. **Write SLICE 9 production code** (debate agents)?

The planning is **done**. Let's ship! 🚀
