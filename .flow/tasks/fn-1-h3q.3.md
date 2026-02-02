# fn-1-h3q.3 Set up Convex schema (users, personas, experiments, responses)

## Description
Set up comprehensive Convex database schema with four core tables (users, personas, experiments, responses) and complete CRUD operations for each entity.

## Acceptance
- [x] Schema defined in `convex/schema.ts` with proper types and indexes
- [x] Users table with email indexing
- [x] Personas table with attributes structure and user relationship
- [x] Experiments table with status tracking and persona array
- [x] Responses table with sentiment analysis and metadata support
- [x] Query and mutation functions for all tables
- [x] Proper TypeScript types and validation with Convex validators
- [x] Documentation of schema structure and relationships

## Done summary
Created complete Convex schema with:
- `schema.ts`: Defines all 4 tables with proper indexes and relationships
- `users.ts`: User management with email-based queries
- `personas.ts`: Full CRUD for persona management
- `experiments.ts`: Experiment lifecycle with status management
- `responses.ts`: Response storage with sentiment tracking and detailed queries
- `SCHEMA.md`: Comprehensive documentation with examples and relationship diagrams

All tables include proper indexes for efficient queries. Schema supports the full experiment workflow from user creation through persona definition, experiment execution, and response collection.

## Evidence
- Commits: (pending)
- Tests: Schema compiles (requires `convex dev` to generate types)
- PRs: (pending)
