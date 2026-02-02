# Unheard Data Models Specification
## Template System + Intelligence Layer

**Date**: 2026-01-29
**Version**: 1.0
**Purpose**: Complete data model specifications for template library, conversations, and intelligence layer

---

## Table of Contents

1. [Overview](#1-overview)
2. [Convex Schema](#2-convex-schema)
3. [Local SQLite Schema](#3-local-sqlite-schema)
4. [TypeScript Types](#4-typescript-types)
5. [Relationships](#5-relationships)
6. [Indexes & Performance](#6-indexes--performance)
7. [Migration Strategy](#7-migration-strategy)

---

## 1. Overview

### 1.1 Storage Strategy

**Convex (Cloud)**:
- Templates (official + community + team)
- Experiments and results
- Personas and focus groups
- Conversations (for collaboration)
- User preferences and settings

**Better-SQLite3 (Local)**:
- Execution traces and logs
- Cost tracking
- Performance metrics
- Template cache (for offline)
- Conversation history (synced to cloud)

### 1.2 Sync Strategy

**Offline-First**:
- All operations write to local SQLite first
- Background sync to Convex when online
- Conflict resolution: last-write-wins for templates, merge for experiments

**Benefits**:
- Fast local operations
- Works offline
- Cloud backup
- Team collaboration when online

---

## 2. Convex Schema

### 2.1 Template System

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // ==========================================
  // TEMPLATE SYSTEM
  // ==========================================

  experimentTemplates: defineTable({
    // Basic Info
    name: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("pricing"),
      v.literal("feature-validation"),
      v.literal("messaging"),
      v.literal("market-research"),
      v.literal("competitive-analysis"),
      v.literal("persona-development"),
      v.literal("discovery"),
      v.literal("custom")
    ),

    // The Config (JSON blob of UnheardExperimentConfig)
    config: v.any(), // Full experiment config

    // Customization Points
    variables: v.array(v.object({
      key: v.string(),              // Path in config (e.g., "experiment.context.productName")
      label: v.string(),             // User-facing label
      type: v.union(
        v.literal("text"),
        v.literal("number"),
        v.literal("select"),
        v.literal("textarea"),
        v.literal("boolean"),
        v.literal("focusGroup"),     // Dropdown of user's focus groups
        v.literal("personas"),       // Multi-select of personas
        v.literal("date")
      ),
      required: v.boolean(),
      defaultValue: v.optional(v.any()),
      placeholder: v.optional(v.string()),
      description: v.optional(v.string()),
      validation: v.optional(v.object({
        min: v.optional(v.number()),
        max: v.optional(v.number()),
        pattern: v.optional(v.string()),  // Regex
        options: v.optional(v.array(v.string())),  // For select type
      })),
    })),

    // Discovery & Search
    solves: v.array(v.string()),    // ["pricing validation", "willingness to pay"]
    audience: v.array(v.string()),  // ["B2B SaaS", "Enterprise"]
    tags: v.array(v.string()),      // ["pricing", "saas", "b2b"]

    // Authorship
    authorId: v.id("users"),
    authorName: v.string(),         // Denormalized for display
    verified: v.boolean(),          // Official Unheard template

    // Community Features
    usageCount: v.number(),         // How many times used
    successRate: v.number(),        // % of successful experiments
    avgRating: v.number(),          // Average rating (0-5)
    ratingCount: v.number(),        // Number of ratings

    // Visibility & Access
    visibility: v.union(
      v.literal("private"),         // Only author
      v.literal("team"),            // Team members only
      v.literal("public")           // Everyone
    ),
    workspaceId: v.optional(v.id("workspaces")),  // Team workspace

    // Version Control
    version: v.string(),            // Semantic versioning (e.g., "1.2.0")
    parentTemplateId: v.optional(v.id("experimentTemplates")),  // If forked
    changelog: v.array(v.object({
      version: v.string(),
      changes: v.string(),
      authorId: v.id("users"),
      date: v.number(),
    })),

    // Metadata
    featured: v.boolean(),          // Featured in template library
    deprecated: v.boolean(),        // No longer recommended

    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_author", ["authorId"])
  .index("by_category", ["category"])
  .index("by_visibility", ["visibility"])
  .index("by_workspace", ["workspaceId"])
  .index("by_usage", ["usageCount"])
  .index("by_rating", ["avgRating"])
  .index("by_verified", ["verified"])
  .index("by_featured", ["featured"]),

  // ==========================================
  // TEMPLATE USAGE TRACKING
  // ==========================================

  templateUsage: defineTable({
    templateId: v.id("experimentTemplates"),
    userId: v.id("users"),
    experimentId: v.id("experiments"),

    // What values did user customize?
    customizedVariables: v.any(),   // { productName: "Slack", pricePoint: 50 }

    // How did it go?
    wasSuccessful: v.boolean(),     // Did experiment complete?
    hadErrors: v.boolean(),
    errorMessage: v.optional(v.string()),

    // User feedback
    rating: v.optional(v.number()), // 1-5 stars
    feedback: v.optional(v.string()),

    // Performance
    executionTimeMs: v.number(),
    costUSD: v.number(),

    createdAt: v.number(),
  })
  .index("by_template", ["templateId"])
  .index("by_user", ["userId"])
  .index("by_experiment", ["experimentId"])
  .index("by_success", ["templateId", "wasSuccessful"]),

  // ==========================================
  // TEMPLATE RATINGS & REVIEWS
  // ==========================================

  templateRatings: defineTable({
    templateId: v.id("experimentTemplates"),
    userId: v.id("users"),
    rating: v.number(),             // 1-5 stars
    review: v.optional(v.string()),
    helpful: v.number(),            // Upvotes
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_template", ["templateId"])
  .index("by_user", ["userId"])
  .index("by_rating", ["templateId", "rating"]),

  // ==========================================
  // CONVERSATION SYSTEM
  // ==========================================

  conversationThreads: defineTable({
    userId: v.id("users"),

    // Type of conversation
    type: v.union(
      v.literal("experiment_design"),   // Creating new experiment
      v.literal("template_creation"),   // Creating template
      v.literal("results_analysis"),    // Analyzing results
      v.literal("follow_up"),           // Post-experiment follow-up
      v.literal("general")              // General help
    ),

    // Conversation messages
    messages: v.array(v.object({
      id: v.string(),                   // Message ID for updates
      role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
      content: v.string(),
      timestamp: v.number(),
      metadata: v.optional(v.any()),    // Tool calls, function results, etc.
    })),

    // What was generated?
    generatedConfigId: v.optional(v.id("experimentConfigs")),
    generatedTemplateId: v.optional(v.id("experimentTemplates")),
    experimentId: v.optional(v.id("experiments")),

    // State
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("abandoned")
    ),

    // Context
    contextData: v.optional(v.any()),  // Relevant context (personas, past experiments, etc.)

    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_type", ["type"])
  .index("by_status", ["status"])
  .index("by_experiment", ["experimentId"]),

  // ==========================================
  // EXPERIMENT CONFIGS (Standalone)
  // ==========================================

  experimentConfigs: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),

    // The config
    config: v.any(),  // Complete UnheardExperimentConfig

    // Source
    sourceType: v.union(
      v.literal("template"),          // From template
      v.literal("conversation"),      // From AI assistant
      v.literal("wizard"),            // From manual wizard
      v.literal("import"),            // Imported from file
      v.literal("api")                // Via API
    ),
    sourceId: v.optional(v.string()), // Template or conversation ID

    // Organization
    tags: v.array(v.string()),
    workspaceId: v.optional(v.id("workspaces")),

    // Can this be a template?
    canBeTemplate: v.boolean(),
    isTemplate: v.boolean(),
    templateId: v.optional(v.id("experimentTemplates")),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_workspace", ["workspaceId"])
  .index("by_source_type", ["sourceType"])
  .index("by_template_candidate", ["canBeTemplate"]),

  // ==========================================
  // UPDATED: EXPERIMENTS TABLE
  // ==========================================

  experiments: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.union(
      v.literal("focus_group"),
      v.literal("ab_test"),
      v.literal("interview"),
      v.literal("survey")
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("pending"),
      v.literal("running"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("failed")
    ),

    // Configuration
    context: v.any(),
    hypothesis: v.any(),
    stimulus: v.any(),
    networkConfig: v.any(),

    // Links
    focusGroupId: v.id("focusGroups"),
    sourceConfigId: v.optional(v.id("experimentConfigs")),      // NEW
    sourceTemplateId: v.optional(v.id("experimentTemplates")), // NEW
    conversationId: v.optional(v.id("conversationThreads")),   // NEW

    // Results
    extractedDataset: v.optional(v.any()),

    // Execution Metrics (NEW)
    executionMetrics: v.optional(v.object({
      totalDurationMs: v.number(),
      llmCalls: v.number(),
      parallelism: v.number(),
      costUSD: v.number(),
      provider: v.string(),           // Which LLM provider used
      model: v.string(),              // Which model
      strategy: v.string(),           // "speed", "quality", "cost", "balanced"
    })),

    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
  .index("by_user", ["userId"])
  .index("by_status", ["status"])
  .index("by_template", ["sourceTemplateId"])
  .index("by_conversation", ["conversationId"]),

  // ==========================================
  // WORKSPACES (for Team Collaboration)
  // ==========================================

  workspaces: defineTable({
    name: v.string(),
    description: v.optional(v.string()),

    // Ownership
    ownerId: v.id("users"),

    // Members
    memberIds: v.array(v.id("users")),

    // Settings
    settings: v.object({
      defaultVisibility: v.string(),  // Default for new templates
      requireApproval: v.boolean(),   // Require approval for public sharing
      sharedPersonas: v.boolean(),    // Share persona library
    }),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_owner", ["ownerId"]),

  // ==========================================
  // EXISTING TABLES (Keep Unchanged)
  // ==========================================

  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    preferences: v.optional(v.any()),
    createdAt: v.number(),
  })
  .index("by_clerk_id", ["clerkId"]),

  personas: defineTable({
    userId: v.id("users"),
    name: v.string(),
    demographics: v.any(),
    company: v.optional(v.any()),
    jobRole: v.optional(v.any()),
    personality: v.any(),
    beliefs: v.array(v.string()),
    preferences: v.any(),
    behaviors: v.array(v.string()),
    tags: v.array(v.string()),
    workspaceId: v.optional(v.id("workspaces")),
    createdAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_workspace", ["workspaceId"]),

  focusGroups: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    personaIds: v.array(v.id("personas")),
    tags: v.array(v.string()),
    workspaceId: v.optional(v.id("workspaces")),
    createdAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_workspace", ["workspaceId"]),

  experimentRounds: defineTable({
    experimentId: v.id("experiments"),
    roundNumber: v.number(),
    consensusScore: v.number(),
    avgSentiment: v.number(),
    sentimentVariance: v.number(),
    completedAt: v.number(),
  })
  .index("by_experiment", ["experimentId"]),

  experimentResponses: defineTable({
    experimentId: v.id("experiments"),
    roundId: v.id("experimentRounds"),
    personaId: v.id("personas"),
    response: v.string(),
    sentiment: v.number(),
    confidence: v.number(),
    reasoning: v.optional(v.string()),
    createdAt: v.number(),
  })
  .index("by_experiment", ["experimentId"])
  .index("by_round", ["roundId"])
  .index("by_persona", ["personaId"]),

  discoverySessions: defineTable({
    experimentId: v.id("experiments"),
    userId: v.id("users"),
    status: v.union(
      v.literal("initializing"),
      v.literal("running"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("failed")
    ),
    config: v.any(),
    progress: v.any(),
    results: v.optional(v.any()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
  .index("by_experiment", ["experimentId"])
  .index("by_user", ["userId"]),

  discoveryNodes: defineTable({
    sessionId: v.id("discoverySessions"),
    nodeId: v.string(),
    parentId: v.optional(v.string()),
    hypothesis: v.string(),
    level: v.number(),
    state: v.union(
      v.literal("pending"),
      v.literal("expanding"),
      v.literal("evaluating"),
      v.literal("evaluated")
    ),
    beliefs: v.any(),
    surprise: v.number(),
    klDivergence: v.number(),
    visits: v.number(),
    value: v.number(),
    experimentPlan: v.optional(v.string()),
    generatedCode: v.optional(v.string()),
    executionResult: v.optional(v.any()),
  })
  .index("by_session", ["sessionId"]),
});
```

---

## 3. Local SQLite Schema

### 3.1 Purpose

Local SQLite stores:
1. Performance metrics and traces
2. Cost tracking
3. Template cache for offline use
4. Conversation history (before sync)
5. Execution logs

### 3.2 Schema

```sql
-- ==========================================
-- TEMPLATE CACHE
-- ==========================================

CREATE TABLE template_cache (
    id TEXT PRIMARY KEY,
    template_data TEXT NOT NULL,    -- JSON blob of template
    last_synced INTEGER NOT NULL,
    is_official BOOLEAN DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE INDEX idx_template_cache_synced ON template_cache(last_synced);
CREATE INDEX idx_template_cache_official ON template_cache(is_official);

-- ==========================================
-- EXECUTION TRACES
-- ==========================================

CREATE TABLE execution_traces (
    id TEXT PRIMARY KEY,
    experiment_id TEXT,
    trace_type TEXT NOT NULL,       -- 'llm_call', 'mcts_iteration', 'agent_response'
    timestamp INTEGER NOT NULL,
    duration_ms INTEGER,

    -- LLM specific
    provider TEXT,
    model TEXT,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    cost_usd REAL,

    -- Context
    metadata TEXT,                  -- JSON blob
    error TEXT,

    created_at INTEGER NOT NULL
);

CREATE INDEX idx_execution_traces_experiment ON execution_traces(experiment_id);
CREATE INDEX idx_execution_traces_type ON execution_traces(trace_type);
CREATE INDEX idx_execution_traces_timestamp ON execution_traces(timestamp);

-- ==========================================
-- COST TRACKING
-- ==========================================

CREATE TABLE cost_tracking (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    experiment_id TEXT,

    -- Cost breakdown
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    operation TEXT NOT NULL,        -- 'persona', 'discovery', 'sentiment'

    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    cost_usd REAL NOT NULL,

    -- Time
    timestamp INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX idx_cost_tracking_user ON cost_tracking(user_id);
CREATE INDEX idx_cost_tracking_experiment ON cost_tracking(experiment_id);
CREATE INDEX idx_cost_tracking_timestamp ON cost_tracking(timestamp);

-- ==========================================
-- CONVERSATION CACHE
-- ==========================================

CREATE TABLE conversation_cache (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    thread_id TEXT,                 -- Convex thread ID
    messages TEXT NOT NULL,         -- JSON array of messages
    last_synced INTEGER,
    is_synced BOOLEAN DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE INDEX idx_conversation_cache_user ON conversation_cache(user_id);
CREATE INDEX idx_conversation_cache_synced ON conversation_cache(is_synced);

-- ==========================================
-- PERFORMANCE METRICS
-- ==========================================

CREATE TABLE performance_metrics (
    id TEXT PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    context TEXT,                   -- JSON blob
    timestamp INTEGER NOT NULL
);

CREATE INDEX idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- ==========================================
-- SYNC STATUS
-- ==========================================

CREATE TABLE sync_status (
    table_name TEXT PRIMARY KEY,
    last_synced INTEGER NOT NULL,
    sync_errors INTEGER DEFAULT 0,
    last_error TEXT
);
```

---

## 4. TypeScript Types

### 4.1 Template Types

```typescript
// shared/types/template.ts

import { Id } from "convex/values";

export type TemplateCategory =
  | "pricing"
  | "feature-validation"
  | "messaging"
  | "market-research"
  | "competitive-analysis"
  | "persona-development"
  | "discovery"
  | "custom";

export type TemplateVariableType =
  | "text"
  | "number"
  | "select"
  | "textarea"
  | "boolean"
  | "focusGroup"
  | "personas"
  | "date";

export type TemplateVisibility = "private" | "team" | "public";

export interface TemplateVariable {
  key: string;                      // Path in config (dot notation)
  label: string;                    // User-facing label
  type: TemplateVariableType;
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;               // Regex for validation
    options?: string[];             // For select type
  };
}

export interface TemplateChangelogEntry {
  version: string;
  changes: string;
  authorId: Id<"users">;
  date: number;
}

export interface ExperimentTemplate {
  _id: Id<"experimentTemplates">;

  // Basic Info
  name: string;
  description: string;
  category: TemplateCategory;

  // The Config
  config: UnheardExperimentConfig;  // From config.ts

  // Customization
  variables: TemplateVariable[];

  // Discovery
  solves: string[];                 // Search keywords
  audience: string[];               // Target users
  tags: string[];

  // Authorship
  authorId: Id<"users">;
  authorName: string;
  verified: boolean;

  // Community
  usageCount: number;
  successRate: number;
  avgRating: number;
  ratingCount: number;

  // Visibility
  visibility: TemplateVisibility;
  workspaceId?: Id<"workspaces">;

  // Versioning
  version: string;
  parentTemplateId?: Id<"experimentTemplates">;
  changelog: TemplateChangelogEntry[];

  // Metadata
  featured: boolean;
  deprecated: boolean;

  createdAt: number;
  updatedAt: number;
}

export interface TemplateUsage {
  _id: Id<"templateUsage">;
  templateId: Id<"experimentTemplates">;
  userId: Id<"users">;
  experimentId: Id<"experiments">;

  customizedVariables: Record<string, any>;

  wasSuccessful: boolean;
  hadErrors: boolean;
  errorMessage?: string;

  rating?: number;
  feedback?: string;

  executionTimeMs: number;
  costUSD: number;

  createdAt: number;
}

export interface TemplateRating {
  _id: Id<"templateRatings">;
  templateId: Id<"experimentTemplates">;
  userId: Id<"users">;
  rating: number;                   // 1-5
  review?: string;
  helpful: number;                  // Upvote count
  createdAt: number;
  updatedAt: number;
}

// Helper types

export interface TemplateSearchFilters {
  category?: TemplateCategory;
  minRating?: number;
  verified?: boolean;
  tags?: string[];
  audience?: string[];
}

export interface TemplateSearchResult {
  template: ExperimentTemplate;
  matchScore: number;               // Relevance score
  matchReasons: string[];           // Why it matched
}

export interface CustomizedTemplate {
  template: ExperimentTemplate;
  customizedConfig: UnheardExperimentConfig;
  variableValues: Record<string, any>;
}
```

### 4.2 Conversation Types

```typescript
// shared/types/conversation.ts

import { Id } from "convex/values";

export type ConversationType =
  | "experiment_design"
  | "template_creation"
  | "results_analysis"
  | "follow_up"
  | "general";

export type MessageRole = "user" | "assistant" | "system";

export type ConversationStatus = "active" | "completed" | "abandoned";

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  metadata?: {
    toolCalls?: any[];
    functionResults?: any[];
    configSnapshot?: any;
  };
}

export interface ConversationThread {
  _id: Id<"conversationThreads">;
  userId: Id<"users">;

  type: ConversationType;
  messages: ConversationMessage[];

  // Generated artifacts
  generatedConfigId?: Id<"experimentConfigs">;
  generatedTemplateId?: Id<"experimentTemplates">;
  experimentId?: Id<"experiments">;

  status: ConversationStatus;

  // Context
  contextData?: {
    userPersonas?: Id<"personas">[];
    userFocusGroups?: Id<"focusGroups">[];
    recentExperiments?: Id<"experiments">[];
    relevantTemplates?: Id<"experimentTemplates">[];
  };

  createdAt: number;
  updatedAt: number;
}

export interface ConversationInput {
  message: string;
  threadId?: Id<"conversationThreads">;  // Continue existing thread
  type?: ConversationType;
  context?: any;
}

export interface ConversationResponse {
  threadId: Id<"conversationThreads">;
  message: ConversationMessage;

  // Actions the assistant took
  actions?: {
    searchedTemplates?: boolean;
    generatedConfig?: boolean;
    estimatedCost?: { amount: number; currency: string };
    suggestedTemplates?: Id<"experimentTemplates">[];
  };

  // What the user should do next
  nextSteps?: string[];

  // If config was generated
  generatedConfig?: UnheardExperimentConfig;
}
```

### 4.3 Execution Metrics Types

```typescript
// shared/types/execution.ts

export interface ExecutionMetrics {
  totalDurationMs: number;
  llmCalls: number;
  parallelism: number;              // Max concurrent calls
  costUSD: number;
  provider: string;                 // "ollama", "modal", "openai", "anthropic"
  model: string;                    // Specific model used
  strategy: "speed" | "quality" | "cost" | "balanced";
}

export interface ExecutionTrace {
  id: string;
  experimentId: string;
  traceType: "llm_call" | "mcts_iteration" | "agent_response";
  timestamp: number;
  durationMs?: number;

  // LLM specific
  provider?: string;
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  costUSD?: number;

  metadata?: any;
  error?: string;

  createdAt: number;
}

export interface CostBreakdown {
  total: number;
  byProvider: Record<string, number>;
  byOperation: Record<string, number>;
  byModel: Record<string, number>;
}
```

---

## 5. Relationships

### 5.1 Entity Relationship Diagram

```
User
  ├── Templates (created)
  ├── Experiments
  ├── Personas
  ├── FocusGroups
  ├── Conversations
  └── Workspaces (member of)

ExperimentTemplate
  ├── created by User
  ├── used in TemplateUsage[]
  ├── rated in TemplateRating[]
  ├── forked from ParentTemplate
  ├── belongs to Workspace
  └── generates ExperimentConfigs

TemplateUsage
  ├── references Template
  ├── references User
  └── references Experiment

ConversationThread
  ├── belongs to User
  ├── generates ExperimentConfig
  ├── generates Template
  └── creates Experiment

Experiment
  ├── created by User
  ├── uses FocusGroup
  ├── generated from Template
  ├── generated from Conversation
  ├── has ExperimentRounds[]
  ├── has ExperimentResponses[]
  └── may have DiscoverySession

Workspace
  ├── owned by User
  ├── has Members (User[])
  ├── has Templates[]
  ├── has Personas[]
  └── has FocusGroups[]
```

### 5.2 Key Relationships

**Template → Experiment**:
```typescript
// Track which template generated which experiments
Template._id → Experiment.sourceTemplateId
Template._id → TemplateUsage.templateId → TemplateUsage.experimentId
```

**Conversation → Artifacts**:
```typescript
// Conversation can generate multiple artifacts
Conversation._id → ExperimentConfig.sourceId (where sourceType === "conversation")
Conversation._id → Experiment.conversationId
Conversation._id → Template.generatedFromConversationId (optional field)
```

**Template Versioning**:
```typescript
// Track template forks and evolution
Template._id → ChildTemplate.parentTemplateId
```

**Team Collaboration**:
```typescript
// Workspace contains shared resources
Workspace._id → Template.workspaceId
Workspace._id → Persona.workspaceId
Workspace._id → FocusGroup.workspaceId
```

---

## 6. Indexes & Performance

### 6.1 Critical Indexes

**For Template Discovery**:
```typescript
.index("by_category", ["category"])              // Browse by category
.index("by_rating", ["avgRating"])               // Sort by quality
.index("by_usage", ["usageCount"])               // Sort by popularity
.index("by_verified", ["verified"])              // Official templates
```

**For Team Collaboration**:
```typescript
.index("by_workspace", ["workspaceId"])          // Team templates
.index("by_author", ["authorId"])                // My templates
```

**For Analytics**:
```typescript
.index("by_success", ["templateId", "wasSuccessful"])  // Success rate
.index("by_template", ["templateId"])            // Usage stats
```

**For Conversations**:
```typescript
.index("by_user", ["userId"])                    // User's conversations
.index("by_status", ["status"])                  // Active conversations
.index("by_experiment", ["experimentId"])        // Find conversation for experiment
```

### 6.2 Query Patterns

**Common Queries**:

1. **Get templates for user's category interest**:
```typescript
db.query("experimentTemplates")
  .withIndex("by_category", q => q.eq("category", "pricing"))
  .order("desc")
  .take(20);
```

2. **Get user's active conversations**:
```typescript
db.query("conversationThreads")
  .withIndex("by_user", q => q.eq("userId", userId))
  .filter(q => q.eq(q.field("status"), "active"))
  .order("desc")
  .take(10);
```

3. **Get template success rate**:
```typescript
db.query("templateUsage")
  .withIndex("by_success", q =>
    q.eq("templateId", templateId).eq("wasSuccessful", true)
  )
  .collect()
  .then(successful => successful.length / totalUsage);
```

4. **Get trending templates (this week)**:
```typescript
const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
db.query("templateUsage")
  .filter(q => q.gte(q.field("createdAt"), weekAgo))
  .collect()
  .then(usages => {
    // Group by templateId, count, return top 10
  });
```

---

## 7. Migration Strategy

### 7.1 From Existing Schema

**Existing tables to keep**: Users, Personas, FocusGroups, Experiments, ExperimentRounds, ExperimentResponses, DiscoverySessions, DiscoveryNodes

**New tables to add**:
- experimentTemplates
- templateUsage
- templateRatings
- conversationThreads
- experimentConfigs
- workspaces

**Modifications to existing tables**:
```typescript
// Add to experiments table
experiments: {
  // ... existing fields
  sourceTemplateId: v.optional(v.id("experimentTemplates")),
  conversationId: v.optional(v.id("conversationThreads")),
  executionMetrics: v.optional(v.object({ /* ... */ })),
}
```

### 7.2 Migration Steps

1. **Add new tables** (no data migration needed)
2. **Create official templates** (5 templates from code)
3. **Update experiments table schema**
4. **Backfill sourceTemplateId** (optional - only for experiments created after template system)
5. **Seed template usage data** (from existing experiment success/failure rates)

### 7.3 Migration Script

```typescript
// convex/migrations/add-template-system.ts

import { mutation } from "./_generated/server";

export const migrateToTemplateSystem = mutation({
  handler: async (ctx) => {
    // 1. Create official templates
    const officialTemplates = [
      {
        name: "B2B SaaS Pricing Validation",
        category: "pricing",
        config: { /* ... */ },
        variables: [ /* ... */ ],
        verified: true,
        visibility: "public",
        version: "1.0.0",
        usageCount: 0,
        avgRating: 0,
        ratingCount: 0,
        featured: true,
        deprecated: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      // ... 4 more templates
    ];

    for (const template of officialTemplates) {
      await ctx.db.insert("experimentTemplates", {
        ...template,
        authorId: SYSTEM_USER_ID,
        authorName: "Unheard",
        solves: [],
        audience: [],
        tags: [],
        changelog: [],
      });
    }

    // 2. Update experiments table (add new fields with defaults)
    // Convex handles this automatically with schema changes

    console.log("Template system migration complete!");
  },
});
```

---

## Summary

This data model design enables:

1. **Template Library**: Official + community templates with versioning
2. **Conversational AI**: Full conversation history and context
3. **Team Collaboration**: Workspaces for shared resources
4. **Analytics**: Usage tracking, success rates, cost tracking
5. **Offline Support**: Local SQLite cache with sync
6. **Scalability**: Proper indexes for fast queries

**Key Features**:
- Templates can be forked and versioned
- Conversations generate configs and templates
- Usage data improves template recommendations
- Workspaces enable team collaboration
- All data syncs to local SQLite for offline use
- Comprehensive execution metrics for optimization

**Next Steps**:
1. Implement Convex functions for CRUD operations
2. Build template search/recommendation system
3. Create conversation management system
4. Implement local SQLite sync logic
5. Build template library UI components
