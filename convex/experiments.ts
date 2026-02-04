import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all experiments for a user
 */
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("experiments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/**
 * Get a single experiment by ID
 */
export const get = query({
  args: { id: v.id("experiments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get experiments by status
 */
export const listByStatus = query({
  args: {
    status: v.union(
      v.literal("draft"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("experiments")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

/**
 * Create a new experiment
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    prompt: v.string(),
    personas: v.array(v.id("personas")),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("experiments", {
      ...args,
      status: "draft",
      createdAt: Date.now(),
    });
  },
});

/**
 * Update experiment status
 */
export const updateStatus = mutation({
  args: {
    id: v.id("experiments"),
    status: v.union(
      v.literal("draft"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    const updates: any = { status: args.status };
    if (args.status === "completed") {
      updates.completedAt = Date.now();
    }
    await ctx.db.patch(args.id, updates);
  },
});

/**
 * Update an experiment
 */
export const update = mutation({
  args: {
    id: v.id("experiments"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    prompt: v.optional(v.string()),
    personas: v.optional(v.array(v.id("personas"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

/**
 * Delete an experiment
 */
export const remove = mutation({
  args: { id: v.id("experiments") },
  handler: async (ctx, args) => {
    // Delete all associated responses first
    const responses = await ctx.db
      .query("responses")
      .withIndex("by_experiment", (q) => q.eq("experimentId", args.id))
      .collect();

    for (const response of responses) {
      await ctx.db.delete(response._id);
    }

    await ctx.db.delete(args.id);
  },
});
