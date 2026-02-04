import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all personas for a user
 */
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("personas")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/**
 * Get a single persona by ID
 */
export const get = query({
  args: { id: v.id("personas") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Create a new persona
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    attributes: v.object({
      age: v.optional(v.number()),
      gender: v.optional(v.string()),
      occupation: v.optional(v.string()),
      interests: v.optional(v.array(v.string())),
      painPoints: v.optional(v.array(v.string())),
      goals: v.optional(v.array(v.string())),
    }),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("personas", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/**
 * Update a persona
 */
export const update = mutation({
  args: {
    id: v.id("personas"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    attributes: v.optional(
      v.object({
        age: v.optional(v.number()),
        gender: v.optional(v.string()),
        occupation: v.optional(v.string()),
        interests: v.optional(v.array(v.string())),
        painPoints: v.optional(v.array(v.string())),
        goals: v.optional(v.array(v.string())),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

/**
 * Delete a persona
 */
export const remove = mutation({
  args: { id: v.id("personas") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
