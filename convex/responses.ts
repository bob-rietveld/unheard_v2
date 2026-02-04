import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all responses for an experiment
 */
export const listByExperiment = query({
  args: { experimentId: v.id("experiments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("responses")
      .withIndex("by_experiment", (q) => q.eq("experimentId", args.experimentId))
      .order("desc")
      .collect();
  },
});

/**
 * Get all responses for a persona
 */
export const listByPersona = query({
  args: { personaId: v.id("personas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("responses")
      .withIndex("by_persona", (q) => q.eq("personaId", args.personaId))
      .order("desc")
      .collect();
  },
});

/**
 * Get a single response by ID
 */
export const get = query({
  args: { id: v.id("responses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Create a new response
 */
export const create = mutation({
  args: {
    experimentId: v.id("experiments"),
    personaId: v.id("personas"),
    content: v.string(),
    sentiment: v.optional(
      v.object({
        score: v.number(),
        label: v.string(),
      })
    ),
    metadata: v.optional(
      v.object({
        tokens: v.optional(v.number()),
        duration: v.optional(v.number()),
        model: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("responses", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/**
 * Update response sentiment
 */
export const updateSentiment = mutation({
  args: {
    id: v.id("responses"),
    sentiment: v.object({
      score: v.number(),
      label: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { id, sentiment } = args;
    await ctx.db.patch(id, { sentiment });
  },
});

/**
 * Delete a response
 */
export const remove = mutation({
  args: { id: v.id("responses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Get responses with populated persona and experiment data
 */
export const getWithDetails = query({
  args: { experimentId: v.id("experiments") },
  handler: async (ctx, args) => {
    const responses = await ctx.db
      .query("responses")
      .withIndex("by_experiment", (q) => q.eq("experimentId", args.experimentId))
      .order("desc")
      .collect();

    const withDetails = await Promise.all(
      responses.map(async (response) => {
        const persona = await ctx.db.get(response.personaId);
        const experiment = await ctx.db.get(response.experimentId);
        return {
          ...response,
          persona,
          experiment,
        };
      })
    );

    return withDetails;
  },
});
