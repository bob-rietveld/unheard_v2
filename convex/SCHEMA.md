# Convex Schema Documentation

This document describes the database schema for Unheard V2.

## Tables

### Users
Stores user account information.

**Fields:**
- `name` (string): User's display name
- `email` (string): User's email address (indexed)
- `createdAt` (number): Timestamp when user was created

**Indexes:**
- `by_email`: Query users by email

**API Functions:**
- `users.getByEmail`: Get user by email
- `users.create`: Create new user
- `users.getOrCreate`: Get existing user or create new one

### Personas
Stores persona definitions for experiments. Personas represent different user archetypes.

**Fields:**
- `name` (string): Persona name
- `description` (string): Persona description
- `attributes` (object): Persona characteristics
  - `age` (number, optional): Age
  - `gender` (string, optional): Gender
  - `occupation` (string, optional): Occupation
  - `interests` (array<string>, optional): List of interests
  - `painPoints` (array<string>, optional): List of pain points
  - `goals` (array<string>, optional): List of goals
- `userId` (Id<users>): Owner of this persona
- `createdAt` (number): Creation timestamp

**Indexes:**
- `by_user`: Query personas by user
- `by_created`: Query personas by creation date

**API Functions:**
- `personas.listByUser`: Get all personas for a user
- `personas.get`: Get single persona by ID
- `personas.create`: Create new persona
- `personas.update`: Update persona fields
- `personas.remove`: Delete persona

### Experiments
Stores experiment definitions and execution status.

**Fields:**
- `title` (string): Experiment title
- `description` (string): Experiment description
- `prompt` (string): The prompt to send to personas
- `personas` (array<Id<personas>>): List of persona IDs to run
- `status` ("draft" | "running" | "completed" | "failed"): Current status
- `userId` (Id<users>): Owner of this experiment
- `createdAt` (number): Creation timestamp
- `completedAt` (number, optional): Completion timestamp

**Indexes:**
- `by_user`: Query experiments by user
- `by_status`: Query experiments by status
- `by_created`: Query experiments by creation date

**API Functions:**
- `experiments.listByUser`: Get all experiments for a user
- `experiments.get`: Get single experiment by ID
- `experiments.listByStatus`: Get experiments by status
- `experiments.create`: Create new experiment
- `experiments.updateStatus`: Update experiment status
- `experiments.update`: Update experiment fields
- `experiments.remove`: Delete experiment (cascades to responses)

### Responses
Stores experiment responses from personas.

**Fields:**
- `experimentId` (Id<experiments>): The experiment this response belongs to
- `personaId` (Id<personas>): The persona that generated this response
- `content` (string): The response text
- `sentiment` (object, optional): Sentiment analysis results
  - `score` (number): Sentiment score from -1 to 1
  - `label` (string): "positive", "negative", or "neutral"
- `metadata` (object, optional): Response metadata
  - `tokens` (number, optional): Token count
  - `duration` (number, optional): Generation duration in ms
  - `model` (string, optional): Model used
- `createdAt` (number): Creation timestamp

**Indexes:**
- `by_experiment`: Query responses by experiment
- `by_persona`: Query responses by persona
- `by_created`: Query responses by creation date

**API Functions:**
- `responses.listByExperiment`: Get all responses for an experiment
- `responses.listByPersona`: Get all responses for a persona
- `responses.get`: Get single response by ID
- `responses.create`: Create new response
- `responses.updateSentiment`: Update sentiment analysis
- `responses.remove`: Delete response
- `responses.getWithDetails`: Get responses with populated persona and experiment data

## Relationships

```
users (1) ─────< (many) personas
  │
  └─────< (many) experiments
                    │
                    └─────< (many) responses
                                      │
                                      └───> persona
```

## Usage Example

```typescript
// Create a user
const userId = await ctx.runMutation(api.users.create, {
  name: "John Doe",
  email: "john@example.com"
});

// Create personas
const persona1 = await ctx.runMutation(api.personas.create, {
  name: "Tech-Savvy Developer",
  description: "A professional software developer",
  attributes: {
    age: 32,
    occupation: "Software Engineer",
    interests: ["coding", "AI", "productivity tools"],
    painPoints: ["context switching", "slow workflows"],
    goals: ["ship faster", "reduce repetitive work"]
  },
  userId
});

// Create experiment
const experimentId = await ctx.runMutation(api.experiments.create, {
  title: "Feature Feedback",
  description: "Get feedback on new AI assistant feature",
  prompt: "What do you think about an AI coding assistant?",
  personas: [persona1],
  userId
});

// Create response
await ctx.runMutation(api.responses.create, {
  experimentId,
  personaId: persona1,
  content: "As a developer, I'd love an AI assistant that understands context...",
  sentiment: {
    score: 0.8,
    label: "positive"
  },
  metadata: {
    tokens: 150,
    duration: 2500,
    model: "gpt-4"
  }
});
```

## Setup

To initialize Convex with this schema:

1. Run `npx convex dev` in the project root
2. The schema will be automatically pushed to your Convex project
3. The generated types will be available in `convex/_generated/`

## Migration Notes

This is the initial schema for Unheard V2. Future migrations should:
1. Maintain backward compatibility where possible
2. Document breaking changes
3. Provide migration scripts for data transformations
